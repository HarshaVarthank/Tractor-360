import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    const serviceType = searchParams.get('type') || ''
    const priority = searchParams.get('priority') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { serviceId: { contains: q } },
        { problemReported: { contains: q } },
        { tractor: { tractorId: { contains: q } } },
        { tractor: { chassisNumber: { contains: q } } },
        { technician: { name: { contains: q } } },
      ]
    }
    if (status && status !== 'ALL') whereClause.status = status
    if (serviceType && serviceType !== 'ALL') whereClause.serviceType = serviceType
    if (priority && priority !== 'ALL') whereClause.priority = priority

    const services = await prisma.serviceRecord.findMany({
      where: whereClause,
      include: {
        tractor: {
          include: {
            model: true,
            customer: true,
          },
        },
        technician: true,
        serviceParts: {
          include: {
            sparePart: true,
          },
        },
      },
      orderBy: { serviceDate: 'desc' },
    })

    return NextResponse.json(services)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const count = await prisma.serviceRecord.count()
    const serviceId = `SRV-${String(count + 1).padStart(3, '0')}`

    const service = await prisma.serviceRecord.create({
      data: {
        serviceId,
        serviceDate: new Date(body.serviceDate || Date.now()),
        serviceType: body.serviceType || 'SCHEDULED',
        problemReported: body.problemReported,
        workPerformed: body.workPerformed || null,
        cost: parseFloat(body.cost || 0),
        status: body.status || 'NEW',
        priority: body.priority || 'MEDIUM',
        tractorId: body.tractorId,
        technicianId: body.technicianId || null,
        remarks: body.remarks || null,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
