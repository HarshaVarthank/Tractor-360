import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const specialization = searchParams.get('specialization') || ''
    const region = searchParams.get('region') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { techId: { contains: q } },
        { city: { contains: q } },
      ]
    }
    if (specialization && specialization !== 'ALL') whereClause.specialization = specialization
    if (region && region !== 'ALL') whereClause.region = region

    const technicians = await prisma.technician.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            serviceRecords: true,
            complaints: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(technicians)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
