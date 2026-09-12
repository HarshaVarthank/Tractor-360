import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const city = searchParams.get('city') || ''
    const type = searchParams.get('type') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { customerId: { contains: q } },
        { phone: { contains: q } },
        { city: { contains: q } },
      ]
    }
    if (city && city !== 'ALL') whereClause.city = city
    if (type && type !== 'ALL') whereClause.type = type

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        tractors: {
          include: { model: true },
        },
        _count: {
          select: {
            tractors: true,
            complaints: true,
            sales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(customers)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const count = await prisma.customer.count()
    const customerId = `CUS-${String(count + 1).padStart(3, '0')}`

    const customer = await prisma.customer.create({
      data: {
        customerId,
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        city: body.city || 'Ludhiana',
        state: body.state || 'Punjab',
        pincode: body.pincode || null,
        type: body.type || 'INDIVIDUAL',
        companyName: body.companyName || null,
      },
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
