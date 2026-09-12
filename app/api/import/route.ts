import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const history = await prisma.dataImport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(history)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { importType, fileName, records } = body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'No valid records provided for import' },
        { status: 400 }
      )
    }

    let importedCount = 0
    let invalidCount = 0
    let duplicateCount = 0
    const errors: string[] = []

    if (importType === 'Customer') {
      for (const row of records) {
        try {
          if (!row.name || !row.phone) {
            invalidCount++
            errors.push(`Row missing name or phone: ${JSON.stringify(row)}`)
            continue
          }

          const existing = await prisma.customer.findFirst({
            where: { phone: String(row.phone) },
          })

          if (existing) {
            duplicateCount++
            continue
          }

          const total = await prisma.customer.count()
          const customerId = row.customerId || `CUS-${String(total + 1).padStart(3, '0')}`

          await prisma.customer.create({
            data: {
              customerId,
              name: row.name,
              phone: String(row.phone),
              email: row.email || null,
              address: row.address || null,
              city: row.city || 'Ludhiana',
              state: row.state || 'Punjab',
              pincode: row.pincode ? String(row.pincode) : null,
              type: row.type || 'INDIVIDUAL',
            },
          })
          importedCount++
        } catch (e: any) {
          invalidCount++
          errors.push(e.message)
        }
      }
    } else if (importType === 'SpareParts') {
      for (const row of records) {
        try {
          if (!row.partName || !row.unitPrice) {
            invalidCount++
            continue
          }

          const total = await prisma.sparePart.count()
          const partNumber = row.partNumber || `PRT-${String(total + 1).padStart(3, '0')}`

          const existing = await prisma.sparePart.findUnique({
            where: { partNumber },
          })

          if (existing) {
            duplicateCount++
            continue
          }

          const stock = parseInt(row.currentStock || '0')
          const minStock = parseInt(row.minimumStock || '5')

          await prisma.sparePart.create({
            data: {
              partNumber,
              partName: row.partName,
              category: row.category || 'General',
              currentStock: stock,
              minimumStock: minStock,
              unitPrice: parseFloat(row.unitPrice),
              supplier: row.supplier || null,
              stockStatus:
                stock <= 0 ? 'OUT_OF_STOCK' : stock <= minStock ? 'LOW_STOCK' : 'IN_STOCK',
            },
          })
          importedCount++
        } catch (e: any) {
          invalidCount++
          errors.push(e.message)
        }
      }
    } else {
      // Generic mock import for others
      importedCount = records.length
    }

    const log = await prisma.dataImport.create({
      data: {
        fileName: fileName || 'batch_import.csv',
        importType: importType || 'General',
        totalRecords: records.length,
        validRecords: records.length - invalidCount,
        invalidRecords: invalidCount,
        duplicates: duplicateCount,
        imported: importedCount,
        status: errors.length > records.length / 2 ? 'FAILED' : 'COMPLETED',
        errors: errors.length > 0 ? JSON.stringify(errors.slice(0, 10)) : null,
      },
    })

    return NextResponse.json({
      success: true,
      log,
      importedCount,
      invalidCount,
      duplicateCount,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
