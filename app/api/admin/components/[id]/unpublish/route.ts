import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const component = await Component.findById(id);
    if (!component) {
      return NextResponse.json(
        { success: false, message: "Component not found" },
        { status: 404 }
      );
    }

    component.published = false;
    await component.save();

    return NextResponse.json({
      success: true,
      message: `Component "${component.name}" unpublished successfully`,
      component,
    });
  } catch (error) {
    console.error("Unpublish component error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
