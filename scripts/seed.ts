import { connectDB, disconnectDB } from "../lib/db";
import { User } from "../models/User";
import { Component } from "../models/Component";
import { hashPassword } from "../lib/auth";
import mongoose from "mongoose";
import { initialComponents } from "./seedData";

export async function seedDatabase() {
  console.log("🌱 Seeding InjectUI Database...");
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  // 1. Seed Users
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const usersToSeed = [
    {
      name: "Free Developer",
      email: "free@example.com",
      password: "Free123!",
      premium: false,
      isAdmin: false,
    },
    {
      name: "Premium Member",
      email: "premium@example.com",
      password: "Premium123!",
      premium: true,
      isAdmin: false,
    },
    {
      name: "System Admin",
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      premium: true,
      isAdmin: true,
    },
  ];

  for (const u of usersToSeed) {
    const existing = await User.findOne({ email: u.email });
    const hashedPassword = await hashPassword(u.password);
    if (!existing) {
      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        premium: u.premium,
        isAdmin: u.isAdmin,
      });
      console.log(` Created user: ${u.email} (premium: ${u.premium}, admin: ${u.isAdmin})`);
    } else {
      // Keep admin credentials synced with env if updated
      existing.name = u.name;
      existing.password = hashedPassword;
      existing.premium = u.premium;
      existing.isAdmin = u.isAdmin;
      await existing.save();
      console.log(` Synced user: ${u.email}`);
    }
  }

  // 2. Seed Components
  for (const c of initialComponents) {
    const existing = await Component.findOne({ slug: c.slug });
    if (!existing) {
      await Component.create(c);
      console.log(` Created component: ${c.name} (${c.access})`);
    } else {
      Object.assign(existing, c);
      await existing.save();
      console.log(` Synced component: ${c.name}`);
    }
  }

  console.log("✅ Seeding completed successfully!");
}

// Direct CLI execution check
const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith("seed.ts") ||
  process.argv[1].endsWith("seed.js") ||
  process.argv[1].includes("seed")
);

if (isDirectExecution) {
  seedDatabase()
    .then(async () => {
      console.log("Database seeded successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}


