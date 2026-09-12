import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const paymentMode = searchParams.get('paymentMode') || ''

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { invoiceNumber: { contains: q } },
        { saleId: { contains: q } },
        { customer: { name: { contains: q } } },
        { tractor: { tractorId: { contains: q } } },
        { dealer: { name: { contains: q } } },
      ]
    }
    if (paymentMode && paymentMode !== 'ALL') {
      whereClause.paymentMode = paymentMode
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        tractor: {
          include: { model: true },
        },
        customer: true,
        dealer: true,
      },
      orderBy: { saleDate: 'desc' },
    })

    const totalRevenue = sales.reduce((acc, s) => acc + s.finalAmount, 0)
    const avgDiscount = sales.length ? sales.reduce((acc, s) => acc + s.discount, 0) / sales.length : 0

    return NextResponse.json({
      sales,
      metrics: {
        totalSalesCount: sales.length,
        totalRevenue,
        avgDiscount,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
