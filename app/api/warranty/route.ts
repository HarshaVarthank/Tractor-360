import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { warrantyId: { contains: q } },
        { tractor: { tractorId: { contains: q } } },
        { tractor: { chassisNumber: { contains: q } } },
        { tractor: { customer: { name: { contains: q } } } },
      ]
    }
    if (status && status !== 'ALL') whereClause.status = status

    const warranties = await prisma.warranty.findMany({
      where: whereClause,
      include: {
        tractor: {
          include: {
            model: true,
            customer: true,
          },
        },
        claims: {
          orderBy: { claimDate: 'desc' },
        },
      },
      orderBy: { endDate: 'asc' },
    })

    const claims = await prisma.warrantyClaim.findMany({
      include: {
        warranty: {
          include: {
            tractor: { include: { model: true, customer: true } },
          },
        },
      },
      orderBy: { claimDate: 'desc' },
    })

    return NextResponse.json({
      warranties,
      claims,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
