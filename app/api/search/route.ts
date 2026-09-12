import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''

    if (!q || q.length < 2) {
      return NextResponse.json({
        tractors: [],
        customers: [],
        dealers: [],
        parts: [],
        complaints: [],
      })
    }

    const [tractors, customers, dealers, parts, complaints] = await Promise.all([
      prisma.tractor.findMany({
        where: {
          OR: [
            { tractorId: { contains: q } },
            { chassisNumber: { contains: q } },
            { engineNumber: { contains: q } },
            { registrationNo: { contains: q } },
            { customer: { name: { contains: q } } },
          ],
        },
        take: 6,
        include: {
          model: true,
          customer: { select: { name: true } },
        },
      }),
      prisma.customer.findMany({
        where: {
          OR: [
            { customerId: { contains: q } },
            { name: { contains: q } },
            { phone: { contains: q } },
            { city: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.dealer.findMany({
        where: {
          OR: [
            { dealerId: { contains: q } },
            { name: { contains: q } },
            { city: { contains: q } },
            { ownerName: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.sparePart.findMany({
        where: {
          OR: [
            { partNumber: { contains: q } },
            { partName: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.complaint.findMany({
        where: {
          OR: [
            { complaintId: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
            { tractor: { tractorId: { contains: q } } },
          ],
        },
        take: 5,
        include: {
          tractor: { select: { tractorId: true } },
        },
      }),
    ])

    return NextResponse.json({
      tractors,
      customers,
      dealers,
      parts,
      complaints,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
