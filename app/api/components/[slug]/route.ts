import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const component = await Component.findOne({ slug: slug.toLowerCase().trim() });

    if (!component) {
      return NextResponse.json(
        { success: false, message: "Component not found" },
        { status: 404 }
      );
    }

    const user = await getAuthenticatedUser(request);

    // Unpublished components check: only admins can view drafts
    if (!component.published) {
      if (!user || !user.isAdmin) {
        return NextResponse.json(
          { success: false, message: "Component not found or unpublished" },
          { status: 404 }
        );
      }
    }

    // Check query params for strict code request
    const { searchParams } = new URL(request.url);
    const requiresFullAccess = searchParams.get("raw") === "true";

    // Access authorization check
    const hasPremiumAccess = !!(user && (user.premium || user.isAdmin));

    if (component.access === "premium" && !hasPremiumAccess) {
      if (requiresFullAccess) {
        return NextResponse.json(
          {
            success: false,
            message: "Premium access required",
            code: "PREMIUM_REQUIRED",
          },
          { status: 403 }
        );
      }

      // Return sanitized public metadata with locked status.
      // OMIT: sourceCode, previewData, dependencies, installCommand, agentPrompt
      return NextResponse.json({
        success: true,
        isLocked: true,
        component: {
          _id: component._id,
          name: component.name,
          slug: component.slug,
          description: component.description,
          category: component.category,
          version: component.version,
          access: component.access,
          published: component.published,
          createdAt: component.createdAt,
          updatedAt: component.updatedAt,
          props: component.props || [],
          // Redacted sensitive/premium fields
          sourceCode: null,
          previewData: null,
          dependencies: [],
          installCommand: null,
          agentPrompt: null,
          usage: null,
        },
      });
    }

    // Full access granted (free component or authorized premium/admin user)
    return NextResponse.json({
      success: true,
      isLocked: false,
      component: {
        _id: component._id,
        name: component.name,
        slug: component.slug,
        description: component.description,
        category: component.category,
        version: component.version,
        access: component.access,
        props: component.props,
        usage: component.usage,
        sourceCode: component.sourceCode,
        previewData: component.previewData,
        dependencies: component.dependencies,
        installCommand: component.installCommand,
        agentPrompt: component.agentPrompt,
        published: component.published,
        createdAt: component.createdAt,
        updatedAt: component.updatedAt,
      },
    });
  } catch (error) {
    console.error("Fetch component detail error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch component" },
      { status: 500 }
    );
  }
}
