// Script to create a test user directly in the database
import { prisma } from "./data/db";
import bcrypt from "bcrypt";

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("test1234", 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username: "testuser",
        password: hashedPassword,
        role: "leader",
        status: "active",
      },
    });

    console.log("✅ Test user created successfully!");
    console.log("Username: testuser");
    console.log("Password: test1234");
    console.log("Role: leader");
    console.log("\nUser ID:", user.id);

  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
