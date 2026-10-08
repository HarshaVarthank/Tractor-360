import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Tractor 360° database...')

  // ─── CLEAN EXISTING DATA ────────────────────────────────────────────────────
  await prisma.servicePart.deleteMany()
  await prisma.serviceRecord.deleteMany()
  await prisma.warrantyClaim.deleteMany()
  await prisma.warranty.deleteMany()
  await prisma.complaint.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.tractor.deleteMany()
  await prisma.sparePart.deleteMany()
  await prisma.tractorModel.deleteMany()
  await prisma.technician.deleteMany()
  await prisma.dealer.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.dataImport.deleteMany()

  // ─── USERS ──────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = await Promise.all([
    prisma.user.create({ data: { email: 'admin@tractor360.com', name: 'Rajesh Kumar', password: hashedPassword, role: 'ADMIN', phone: '9876543210' } }),
    prisma.user.create({ data: { email: 'manager@tractor360.com', name: 'Priya Sharma', password: hashedPassword, role: 'MANAGER', phone: '9876543211' } }),
    prisma.user.create({ data: { email: 'service@tractor360.com', name: 'Amit Singh', password: hashedPassword, role: 'SERVICE_MANAGER', phone: '9876543212' } }),
    prisma.user.create({ data: { email: 'viewer@tractor360.com', name: 'Sunita Devi', password: hashedPassword, role: 'VIEWER', phone: '9876543213' } }),
  ])
  console.log(`✅ Created ${users.length} users`)

  // ─── TRACTOR MODELS ─────────────────────────────────────────────────────────
  const models = await Promise.all([
    prisma.tractorModel.create({ data: { modelCode: 'PM-45', modelName: 'PowerMaster 45', category: '45HP', horsePower: 45, engineType: 'Diesel', description: 'Ideal for small to medium farms' } }),
    prisma.tractorModel.create({ data: { modelCode: 'PM-55', modelName: 'PowerMaster 55', category: '55HP', horsePower: 55, engineType: 'Diesel', description: 'Versatile workhorse for medium farms' } }),
    prisma.tractorModel.create({ data: { modelCode: 'PM-60', modelName: 'PowerMaster 60', category: '60HP', horsePower: 60, engineType: 'Diesel', description: 'Heavy duty for large agricultural operations' } }),
    prisma.tractorModel.create({ data: { modelCode: 'AG-75', modelName: 'AgriKing 75', category: '75HP', horsePower: 75, engineType: 'Diesel', description: 'Premium model for commercial farming' } }),
    prisma.tractorModel.create({ data: { modelCode: 'AG-50', modelName: 'AgriKing 50', category: '50HP', horsePower: 50, engineType: 'Diesel', description: 'Balanced power and efficiency' } }),
    prisma.tractorModel.create({ data: { modelCode: 'CR-35', modelName: 'CropRider 35', category: '35HP', horsePower: 35, engineType: 'Diesel', description: 'Compact and maneuverable for smaller plots' } }),
  ])
  console.log(`✅ Created ${models.length} tractor models`)

  // ─── DEALERS ────────────────────────────────────────────────────────────────
  const dealerData = [
    { dealerId: 'DLR-001', name: 'Sharma Agri Equipment', ownerName: 'Ramesh Sharma', phone: '9811234567', email: 'sharma.agri@gmail.com', address: '12, Market Road', city: 'Ludhiana', state: 'Punjab', pincode: '141001', region: 'North', joinedDate: new Date('2018-04-01') },
    { dealerId: 'DLR-002', name: 'Krishna Farm Machinery', ownerName: 'Suresh Krishna', phone: '9822345678', email: 'krishna.farm@gmail.com', address: '45, Industrial Area', city: 'Pune', state: 'Maharashtra', pincode: '411001', region: 'West', joinedDate: new Date('2019-01-15') },
    { dealerId: 'DLR-003', name: 'Patel Tractor House', ownerName: 'Dinesh Patel', phone: '9833456789', email: 'patel.tractors@gmail.com', address: '78, Ring Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', region: 'West', joinedDate: new Date('2017-07-20') },
    { dealerId: 'DLR-004', name: 'Reddy Agro Machines', ownerName: 'Venkat Reddy', phone: '9844567890', email: 'reddy.agro@gmail.com', address: '23, Nampally', city: 'Hyderabad', state: 'Telangana', pincode: '500001', region: 'South', joinedDate: new Date('2020-03-10') },
    { dealerId: 'DLR-005', name: 'Mukherjee Farm Solutions', ownerName: 'Subhash Mukherjee', phone: '9855678901', email: 'mukherjee.farm@gmail.com', address: '34, Strand Road', city: 'Kolkata', state: 'West Bengal', pincode: '700001', region: 'East', joinedDate: new Date('2019-09-05') },
    { dealerId: 'DLR-006', name: 'Singh Tractor Centre', ownerName: 'Gurpreet Singh', phone: '9866789012', email: 'singh.tractors@gmail.com', address: '56, GT Road', city: 'Amritsar', state: 'Punjab', pincode: '143001', region: 'North', joinedDate: new Date('2018-11-20') },
    { dealerId: 'DLR-007', name: 'Nair Agricultural Depot', ownerName: 'Rajan Nair', phone: '9877890123', email: 'nair.agri@gmail.com', address: '89, NH 17', city: 'Kochi', state: 'Kerala', pincode: '682001', region: 'South', joinedDate: new Date('2021-02-14') },
    { dealerId: 'DLR-008', name: 'Gupta Kisan Machinery', ownerName: 'Mohan Gupta', phone: '9888901234', email: 'gupta.kisan@gmail.com', address: '11, Agra Road', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001', region: 'North', joinedDate: new Date('2016-06-30') },
    { dealerId: 'DLR-009', name: 'Choudhary Agri World', ownerName: 'Bharat Choudhary', phone: '9899012345', email: 'choudhary.agri@gmail.com', address: '67, Station Road', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', region: 'North', joinedDate: new Date('2020-08-22') },
    { dealerId: 'DLR-010', name: 'Rao Tractor Emporium', ownerName: 'Srinivas Rao', phone: '9800123456', email: 'rao.tractors@gmail.com', address: '32, Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', region: 'South', joinedDate: new Date('2017-12-01') },
  ]
  const dealers = await Promise.all(dealerData.map(d => prisma.dealer.create({ data: d })))
  console.log(`✅ Created ${dealers.length} dealers`)

  // ─── TECHNICIANS ────────────────────────────────────────────────────────────
  const techData = [
    { techId: 'TECH-001', name: 'Arvind Mehta', phone: '9712345678', specialization: 'Engine', city: 'Ludhiana', state: 'Punjab', region: 'North', joinedDate: new Date('2019-05-01') },
    { techId: 'TECH-002', name: 'Sunil Verma', phone: '9723456789', specialization: 'Hydraulic', city: 'Pune', state: 'Maharashtra', region: 'West', joinedDate: new Date('2020-01-15') },
    { techId: 'TECH-003', name: 'Ravi Shankar', phone: '9734567890', specialization: 'Electrical', city: 'Ahmedabad', state: 'Gujarat', region: 'West', joinedDate: new Date('2018-09-20') },
    { techId: 'TECH-004', name: 'Manoj Tiwari', phone: '9745678901', specialization: 'General', city: 'Hyderabad', state: 'Telangana', region: 'South', joinedDate: new Date('2021-03-10') },
    { techId: 'TECH-005', name: 'Deepak Joshi', phone: '9756789012', specialization: 'Engine', city: 'Kolkata', state: 'West Bengal', region: 'East', joinedDate: new Date('2019-11-05') },
    { techId: 'TECH-006', name: 'Prakash Yadav', phone: '9767890123', specialization: 'Transmission', city: 'Amritsar', state: 'Punjab', region: 'North', joinedDate: new Date('2017-07-20') },
    { techId: 'TECH-007', name: 'Ganesh Babu', phone: '9778901234', specialization: 'Hydraulic', city: 'Chennai', state: 'Tamil Nadu', region: 'South', joinedDate: new Date('2022-02-14') },
    { techId: 'TECH-008', name: 'Ramesh Patil', phone: '9789012345', specialization: 'General', city: 'Nagpur', state: 'Maharashtra', region: 'West', joinedDate: new Date('2020-08-01') },
    { techId: 'TECH-009', name: 'Ashok Kumar', phone: '9790123456', specialization: 'Electrical', city: 'Jaipur', state: 'Rajasthan', region: 'North', joinedDate: new Date('2018-04-30') },
    { techId: 'TECH-010', name: 'Santosh Mishra', phone: '9701234567', specialization: 'Engine', city: 'Mathura', state: 'Uttar Pradesh', region: 'North', joinedDate: new Date('2021-10-15') },
    { techId: 'TECH-011', name: 'Vikas Shinde', phone: '9712340001', specialization: 'Hydraulic', city: 'Pune', state: 'Maharashtra', region: 'West', joinedDate: new Date('2019-06-20') },
    { techId: 'TECH-012', name: 'Naresh Gupta', phone: '9712340002', specialization: 'Transmission', city: 'Delhi', state: 'Delhi', region: 'North', joinedDate: new Date('2020-03-05') },
    { techId: 'TECH-013', name: 'Pradeep Nair', phone: '9712340003', specialization: 'General', city: 'Kochi', state: 'Kerala', region: 'South', joinedDate: new Date('2022-07-01') },
    { techId: 'TECH-014', name: 'Suresh Pillai', phone: '9712340004', specialization: 'Engine', city: 'Thiruvananthapuram', state: 'Kerala', region: 'South', joinedDate: new Date('2021-01-10') },
    { techId: 'TECH-015', name: 'Ajay Rawat', phone: '9712340005', specialization: 'Electrical', city: 'Dehradun', state: 'Uttarakhand', region: 'North', joinedDate: new Date('2018-11-25') },
    { techId: 'TECH-016', name: 'Mohan Das', phone: '9712340006', specialization: 'Hydraulic', city: 'Bhubaneswar', state: 'Odisha', region: 'East', joinedDate: new Date('2020-09-15') },
    { techId: 'TECH-017', name: 'Vikram Singh', phone: '9712340007', specialization: 'General', city: 'Chandigarh', state: 'Chandigarh', region: 'North', joinedDate: new Date('2019-04-01') },
    { techId: 'TECH-018', name: 'Surya Prakash', phone: '9712340008', specialization: 'Transmission', city: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South', joinedDate: new Date('2021-08-20') },
    { techId: 'TECH-019', name: 'Harish Babu', phone: '9712340009', specialization: 'Engine', city: 'Coimbatore', state: 'Tamil Nadu', region: 'South', joinedDate: new Date('2020-05-10') },
    { techId: 'TECH-020', name: 'Dinesh Rawat', phone: '9712340010', specialization: 'General', city: 'Agra', state: 'Uttar Pradesh', region: 'North', joinedDate: new Date('2017-03-15') },
  ]
  const technicians = await Promise.all(techData.map(t => prisma.technician.create({ data: t })))
  console.log(`✅ Created ${technicians.length} technicians`)

  // ─── CUSTOMERS ──────────────────────────────────────────────────────────────
  const customerData = [
    { customerId: 'CUS-001', name: 'Ramesh Yadav', phone: '9871234001', city: 'Ludhiana', state: 'Punjab', address: 'Village Khanna, Near Water Tank' },
    { customerId: 'CUS-002', name: 'Suresh Patil', phone: '9871234002', city: 'Pune', state: 'Maharashtra', address: 'Shivaji Nagar, Block 4' },
    { customerId: 'CUS-003', name: 'Arun Kumar', phone: '9871234003', city: 'Ahmedabad', state: 'Gujarat', address: '23 Patel Colony' },
    { customerId: 'CUS-004', name: 'Venkatesh Reddy', phone: '9871234004', city: 'Hyderabad', state: 'Telangana', address: 'Secunderabad West, Plot 45' },
    { customerId: 'CUS-005', name: 'Biplab Das', phone: '9871234005', city: 'Kolkata', state: 'West Bengal', address: 'Belghoria, HB Block' },
    { customerId: 'CUS-006', name: 'Jaswinder Singh', phone: '9871234006', city: 'Amritsar', state: 'Punjab', address: 'Majitha Road, House 56' },
    { customerId: 'CUS-007', name: 'Krishnadas Nair', phone: '9871234007', city: 'Kochi', state: 'Kerala', address: 'Ernakulam South, MG Road' },
    { customerId: 'CUS-008', name: 'Harendra Gupta', phone: '9871234008', city: 'Mathura', state: 'Uttar Pradesh', address: 'Sadar Bazar, Shop 12' },
    { customerId: 'CUS-009', name: 'Mahipal Choudhary', phone: '9871234009', city: 'Jaipur', state: 'Rajasthan', address: 'Malviya Nagar, C Block' },
    { customerId: 'CUS-010', name: 'Panduranga Rao', phone: '9871234010', city: 'Chennai', state: 'Tamil Nadu', address: 'T Nagar, 4th Street' },
    { customerId: 'CUS-011', name: 'Gurbaksh Gill', phone: '9871234011', city: 'Jalandhar', state: 'Punjab', address: 'Model Town, Ext.' },
    { customerId: 'CUS-012', name: 'Santosh Thorat', phone: '9871234012', city: 'Nashik', state: 'Maharashtra', address: 'Cidco Colony, N4' },
    { customerId: 'CUS-013', name: 'Rajnikant Shah', phone: '9871234013', city: 'Surat', state: 'Gujarat', address: 'Adajan, near Raj Park' },
    { customerId: 'CUS-014', name: 'Laxman Deshmukh', phone: '9871234014', city: 'Aurangabad', state: 'Maharashtra', address: 'Cidco N1, Sector 7' },
    { customerId: 'CUS-015', name: 'Narayana Swamy', phone: '9871234015', city: 'Bengaluru', state: 'Karnataka', address: 'Jayanagar 4th Block' },
    { customerId: 'CUS-016', name: 'Baldev Dhaliwal', phone: '9871234016', city: 'Patiala', state: 'Punjab', address: 'Urban Estate Phase 2' },
    { customerId: 'CUS-017', name: 'Hanumant Shinde', phone: '9871234017', city: 'Kolhapur', state: 'Maharashtra', address: 'Tarabai Park' },
    { customerId: 'CUS-018', name: 'Mukesh Ahuja', phone: '9871234018', city: 'Rohtak', state: 'Haryana', address: 'Model Town, Sector 3' },
    { customerId: 'CUS-019', name: 'Dilip Barua', phone: '9871234019', city: 'Guwahati', state: 'Assam', address: 'Dispur Colony' },
    { customerId: 'CUS-020', name: 'Pappu Prasad', phone: '9871234020', city: 'Patna', state: 'Bihar', address: 'Boring Road, Rajendra Nagar' },
    { customerId: 'CUS-021', name: 'Chandrakant Patel', phone: '9871234021', city: 'Vadodara', state: 'Gujarat', address: 'Akota, near Saibaba Temple' },
    { customerId: 'CUS-022', name: 'Mohan Lal Sharma', phone: '9871234022', city: 'Jodhpur', state: 'Rajasthan', address: 'Ratanada, Shastri Nagar' },
    { customerId: 'CUS-023', name: 'Ghanshyam Tiwari', phone: '9871234023', city: 'Varanasi', state: 'Uttar Pradesh', address: 'Sigra Colony' },
    { customerId: 'CUS-024', name: 'Ravindra Kaur', phone: '9871234024', city: 'Mohali', state: 'Punjab', address: 'Phase 7, Sector 61' },
    { customerId: 'CUS-025', name: 'Sarita Devi', phone: '9871234025', city: 'Ranchi', state: 'Jharkhand', address: 'Harmu Housing Colony' },
    { customerId: 'CUS-026', name: 'Jitendra Kumar', phone: '9871234026', city: 'Muzaffarpur', state: 'Bihar', address: 'Brahmpura, near Clock Tower' },
    { customerId: 'CUS-027', name: 'Premchand Meena', phone: '9871234027', city: 'Ajmer', state: 'Rajasthan', address: 'Vaishali Nagar, Block B' },
    { customerId: 'CUS-028', name: 'Annapurna Reddy', phone: '9871234028', city: 'Vijayawada', state: 'Andhra Pradesh', address: 'Governorpet, 1st Line' },
    { customerId: 'CUS-029', name: 'Subbaiah Murugan', phone: '9871234029', city: 'Madurai', state: 'Tamil Nadu', address: 'Anna Nagar, 4th Main' },
    { customerId: 'CUS-030', name: 'Roop Chand Verma', phone: '9871234030', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Indira Nagar, Sector 25' },
  ]
  const customers = await Promise.all(customerData.map(c => prisma.customer.create({ data: c })))
  console.log(`✅ Created ${customers.length} customers`)

  // ─── SPARE PARTS ────────────────────────────────────────────────────────────
  const sparePartsData = [
    { partNumber: 'PRT-001', partName: 'Hydraulic Filter', category: 'Hydraulic', currentStock: 45, minimumStock: 10, unitPrice: 850, supplier: 'Bosch India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-002', partName: 'Engine Oil Filter', category: 'Engine', currentStock: 60, minimumStock: 15, unitPrice: 450, supplier: 'Mahle Filters', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-003', partName: 'Air Filter Assembly', category: 'Engine', currentStock: 8, minimumStock: 10, unitPrice: 1200, supplier: 'Donaldson India', stockStatus: 'LOW_STOCK' },
    { partNumber: 'PRT-004', partName: 'Fuel Filter', category: 'Engine', currentStock: 35, minimumStock: 10, unitPrice: 650, supplier: 'Mahle Filters', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-005', partName: 'Clutch Plate Set', category: 'Transmission', currentStock: 12, minimumStock: 5, unitPrice: 4500, supplier: 'LuK India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-006', partName: 'Brake Shoe Pair', category: 'Brake', currentStock: 3, minimumStock: 8, unitPrice: 1800, supplier: 'Minda Industries', stockStatus: 'LOW_STOCK' },
    { partNumber: 'PRT-007', partName: 'Battery 12V 88AH', category: 'Electrical', currentStock: 20, minimumStock: 5, unitPrice: 6500, supplier: 'Amaron India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-008', partName: 'Alternator Assembly', category: 'Electrical', currentStock: 0, minimumStock: 3, unitPrice: 8500, supplier: 'Valeo India', stockStatus: 'OUT_OF_STOCK' },
    { partNumber: 'PRT-009', partName: 'Hydraulic Pump', category: 'Hydraulic', currentStock: 7, minimumStock: 5, unitPrice: 12500, supplier: 'Parker India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-010', partName: 'Power Steering Fluid', category: 'Hydraulic', currentStock: 50, minimumStock: 20, unitPrice: 350, supplier: 'Castrol India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-011', partName: 'V-Belt Set', category: 'Engine', currentStock: 25, minimumStock: 10, unitPrice: 950, supplier: 'Gates India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-012', partName: 'Injector Nozzle', category: 'Engine', currentStock: 4, minimumStock: 6, unitPrice: 3200, supplier: 'Bosch India', stockStatus: 'LOW_STOCK' },
    { partNumber: 'PRT-013', partName: 'Tie Rod End', category: 'Body', currentStock: 18, minimumStock: 5, unitPrice: 1400, supplier: 'Minda Industries', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-014', partName: 'Gearbox Seal Kit', category: 'Transmission', currentStock: 15, minimumStock: 5, unitPrice: 2200, supplier: 'Parker India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-015', partName: 'Radiator Assembly', category: 'Engine', currentStock: 0, minimumStock: 3, unitPrice: 18000, supplier: 'Subros Ltd', stockStatus: 'OUT_OF_STOCK' },
    { partNumber: 'PRT-016', partName: 'PTO Shaft Assembly', category: 'Other', currentStock: 5, minimumStock: 3, unitPrice: 7500, supplier: 'Walterscheid India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-017', partName: 'Starter Motor', category: 'Electrical', currentStock: 9, minimumStock: 5, unitPrice: 9000, supplier: 'Valeo India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-018', partName: 'Front Axle Beam', category: 'Body', currentStock: 2, minimumStock: 3, unitPrice: 22000, supplier: 'Dana India', stockStatus: 'LOW_STOCK' },
    { partNumber: 'PRT-019', partName: 'Differential Assembly', category: 'Transmission', currentStock: 3, minimumStock: 2, unitPrice: 35000, supplier: 'Dana India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-020', partName: 'Cooling Fan Belt', category: 'Engine', currentStock: 30, minimumStock: 10, unitPrice: 480, supplier: 'Gates India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-021', partName: 'Engine Gasket Set', category: 'Engine', currentStock: 10, minimumStock: 5, unitPrice: 5500, supplier: 'Elringklinger India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-022', partName: 'Hydraulic Control Valve', category: 'Hydraulic', currentStock: 6, minimumStock: 4, unitPrice: 6800, supplier: 'Parker India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-023', partName: 'Brake Master Cylinder', category: 'Brake', currentStock: 8, minimumStock: 4, unitPrice: 4200, supplier: 'Endurance Technologies', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-024', partName: 'Throttle Cable', category: 'Engine', currentStock: 22, minimumStock: 8, unitPrice: 380, supplier: 'Pricol Ltd', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-025', partName: 'Wheel Hub Assembly', category: 'Body', currentStock: 4, minimumStock: 4, unitPrice: 11000, supplier: 'Dana India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-026', partName: 'Timing Chain Kit', category: 'Engine', currentStock: 7, minimumStock: 5, unitPrice: 3800, supplier: 'Morse India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-027', partName: 'Gear Shift Fork', category: 'Transmission', currentStock: 3, minimumStock: 3, unitPrice: 2800, supplier: 'Sintercast India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-028', partName: 'Water Pump Assembly', category: 'Engine', currentStock: 0, minimumStock: 4, unitPrice: 4500, supplier: 'Subros Ltd', stockStatus: 'OUT_OF_STOCK' },
    { partNumber: 'PRT-029', partName: 'Turbocharger', category: 'Engine', currentStock: 2, minimumStock: 2, unitPrice: 28000, supplier: 'Garrett India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-030', partName: 'Exhaust Pipe', category: 'Engine', currentStock: 11, minimumStock: 5, unitPrice: 2100, supplier: 'Tenneco India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-031', partName: 'Hydraulic Cylinder Seal', category: 'Hydraulic', currentStock: 40, minimumStock: 15, unitPrice: 750, supplier: 'Parker India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-032', partName: 'Clutch Bearing', category: 'Transmission', currentStock: 6, minimumStock: 5, unitPrice: 1600, supplier: 'SKF India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-033', partName: 'Fuel Injection Pump', category: 'Engine', currentStock: 1, minimumStock: 3, unitPrice: 42000, supplier: 'Bosch India', stockStatus: 'LOW_STOCK' },
    { partNumber: 'PRT-034', partName: 'Engine Coolant 5L', category: 'Engine', currentStock: 65, minimumStock: 20, unitPrice: 650, supplier: 'Castrol India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-035', partName: 'Transmission Oil 10L', category: 'Transmission', currentStock: 48, minimumStock: 15, unitPrice: 1800, supplier: 'Castrol India', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-036', partName: 'Wiring Harness Main', category: 'Electrical', currentStock: 3, minimumStock: 3, unitPrice: 7200, supplier: 'Minda Industries', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-037', partName: 'Steering Wheel', category: 'Body', currentStock: 5, minimumStock: 3, unitPrice: 3400, supplier: 'Minda Industries', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-038', partName: 'Fuel Tank Cap', category: 'Body', currentStock: 18, minimumStock: 8, unitPrice: 280, supplier: 'Local Vendor', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-039', partName: 'Instrument Cluster', category: 'Electrical', currentStock: 4, minimumStock: 3, unitPrice: 8900, supplier: 'Pricol Ltd', stockStatus: 'IN_STOCK' },
    { partNumber: 'PRT-040', partName: 'Rear Axle Shaft', category: 'Transmission', currentStock: 2, minimumStock: 3, unitPrice: 14500, supplier: 'Dana India', stockStatus: 'LOW_STOCK' },
  ]
  const spareParts = await Promise.all(sparePartsData.map(p => prisma.sparePart.create({ data: p })))
  console.log(`✅ Created ${spareParts.length} spare parts`)

  // ─── TRACTORS ───────────────────────────────────────────────────────────────
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'UNDER_SERVICE', 'INACTIVE']

  const tractorData = []
  let tractorNum = 1

  // Create tractors spread across models, dealers, customers
  const assignments = [
    [0,0,0],[1,1,1],[2,2,2],[3,3,3],[4,4,4],[5,5,5],[0,6,6],[1,7,7],[2,8,8],[3,9,9],
    [4,0,10],[5,1,11],[0,2,12],[1,3,13],[2,4,14],[3,5,15],[4,6,16],[5,7,17],[0,8,18],[1,9,19],
    [2,0,20],[3,1,21],[4,2,22],[5,3,23],[0,4,24],[1,5,25],[2,6,26],[3,7,27],[4,8,28],[5,9,29],
    [0,0,0],[1,1,1],[2,2,2],[3,3,3],[4,4,4],[5,5,5],[0,6,6],[1,7,7],[2,8,8],[3,9,9],
    [4,0,10],[5,1,11],[0,2,12],[1,3,13],[2,4,14],[3,5,15],[4,6,16],[5,7,17],[0,8,18],[1,9,19],
  ]

  for (const [mIdx, dIdx, cIdx] of assignments) {
    const num = String(tractorNum).padStart(3, '0')
    const pDate = new Date(2021 + Math.floor(tractorNum / 15), tractorNum % 12, 10 + (tractorNum % 20))
    tractorData.push({
      tractorId: `TR-${num}`,
      chassisNumber: `CHS${num}2024IN`,
      engineNumber: `ENG${num}TX45`,
      registrationNo: `${['PB', 'MH', 'GJ', 'TG', 'WB', 'RJ', 'KL', 'UP', 'TN', 'KA'][dIdx % 10]}${String(10 + tractorNum).padStart(2,'0')}TX${num}`,
      color: ['Red', 'Blue', 'Yellow', 'Orange', 'Green'][tractorNum % 5],
      status: statuses[tractorNum % statuses.length],
      purchaseDate: pDate,
      region: regions[dIdx % 5],
      modelId: models[mIdx].id,
      customerId: customers[cIdx].id,
      dealerId: dealers[dIdx].id,
    })
    tractorNum++
  }

  const tractors = await Promise.all(tractorData.map(t => prisma.tractor.create({ data: t })))
  console.log(`✅ Created ${tractors.length} tractors`)

  // ─── SALES ──────────────────────────────────────────────────────────────────
  const paymentModes = ['CASH', 'LOAN', 'EMI']
  const salespersons = ['Rakesh Mehra', 'Sanjay Kapoor', 'Anita Bose', 'Vipin Tomar', 'Lalitha Rao']
  const banks = ['SBI', 'PNB', 'HDFC Bank', 'Kisan Credit', null]

  const salesRecords = await Promise.all(tractors.map(async (tractor, i) => {
    const amount = 450000 + (i * 8000) + (Math.floor(i / 5) * 50000)
    const discount = Math.floor(Math.random() * 5) * 5000
    return prisma.sale.create({
      data: {
        saleId: `SL-${String(i + 1).padStart(3, '0')}`,
        invoiceNumber: `INV-2024-${String(i + 1).padStart(4, '0')}`,
        saleDate: tractor.purchaseDate,
        amount,
        discount,
        finalAmount: amount - discount,
        paymentMode: paymentModes[i % 3],
        loanBank: paymentModes[i % 3] !== 'CASH' ? banks[i % 4] : null,
        salesperson: salespersons[i % 5],
        tractorId: tractor.id,
        customerId: tractor.customerId,
        dealerId: tractor.dealerId,
      }
    })
  }))
  console.log(`✅ Created ${salesRecords.length} sales records`)

  // ─── WARRANTIES ─────────────────────────────────────────────────────────────
  const warranties = await Promise.all(tractors.map(async (tractor, i) => {
    const start = tractor.purchaseDate
    const end = new Date(start)
    end.setFullYear(end.getFullYear() + 2)
    const now = new Date()
    let status = 'ACTIVE'
    if (end < now) status = 'EXPIRED'
    else if (end < new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())) status = 'ACTIVE'

    return prisma.warranty.create({
      data: {
        warrantyId: `WRN-${String(i + 1).padStart(3, '0')}`,
        startDate: start,
        endDate: end,
        coverage: i % 3 === 0 ? 'FULL' : i % 3 === 1 ? 'PARTIAL' : 'ENGINE_ONLY',
        status,
        terms: '2-year/2000-hour warranty covering manufacturing defects',
        tractorId: tractor.id,
      }
    })
  }))
  console.log(`✅ Created ${warranties.length} warranty records`)

  // ─── COMPLAINTS ─────────────────────────────────────────────────────────────
  const categories = ['Engine', 'Hydraulic', 'Electrical', 'Transmission', 'Brake', 'Clutch', 'PTO', 'Starting', 'Other']
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  const complaintStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']

  const complaintDescriptions: Record<string, string[]> = {
    'Engine': ['Engine overheating in heavy load', 'Excessive engine noise during startup', 'Loss of engine power at high RPM', 'Black smoke from exhaust'],
    'Hydraulic': ['Hydraulic lift not raising properly', 'Hydraulic oil leakage from rear', 'Slow hydraulic response time', 'Hydraulic pump making noise'],
    'Electrical': ['Battery not charging', 'Starter motor not engaging', 'Warning lights not working', 'Alternator failure'],
    'Transmission': ['Gear slipping at 4th gear', 'Difficulty in shifting gears', 'Gearbox noise in reverse', 'Clutch not disengaging properly'],
    'Brake': ['Brakes not holding on slope', 'Brake pedal going to floor', 'Uneven braking', 'Brake disc wear'],
    'Clutch': ['Clutch slipping under load', 'Clutch chattering', 'Difficult clutch engagement', 'Clutch pedal heavy'],
    'PTO': ['PTO not engaging', 'PTO vibration', 'PTO speed inconsistent', 'PTO shaft damage'],
    'Starting': ['Tractor not starting in cold morning', 'Slow cranking speed', 'Starting difficulty after oil service', 'Fuel supply issue on starting'],
    'Other': ['Steering heavy', 'Excessive fuel consumption', 'Seat height adjustment broken', 'Dashboard display error'],
  }

  const complaintsCreated = []
  for (let i = 0; i < 80; i++) {
    const tractor = tractors[i % tractors.length]
    const cat = categories[i % categories.length]
    const descs = complaintDescriptions[cat]
    const desc = descs[i % descs.length]
    const cDate = new Date(2024, i % 12, (i % 28) + 1)
    const status = complaintStatuses[i % complaintStatuses.length]
    const tech = technicians[i % technicians.length]
    const isResolved = status === 'RESOLVED' || status === 'CLOSED'

    const c = await prisma.complaint.create({
      data: {
        complaintId: `CMP-${String(i + 1).padStart(3, '0')}`,
        category: cat,
        description: desc,
        priority: priorities[i % priorities.length],
        status,
        resolution: isResolved ? `${cat} issue resolved after inspection and part replacement. Tractor tested and confirmed working.` : null,
        createdDate: cDate,
        resolvedDate: isResolved ? new Date(cDate.getTime() + (3 + i % 7) * 24 * 60 * 60 * 1000) : null,
        tractorId: tractor.id,
        customerId: tractor.customerId,
        technicianId: tech.id,
      }
    })
    complaintsCreated.push(c)
  }
  console.log(`✅ Created ${complaintsCreated.length} complaints`)

  // ─── SERVICE RECORDS ────────────────────────────────────────────────────────
  const serviceTypes = ['SCHEDULED', 'BREAKDOWN', 'WARRANTY', 'PREVENTIVE']
  const serviceStatuses = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_PART', 'COMPLETED', 'CLOSED']
  const workPerformed = [
    'Engine oil and filter changed. Air filter cleaned.',
    'Hydraulic filter replaced. Oil level topped up.',
    'Brake adjustment done. Brake shoes replaced.',
    'Clutch plate replaced. Clutch adjustment done.',
    'Electrical system checked. Battery terminal cleaned.',
    'Transmission oil changed. Gear shift adjusted.',
    'Full service: engine oil, filters, brake check, greasing.',
    'PTO system inspected and repaired.',
    'Starter motor replaced. Battery tested.',
    'Hydraulic pump overhauled.',
  ]

  const serviceRecordsCreated = []
  for (let i = 0; i < 100; i++) {
    const tractor = tractors[i % tractors.length]
    const sDate = new Date(2024, i % 12, (i % 28) + 1)
    const status = serviceStatuses[i % serviceStatuses.length]
    const isCompleted = status === 'COMPLETED' || status === 'CLOSED'
    const tech = technicians[i % technicians.length]

    const sr = await prisma.serviceRecord.create({
      data: {
        serviceId: `SRV-${String(i + 1).padStart(3, '0')}`,
        serviceDate: sDate,
        serviceType: serviceTypes[i % serviceTypes.length],
        problemReported: complaintDescriptions[categories[i % categories.length]][i % 4],
        workPerformed: isCompleted ? workPerformed[i % workPerformed.length] : null,
        cost: isCompleted ? (800 + (i * 150) + (i % 5 * 1000)) : 0,
        status,
        priority: priorities[i % priorities.length],
        completedDate: isCompleted ? new Date(sDate.getTime() + (2 + i % 5) * 24 * 60 * 60 * 1000) : null,
        tractorId: tractor.id,
        technicianId: tech.id,
      }
    })
    serviceRecordsCreated.push(sr)
  }
  console.log(`✅ Created ${serviceRecordsCreated.length} service records`)

  // ─── SERVICE PARTS ──────────────────────────────────────────────────────────
  const partUsageMap = [
    [0, 1], [1, 3], [0, 8], [4, 5], [6, 9], [10, 11], [0, 3], [1, 2], [7, 16], [8, 9]
  ]
  let servicePartsCount = 0
  for (let i = 0; i < serviceRecordsCreated.length; i++) {
    const sr = serviceRecordsCreated[i]
    if (sr.status === 'COMPLETED' || sr.status === 'CLOSED') {
      const partIndices = partUsageMap[i % partUsageMap.length]
      for (const pIdx of partIndices) {
        const part = spareParts[pIdx]
        const qty = 1 + (i % 2)
        await prisma.servicePart.create({
          data: {
            quantity: qty,
            unitCost: part.unitPrice,
            totalCost: part.unitPrice * qty,
            serviceRecordId: sr.id,
            sparePartId: part.id,
          }
        })
        servicePartsCount++
      }
    }
  }
  console.log(`✅ Created ${servicePartsCount} service part records`)

  // ─── WARRANTY CLAIMS ────────────────────────────────────────────────────────
  const claimStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SETTLED']
  let claimCount = 0
  for (let i = 0; i < Math.min(30, warranties.length); i++) {
    const w = warranties[i]
    if (i % 3 === 0) {
      const cDate = new Date(w.startDate.getTime() + (30 + i * 20) * 24 * 60 * 60 * 1000)
      const status = claimStatuses[i % claimStatuses.length]
      await prisma.warrantyClaim.create({
        data: {
          claimId: `WRC-${String(i + 1).padStart(3, '0')}`,
          claimDate: cDate,
          description: `Warranty claim for ${categories[i % categories.length]} system failure`,
          amount: 5000 + (i * 1200),
          status,
          approvedBy: status === 'APPROVED' || status === 'SETTLED' ? 'Regional Manager' : null,
          settledDate: status === 'SETTLED' ? new Date(cDate.getTime() + 15 * 24 * 60 * 60 * 1000) : null,
          warrantyId: w.id,
        }
      })
      claimCount++
    }
  }
  console.log(`✅ Created ${claimCount} warranty claims`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('─────────────────────────────')
  console.log('Demo credentials:')
  console.log('  Admin:   admin@tractor360.com / password123')
  console.log('  Manager: manager@tractor360.com / password123')
  console.log('  Viewer:  viewer@tractor360.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
