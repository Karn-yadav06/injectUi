import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await getAuthenticatedUser(request);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const customer = await User.findById(id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    customer.premium = false;
    await customer.save();

    return NextResponse.json({
      success: true,
      message: `Revoked premium access for ${customer.email}`,
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        premium: customer.premium,
        isAdmin: customer.isAdmin,
      },
    });
  } catch (error) {
    console.error("Revoke premium error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
