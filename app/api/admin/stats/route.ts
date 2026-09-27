import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { User } from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAuthenticatedUser(request);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalComponents,
      published,
      drafts,
      premiumComponents,
      customers,
      premiumCustomers,
    ] = await Promise.all([
      Component.countDocuments(),
      Component.countDocuments({ published: true }),
      Component.countDocuments({ published: false }),
      Component.countDocuments({ access: "premium" }),
      User.countDocuments({ isAdmin: false }),
      User.countDocuments({ isAdmin: false, premium: true }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalComponents,
        published,
        drafts,
        premiumComponents,
        customers,
        premiumCustomers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
