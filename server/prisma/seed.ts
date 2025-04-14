import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "123456";
  const name = "Super Admin";

  const existingUser = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });
  if (existingUser) {
    console.log("Super Admin user already exists: ", existingUser);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    console.error("Error hashing password");
    return;
  }

  const superAdminUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin User created successfully: ", superAdminUser);
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
