import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const dealer = await prisma.dealer.findFirst({
      where: {
        OR: [{ id }, { dealerId: id }],
      },
      include: {
        tractors: {
          include: {
            model: true,
            customer: true,
          },
        },
        sales: {
          include: {
            tractor: { include: { model: true } },
            customer: true,
          },
        },
        spareParts: true,
      },
    })

    if (!dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    return NextResponse.json(dealer)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
