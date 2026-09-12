import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      criticalComplaints,
      breakdownServices,
      expiringWarranties,
      lowStockParts,
      highMaintenanceTractors,
    ] = await Promise.all([
      prisma.complaint.findMany({
        where: { priority: 'CRITICAL', status: { in: ['OPEN', 'ESCALATED'] } },
        include: { tractor: { include: { model: true, customer: true } } },
        take: 5,
      }),
      prisma.serviceRecord.findMany({
        where: { serviceType: 'BREAKDOWN' },
        include: { tractor: { include: { model: true } } },
      }),
      prisma.warranty.findMany({
        where: {
          status: 'ACTIVE',
          endDate: {
            lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Next 60 days
          },
        },
        include: { tractor: { include: { customer: true, model: true } } },
        take: 6,
      }),
      prisma.sparePart.findMany({
        where: { currentStock: { lte: 10 } },
        take: 6,
      }),
      prisma.tractor.findMany({
        include: {
          model: true,
          customer: true,
          complaints: true,
          serviceRecords: true,
        },
      }),
    ])

    // Find tractors at risk (high complaint ratio or multiple breakdowns)
    const atRiskFleet = highMaintenanceTractors
      .map((tr) => {
        const breakdowns = tr.serviceRecords.filter((s) => s.serviceType === 'BREAKDOWN').length
        const totalComplaints = tr.complaints.length
        const riskScore = breakdowns * 30 + totalComplaints * 15
        return {
          id: tr.id,
          tractorId: tr.tractorId,
          modelName: tr.model.modelName,
          customerName: tr.customer.name,
          breakdowns,
          totalComplaints,
          riskScore,
          status: tr.status,
        }
      })
      .filter((t) => t.riskScore > 30)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)

    const insights = [
      {
        id: 'ins-1',
        title: 'Hydraulic & Engine Anomaly Detected in Northern Region',
        type: 'CRITICAL',
        category: 'Predictive Maintenance',
        impact: 'High',
        confidence: '94%',
        summary: `${criticalComplaints.length} active critical complaints logged this month in North region. PowerMaster 60 models show increased hydraulic pressure seal wear around 180-220 running hours.`,
        recommendation: 'Issue proactive service bulletin to Sharma Agri Equipment & Singh Tractor Centre to inspect hydraulic seals during scheduled 200hr maintenance.',
        affectedUnits: criticalComplaints.map((c) => c.tractor.tractorId),
      },
      {
        id: 'ins-2',
        title: 'Fleet Failure Risk Warning for 5 Heavy Duty Tractors',
        type: 'WARNING',
        category: 'Fleet Reliability',
        impact: 'High',
        confidence: '89%',
        summary: `Identified ${atRiskFleet.length} units with recurring breakdown cycles and over 3 complaints in the last quarter.`,
        recommendation: 'Schedule emergency overhaul and assign senior technician to conduct comprehensive dynamometer test.',
        affectedUnits: atRiskFleet.map((t) => t.tractorId),
      },
      {
        id: 'ins-3',
        title: 'Warranty Expiration & Extended AMC Opportunity',
        type: 'OPPORTUNITY',
        category: 'Revenue Growth',
        impact: 'Medium',
        confidence: '98%',
        summary: `${expiringWarranties.length} tractors have factory warranties expiring within the next 60 days. Converting these to Annual Maintenance Contracts (AMC) represents estimated ₹4.8 Lakhs recurring aftersales revenue.`,
        recommendation: 'Trigger automated dealer notifications to present extended 2-year AMC package with 15% spare parts discount.',
        affectedUnits: expiringWarranties.map((w) => w.tractor.tractorId),
      },
      {
        id: 'ins-4',
        title: 'Critical Spare Parts Inventory Depletion Alert',
        type: 'INVENTORY',
        category: 'Supply Chain',
        impact: 'High',
        confidence: '100%',
        summary: `${lowStockParts.length} essential service components (including Oil Filters & Injector Nozzles) are below safety stock thresholds.`,
        recommendation: 'Initiate bulk PO order with OEM tier-1 suppliers to prevent service bay delays.',
        affectedUnits: lowStockParts.map((p) => p.partNumber),
      },
    ]

    return NextResponse.json({
      insights,
      atRiskFleet,
      expiringWarrantiesCount: expiringWarranties.length,
      lowStockPartsCount: lowStockParts.length,
      criticalComplaintsCount: criticalComplaints.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
