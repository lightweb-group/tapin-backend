import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing merchant if it exists (to avoid duplicates during re-seeding)
  await prisma.merchant.deleteMany({
    where: {
      name: "Test Merchant",
    },
  });

  // Create a new test merchant
  const merchant = await prisma.merchant.create({
    data: {
      name: "Test Merchant",
      address: "123 Test Street, Test City, TS 12345",
      phoneNumber: "1234567890",
      pointsPerVisit: 10,
      pointsPerDollar: 1,
      welcomeBonus: 50,
      isActive: true,
    },
  });

  console.log(`Created merchant with ID: ${merchant.id}`);
  console.log(merchant);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
