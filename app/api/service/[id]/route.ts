import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.serviceRecord.update({
      where: { id },
      data: {
        status: body.status,
        technicianId: body.technicianId,
        workPerformed: body.workPerformed,
        cost: body.cost !== undefined ? parseFloat(body.cost) : undefined,
        completedDate: body.status === 'COMPLETED' || body.status === 'CLOSED' ? new Date() : undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
