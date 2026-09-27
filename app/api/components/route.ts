import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Component } from "@/models/Component";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const access = searchParams.get("access")?.trim();
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const user = await getAuthenticatedUser(request);

    // Build filter query
    const query: Record<string, unknown> = {};

    // Only admins can see drafts, everyone else sees published components only
    if (!includeDrafts || !user || !user.isAdmin) {
      query.published = true;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (access && (access === "free" || access === "premium")) {
      query.access = access;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // Exclude full source code and AI prompts from the catalogue summary list
    const components = await Component.find(query)
      .select("name slug description category version access dependencies published createdAt updatedAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: components.length,
      components,
    });
  } catch (error) {
    console.error("Fetch components error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch components" },
      { status: 500 }
    );
  }
}
