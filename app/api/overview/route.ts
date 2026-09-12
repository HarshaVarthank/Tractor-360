import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalTractors,
      activeTractors,
      underServiceTractors,
      totalCustomers,
      totalSales,
      salesRevenueAgg,
      openComplaints,
      pendingService,
      lowStockParts,
      activeWarranties,
      recentComplaints,
      recentServices,
      modelsDistribution,
      regionDistribution,
    ] = await Promise.all([
      prisma.tractor.count(),
      prisma.tractor.count({ where: { status: 'ACTIVE' } }),
      prisma.tractor.count({ where: { status: 'UNDER_SERVICE' } }),
      prisma.customer.count(),
      prisma.sale.count(),
      prisma.sale.aggregate({ _sum: { finalAmount: true } }),
      prisma.complaint.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS', 'ESCALATED'] } } }),
      prisma.serviceRecord.count({ where: { status: { in: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_PART'] } } }),
      prisma.sparePart.count({ where: { currentStock: { lte: 10 } } }),
      prisma.warranty.count({ where: { status: 'ACTIVE' } }),
      prisma.complaint.findMany({
        take: 5,
        orderBy: { createdDate: 'desc' },
        include: {
          tractor: { select: { tractorId: true, chassisNumber: true } },
          customer: { select: { name: true, phone: true } },
        },
      }),
      prisma.serviceRecord.findMany({
        take: 5,
        orderBy: { serviceDate: 'desc' },
        include: {
          tractor: { select: { tractorId: true, chassisNumber: true } },
          technician: { select: { name: true, specialization: true } },
        },
      }),
      prisma.tractor.groupBy({
        by: ['modelId'],
        _count: { id: true },
      }),
      prisma.tractor.groupBy({
        by: ['region'],
        _count: { id: true },
      }),
    ])

    // Hydrate model names
    const modelDetails = await prisma.tractorModel.findMany()
    const modelMap = new Map(modelDetails.map((m) => [m.id, m.modelName]))
    const formattedModels = modelsDistribution.map((m) => ({
      name: modelMap.get(m.modelId) || 'Unknown',
      count: m._count.id,
    }))

    const formattedRegions = regionDistribution.map((r) => ({
      region: r.region || 'Central',
      tractors: r._count.id,
    }))

    return NextResponse.json({
      metrics: {
        totalTractors,
        activeTractors,
        underServiceTractors,
        totalCustomers,
        totalSales,
        totalRevenue: salesRevenueAgg._sum.finalAmount || 0,
        openComplaints,
        pendingService,
        lowStockParts,
        activeWarranties,
      },
      modelsDistribution: formattedModels,
      regionDistribution: formattedRegions,
      recentComplaints,
      recentServices,
    })
  } catch (err: any) {
    console.error('Overview API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
