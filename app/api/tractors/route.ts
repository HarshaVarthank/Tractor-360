import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    const region = searchParams.get('region') || ''
    const modelId = searchParams.get('modelId') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (q) {
      whereClause.OR = [
        { tractorId: { contains: q } },
        { chassisNumber: { contains: q } },
        { engineNumber: { contains: q } },
        { registrationNo: { contains: q } },
        { customer: { name: { contains: q } } },
        { dealer: { name: { contains: q } } },
      ]
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    if (region && region !== 'ALL') {
      whereClause.region = region
    }

    if (modelId && modelId !== 'ALL') {
      whereClause.modelId = modelId
    }

    const [tractors, totalCount] = await Promise.all([
      prisma.tractor.findMany({
        where: whereClause,
        include: {
          model: true,
          customer: { select: { id: true, name: true, phone: true, city: true, state: true } },
          dealer: { select: { id: true, name: true, city: true, region: true } },
          warranty: { select: { id: true, status: true, endDate: true } },
          _count: {
            select: {
              serviceRecords: true,
              complaints: true,
            },
          },
        },
        orderBy: { purchaseDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tractor.count({ where: whereClause }),
    ])

    return NextResponse.json({
      tractors,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    })
  } catch (err: any) {
    console.error('Tractors GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      tractorId,
      chassisNumber,
      engineNumber,
      registrationNo,
      color,
      status,
      purchaseDate,
      region,
      modelId,
      customerId,
      dealerId,
    } = body

    const tractor = await prisma.tractor.create({
      data: {
        tractorId,
        chassisNumber,
        engineNumber,
        registrationNo,
        color,
        status: status || 'ACTIVE',
        purchaseDate: new Date(purchaseDate || Date.now()),
        region: region || 'North',
        modelId,
        customerId,
        dealerId,
      },
    })

    return NextResponse.json(tractor, { status: 201 })
  } catch (err: any) {
    console.error('Tractor POST error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
