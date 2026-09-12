import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { customerId: id }],
      },
      include: {
        tractors: {
          include: {
            model: true,
            dealer: true,
            warranty: true,
          },
        },
        sales: {
          include: {
            tractor: { include: { model: true } },
            dealer: true,
          },
        },
        complaints: {
          include: {
            tractor: { include: { model: true } },
            technician: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
