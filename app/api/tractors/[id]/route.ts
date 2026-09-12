import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tractor = await prisma.tractor.findFirst({
      where: {
        OR: [{ id }, { tractorId: id }, { chassisNumber: id }],
      },
      include: {
        model: true,
        customer: {
          include: {
            tractors: {
              select: { id: true, tractorId: true, status: true, model: { select: { modelName: true } } },
            },
          },
        },
        dealer: true,
        sale: true,
        warranty: {
          include: {
            claims: {
              orderBy: { claimDate: 'desc' },
            },
          },
        },
        serviceRecords: {
          orderBy: { serviceDate: 'desc' },
          include: {
            technician: true,
            serviceParts: {
              include: {
                sparePart: true,
              },
            },
          },
        },
        complaints: {
          orderBy: { createdDate: 'desc' },
          include: {
            technician: true,
          },
        },
      },
    })

    if (!tractor) {
      return NextResponse.json({ error: 'Tractor not found' }, { status: 404 })
    }

    // Compute Health Score & Lifecycle Metrics
    const totalServices = tractor.serviceRecords.length
    const totalComplaints = tractor.complaints.length
    const criticalComplaints = tractor.complaints.filter(
      (c) => c.priority === 'CRITICAL' || c.priority === 'HIGH'
    ).length
    const totalMaintenanceCost = tractor.serviceRecords.reduce(
      (acc, s) => acc + s.cost,
      0
    )

    // Base score 100
    let healthScore = 100
    healthScore -= criticalComplaints * 12
    healthScore -= (totalComplaints - criticalComplaints) * 5
    if (tractor.status === 'UNDER_SERVICE') healthScore -= 10
    if (tractor.status === 'INACTIVE') healthScore -= 25
    healthScore = Math.max(15, Math.min(100, healthScore))

    return NextResponse.json({
      ...tractor,
      metrics: {
        healthScore,
        totalServices,
        totalComplaints,
        criticalComplaints,
        totalMaintenanceCost,
      },
    })
  } catch (err: any) {
    console.error('Tractor 360 GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
