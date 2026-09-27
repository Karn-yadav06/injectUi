import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { getAuthenticatedUser } from "@/lib/auth";
import { validateComponentInput } from "@/lib/validation";

// POST /api/admin/components - Create Component
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

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

    const existingSlug = await Component.findOne({ slug: body.slug.trim().toLowerCase() });
    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists. Choose a unique slug.",
        },
        { status: 400 }
      );
    }

    const newComponent = await Component.create({
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      description: body.description.trim(),
      category: body.category,
      version: body.version || "1.0.0",
      access: body.access || "free",
      props: Array.isArray(body.props) ? body.props : [],
      usage: body.usage,
      sourceCode: body.sourceCode,
      previewData: body.previewData || {},
      dependencies: Array.isArray(body.dependencies)
        ? body.dependencies
        : typeof body.dependencies === "string"
        ? body.dependencies.split(",").map((d: string) => d.trim()).filter(Boolean)
        : [],
      installCommand: body.installCommand || `npx inject-ui add ${body.slug.trim().toLowerCase()}`,
      agentPrompt: body.agentPrompt,
      published: body.published === true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Component created successfully",
        component: newComponent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create component error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/components - Admin list all components (including drafts)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    await connectDB();
    const components = await Component.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: components.length,
      components,
    });
  } catch (error) {
    console.error("Admin get components error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
