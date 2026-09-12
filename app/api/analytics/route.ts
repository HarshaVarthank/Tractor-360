import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      tractorsByModel,
      tractorsByRegion,
      salesByMonth,
      complaintsByCategory,
      complaintsByPriority,
      serviceCostByType,
      dealerSalesRank,
    ] = await Promise.all([
      prisma.tractor.groupBy({
        by: ['modelId'],
        _count: { id: true },
      }),
      prisma.tractor.groupBy({
        by: ['region'],
        _count: { id: true },
      }),
      prisma.sale.findMany({
        select: {
          saleDate: true,
          finalAmount: true,
        },
        orderBy: { saleDate: 'asc' },
      }),
      prisma.complaint.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
      prisma.complaint.groupBy({
        by: ['priority'],
        _count: { id: true },
      }),
      prisma.serviceRecord.groupBy({
        by: ['serviceType'],
        _sum: { cost: true },
        _count: { id: true },
      }),
      prisma.sale.groupBy({
        by: ['dealerId'],
        _sum: { finalAmount: true },
        _count: { id: true },
      }),
    ])

    // Hydrate models
    const models = await prisma.tractorModel.findMany()
    const modelMap = new Map(models.map((m) => [m.id, m.modelName]))
    const modelData = tractorsByModel.map((item) => ({
      name: modelMap.get(item.modelId) || 'Unknown',
      value: item._count.id,
    }))

    // Hydrate dealers
    const dealers = await prisma.dealer.findMany()
    const dealerMap = new Map(dealers.map((d) => [d.id, d.name]))
    const dealerRank = dealerSalesRank.map((item) => ({
      dealer: dealerMap.get(item.dealerId) || 'Unknown Dealer',
      revenue: item._sum.finalAmount || 0,
      tractorsSold: item._count.id,
    })).sort((a, b) => b.revenue - a.revenue)

    // Aggregate sales by month
    const monthlyMap = new Map<string, number>()
    salesByMonth.forEach((s) => {
      const d = new Date(s.saleDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + s.finalAmount)
    })
    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      amount,
    }))

    return NextResponse.json({
      modelData,
      regionData: tractorsByRegion.map((r) => ({ name: r.region, count: r._count.id })),
      complaintCategories: complaintsByCategory.map((c) => ({ name: c.category, count: c._count.id })),
      complaintPriorities: complaintsByPriority.map((p) => ({ name: p.priority, count: p._count.id })),
      serviceCostByType: serviceCostByType.map((s) => ({
        type: s.serviceType,
        totalCost: s._sum.cost || 0,
        count: s._count.id,
      })),
      monthlyRevenue,
      dealerRank,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
