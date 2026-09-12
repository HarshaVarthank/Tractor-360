import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const region = searchParams.get('region') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { dealerId: { contains: q } },
        { city: { contains: q } },
        { ownerName: { contains: q } },
      ]
    }
    if (region && region !== 'ALL') whereClause.region = region

    const dealers = await prisma.dealer.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            tractors: true,
            sales: true,
            spareParts: true,
          },
        },
      },
      orderBy: { joinedDate: 'asc' },
    })

    return NextResponse.json(dealers)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
