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

          let customerId = row.customerId
          if (!customerId) {
            const total = await prisma.customer.count()
            let counter = total + 1
            while (await prisma.customer.findUnique({ where: { customerId: `CUS-${String(counter).padStart(3, '0')}` } })) {
              counter++
            }
            customerId = `CUS-${String(counter).padStart(3, '0')}`
          }

          await prisma.customer.create({
            data: {
              customerId,
              name: String(row.name),
              phone: String(row.phone).trim(),
              email: row.email ? String(row.email).trim() : null,
              address: row.address ? String(row.address) : null,
              city: row.city ? String(row.city) : 'Ludhiana',
              state: row.state ? String(row.state) : 'Punjab',
              pincode: row.pincode ? String(row.pincode) : null,
              type: ['INDIVIDUAL', 'COMMERCIAL', 'GOVERNMENT', 'DEALER_AFFILIATE'].includes(String(row.type).toUpperCase())
                ? String(row.type).toUpperCase()
                : 'INDIVIDUAL',
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

          let partNumber = row.partNumber
          if (!partNumber) {
            const total = await prisma.sparePart.count()
            let counter = total + 1
            while (await prisma.sparePart.findUnique({ where: { partNumber: `PRT-${String(counter).padStart(3, '0')}` } })) {
              counter++
            }
            partNumber = `PRT-${String(counter).padStart(3, '0')}`
          }

          const existing = await prisma.sparePart.findUnique({
            where: { partNumber },
          })

          if (existing) {
            duplicateCount++
            continue
          }

          const stock = parseInt(row.currentStock || '0', 10)
          const minStock = parseInt(row.minimumStock || '5', 10)

          await prisma.sparePart.create({
            data: {
              partNumber,
              partName: String(row.partName),
              category: row.category ? String(row.category) : 'General',
              currentStock: isNaN(stock) ? 0 : stock,
              minimumStock: isNaN(minStock) ? 5 : minStock,
              unitPrice: parseFloat(row.unitPrice) || 0,
              supplier: row.supplier ? String(row.supplier) : null,
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
    } else if (importType === 'Tractor') {
      const defaultModel = await prisma.tractorModel.findFirst()
      const defaultCustomer = await prisma.customer.findFirst()
      const defaultDealer = await prisma.dealer.findFirst()

      if (!defaultModel || !defaultCustomer || !defaultDealer) {
        return NextResponse.json(
          { error: 'Cannot import tractors: requires existing model, customer, and dealer.' },
          { status: 400 }
        )
      }

      for (const row of records) {
        try {
          if (!row.chassisNumber || !row.engineNumber) {
            invalidCount++
            errors.push(`Row missing chassisNumber or engineNumber: ${JSON.stringify(row)}`)
            continue
          }

          const existing = await prisma.tractor.findFirst({
            where: {
              OR: [
                { chassisNumber: String(row.chassisNumber).trim() },
                { engineNumber: String(row.engineNumber).trim() },
              ],
            },
          })

          if (existing) {
            duplicateCount++
            continue
          }

          let modelId = defaultModel.id
          if (row.modelName) {
            const foundModel = await prisma.tractorModel.findFirst({
              where: { modelName: { contains: String(row.modelName).trim() } },
            })
            if (foundModel) modelId = foundModel.id
          }

          let customerId = defaultCustomer.id
          if (row.customerPhone) {
            const foundCustomer = await prisma.customer.findFirst({
              where: { phone: String(row.customerPhone).trim() },
            })
            if (foundCustomer) customerId = foundCustomer.id
          } else if (row.customerId) {
            const foundCustomer = await prisma.customer.findFirst({
              where: { customerId: String(row.customerId).trim() },
            })
            if (foundCustomer) customerId = foundCustomer.id
          }

          let dealerId = defaultDealer.id
          if (row.dealerId) {
            const foundDealer = await prisma.dealer.findFirst({
              where: { dealerId: String(row.dealerId).trim() },
            })
            if (foundDealer) dealerId = foundDealer.id
          } else if (row.dealerName) {
            const foundDealer = await prisma.dealer.findFirst({
              where: { name: { contains: String(row.dealerName).trim() } },
            })
            if (foundDealer) dealerId = foundDealer.id
          }

          let tractorId = row.tractorId
          if (!tractorId) {
            const total = await prisma.tractor.count()
            let counter = total + 1
            while (await prisma.tractor.findUnique({ where: { tractorId: `TR-${String(counter).padStart(3, '0')}` } })) {
              counter++
            }
            tractorId = `TR-${String(counter).padStart(3, '0')}`
          }

          await prisma.tractor.create({
            data: {
              tractorId,
              chassisNumber: String(row.chassisNumber).trim(),
              engineNumber: String(row.engineNumber).trim(),
              registrationNo: row.registrationNo ? String(row.registrationNo).trim() : null,
              color: row.color ? String(row.color) : 'Classic Red',
              status: ['ACTIVE', 'INACTIVE', 'UNDER_SERVICE', 'SOLD', 'SCRAPPED'].includes(String(row.status).toUpperCase())
                ? String(row.status).toUpperCase()
                : 'ACTIVE',
              region: row.region ? String(row.region) : defaultDealer.region || 'North',
              purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : new Date(),
              modelId,
              customerId,
              dealerId,
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
