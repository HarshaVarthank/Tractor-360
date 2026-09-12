import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const priority = searchParams.get('priority') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { complaintId: { contains: q } },
        { description: { contains: q } },
        { tractor: { tractorId: { contains: q } } },
        { customer: { name: { contains: q } } },
      ]
    }
    if (status && status !== 'ALL') whereClause.status = status
    if (category && category !== 'ALL') whereClause.category = category
    if (priority && priority !== 'ALL') whereClause.priority = priority

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        tractor: {
          include: { model: true },
        },
        customer: true,
        technician: true,
      },
      orderBy: { createdDate: 'desc' },
    })

    return NextResponse.json(complaints)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const count = await prisma.complaint.count()
    const complaintId = `CMP-${String(count + 1).padStart(3, '0')}`

    const complaint = await prisma.complaint.create({
      data: {
        complaintId,
        category: body.category || 'Engine',
        description: body.description,
        priority: body.priority || 'MEDIUM',
        status: body.status || 'OPEN',
        tractorId: body.tractorId,
        customerId: body.customerId,
        technicianId: body.technicianId || null,
        remarks: body.remarks || null,
      },
    })

    return NextResponse.json(complaint, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
