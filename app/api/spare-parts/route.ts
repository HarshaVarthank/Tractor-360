import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const stockStatus = searchParams.get('status') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { partNumber: { contains: q } },
        { partName: { contains: q } },
        { supplier: { contains: q } },
      ]
    }
    if (category && category !== 'ALL') whereClause.category = category
    if (stockStatus && stockStatus !== 'ALL') whereClause.stockStatus = stockStatus

    const parts = await prisma.sparePart.findMany({
      where: whereClause,
      include: {
        dealer: true,
        _count: {
          select: { serviceParts: true },
        },
      },
      orderBy: { currentStock: 'asc' },
    })

    return NextResponse.json(parts)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const count = await prisma.sparePart.count()
    const partNumber = body.partNumber || `PRT-${String(count + 1).padStart(3, '0')}`

    const part = await prisma.sparePart.create({
      data: {
        partNumber,
        partName: body.partName,
        category: body.category || 'Engine',
        currentStock: parseInt(body.currentStock || '0'),
        minimumStock: parseInt(body.minimumStock || '5'),
        unitPrice: parseFloat(body.unitPrice || '0'),
        supplier: body.supplier || null,
        stockStatus:
          parseInt(body.currentStock || '0') <= 0
            ? 'OUT_OF_STOCK'
            : parseInt(body.currentStock || '0') <= parseInt(body.minimumStock || '5')
            ? 'LOW_STOCK'
            : 'IN_STOCK',
        description: body.description || null,
      },
    })
    return NextResponse.json(part, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
