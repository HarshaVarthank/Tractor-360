import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: body.status,
        resolution: body.resolution,
        technicianId: body.technicianId,
        priority: body.priority,
        resolvedDate: body.status === 'RESOLVED' || body.status === 'CLOSED' ? new Date() : undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
