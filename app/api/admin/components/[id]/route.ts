import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { getAuthenticatedUser } from "@/lib/auth";
import { validateComponentInput } from "@/lib/validation";

// PUT /api/admin/components/[id] - Update Component
export async function PUT(
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
    const body = await request.json().catch(() => ({}));
    const validation = validateComponentInput(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if another component has this slug
    const existingSlug = await Component.findOne({
      slug: body.slug.trim().toLowerCase(),
      _id: { $ne: id },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, message: "Slug is already used by another component." },
        { status: 400 }
      );
    }

    const updated = await Component.findByIdAndUpdate(
      id,
      {
        name: body.name.trim(),
        slug: body.slug.trim().toLowerCase(),
        description: body.description.trim(),
        category: body.category,
        version: body.version,
        access: body.access,
        props: Array.isArray(body.props) ? body.props : [],
        usage: body.usage,
        sourceCode: body.sourceCode,
        previewData: body.previewData || {},
        dependencies: Array.isArray(body.dependencies)
          ? body.dependencies
          : typeof body.dependencies === "string"
          ? body.dependencies.split(",").map((d: string) => d.trim()).filter(Boolean)
          : [],
        installCommand: body.installCommand,
        agentPrompt: body.agentPrompt,
        published: body.published === true,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Component updated successfully",
      component: updated,
    });
  } catch (error) {
    console.error("Admin update component error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/components/[id] - Delete draft / component
export async function DELETE(
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

    await Component.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Component "${component.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Admin delete component error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
