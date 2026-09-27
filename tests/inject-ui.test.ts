import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { connectDB, disconnectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Component } from "@/models/Component";
import { seedDatabase } from "@/scripts/seed";

// Import API Route Handlers
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { GET as getComponentsHandler } from "@/app/api/components/route";
import { GET as getComponentDetailHandler } from "@/app/api/components/[slug]/route";
import { GET as getAdminStatsHandler } from "@/app/api/admin/stats/route";
import {
  POST as createComponentHandler,
  GET as adminGetComponentsHandler,
} from "@/app/api/admin/components/route";
import { DELETE as deleteComponentHandler } from "@/app/api/admin/components/[id]/route";
import { POST as publishComponentHandler } from "@/app/api/admin/components/[id]/publish/route";
import { POST as unpublishComponentHandler } from "@/app/api/admin/components/[id]/unpublish/route";
import { GET as getCustomersHandler } from "@/app/api/admin/customers/route";
import { POST as grantPremiumHandler } from "@/app/api/admin/customers/[id]/grant-premium/route";
import { POST as revokePremiumHandler } from "@/app/api/admin/customers/[id]/revoke-premium/route";

describe("InjectUI Platform Test Suite", () => {
  let freeUserToken = "";
  let premiumUserToken = "";
  let adminToken = "";
  let freeUserId = "";

  beforeAll(async () => {
    await connectDB();
    await seedDatabase();

    // 1. Login Free User
    const freeLoginReq = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "free@example.com", password: "Free123!" }),
    });
    const freeRes = await loginHandler(freeLoginReq);
    const freeData = await freeRes.json();
    freeUserToken = freeData.token;
    freeUserId = freeData.user.id;

    // 2. Login Premium User
    const premLoginReq = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "premium@example.com", password: "Premium123!" }),
    });
    const premRes = await loginHandler(premLoginReq);
    const premData = await premRes.json();
    premiumUserToken = premData.token;

    // 3. Login Admin User
    const adminLoginReq = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@example.com", password: "Admin123!" }),
    });
    const adminRes = await loginHandler(adminLoginReq);
    const adminData = await adminRes.json();
    adminToken = adminData.token;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // Test 1: Public component list
  it("1. Public component list: returns published components", async () => {
    const req = new NextRequest("http://localhost:3000/api/components");
    const res = await getComponentsHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.components)).toBe(true);
    expect(data.components.length).toBeGreaterThanOrEqual(10);
    // Every component in public list must be published
    data.components.forEach((c: any) => {
      expect(c.published).toBe(true);
    });
  });

  // Test 2: Component detail
  it("2. Component detail: returns full details for valid slug", async () => {
    const req = new NextRequest("http://localhost:3000/api/components/button");
    const res = await getComponentDetailHandler(req, {
      params: Promise.resolve({ slug: "button" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.component.name).toBe("Button");
    expect(data.component.slug).toBe("button");
    expect(data.component.category).toBe("Inputs");
    expect(data.component.version).toBe("1.0.0");
  });

  // Test 3: Customer login
  it("3. Customer login: valid credentials return token and user profile", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "free@example.com", password: "Free123!" }),
    });
    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe("free@example.com");
    expect(data.user.premium).toBe(false);
  });

  // Test 4: Invalid login
  it("4. Invalid login: invalid password returns 401 unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "free@example.com", password: "WrongPassword999!" }),
    });
    const res = await loginHandler(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Invalid email or password");
  });

  // Test 5: Admin protection
  it("5. Admin protection: free user cannot access admin stats", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/stats", {
      headers: { Authorization: `Bearer ${freeUserToken}` },
    });
    const res = await getAdminStatsHandler(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.message).toContain("Unauthorized");
  });

  // Test 6: Unauthorized admin API
  it("6. Unauthorized admin API: unauthenticated request is blocked", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/stats");
    const res = await getAdminStatsHandler(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.success).toBe(false);
  });

  // Test 7: Free component access
  it("7. Free component access: unauthenticated guest gets full access to free component", async () => {
    const req = new NextRequest("http://localhost:3000/api/components/button");
    const res = await getComponentDetailHandler(req, {
      params: Promise.resolve({ slug: "button" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isLocked).toBe(false);
    expect(data.component.access).toBe("free");
    expect(data.component.sourceCode).toBeDefined();
    expect(data.component.sourceCode.length).toBeGreaterThan(20);
    expect(data.component.agentPrompt).toBeDefined();
  });

  // Test 8: Premium component blocked for free user
  it("8. Premium component blocked for free user: sourceCode and prompt are redacted", async () => {
    const req = new NextRequest("http://localhost:3000/api/components/modal", {
      headers: { Authorization: `Bearer ${freeUserToken}` },
    });
    const res = await getComponentDetailHandler(req, {
      params: Promise.resolve({ slug: "modal" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isLocked).toBe(true);
    expect(data.component.access).toBe("premium");
    // Sensitive fields must NOT be returned
    expect(data.component.sourceCode).toBeNull();
    expect(data.component.agentPrompt).toBeNull();
    expect(data.component.installCommand).toBeNull();
  });

  // Test 9: Premium component accessible for premium user
  it("9. Premium component accessible for premium user: returns unlocked payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/components/modal", {
      headers: { Authorization: `Bearer ${premiumUserToken}` },
    });
    const res = await getComponentDetailHandler(req, {
      params: Promise.resolve({ slug: "modal" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isLocked).toBe(false);
    expect(data.component.access).toBe("premium");
    expect(data.component.sourceCode).toBeDefined();
    expect(data.component.sourceCode).toContain("Modal");
    expect(data.component.agentPrompt).toBeDefined();
  });

  // Test 10: Revoked premium access
  it("10. Revoked premium access: immediate revocation blocks subsequent requests", async () => {
    // 1. Admin grants free user premium access
    const grantReq = new NextRequest(
      `http://localhost:3000/api/admin/customers/${freeUserId}/grant-premium`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const grantRes = await grantPremiumHandler(grantReq, {
      params: Promise.resolve({ id: freeUserId }),
    });
    expect(grantRes.status).toBe(200);

    // 2. Free user now accesses premium component successfully
    const accessReq1 = new NextRequest("http://localhost:3000/api/components/modal", {
      headers: { Authorization: `Bearer ${freeUserToken}` },
    });
    const accessRes1 = await getComponentDetailHandler(accessReq1, {
      params: Promise.resolve({ slug: "modal" }),
    });
    const data1 = await accessRes1.json();
    expect(data1.isLocked).toBe(false);
    expect(data1.component.sourceCode).toBeDefined();

    // 3. Admin revokes premium access
    const revokeReq = new NextRequest(
      `http://localhost:3000/api/admin/customers/${freeUserId}/revoke-premium`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const revokeRes = await revokePremiumHandler(revokeReq, {
      params: Promise.resolve({ id: freeUserId }),
    });
    expect(revokeRes.status).toBe(200);

    // 4. User's subsequent request is IMMEDIATELY blocked!
    const accessReq2 = new NextRequest("http://localhost:3000/api/components/modal", {
      headers: { Authorization: `Bearer ${freeUserToken}` },
    });
    const accessRes2 = await getComponentDetailHandler(accessReq2, {
      params: Promise.resolve({ slug: "modal" }),
    });
    const data2 = await accessRes2.json();
    expect(data2.isLocked).toBe(true);
    expect(data2.component.sourceCode).toBeNull();
  });

  // Test 11: Publish component
  it("11. Publish component: draft is created and then published dynamically", async () => {
    const testSlug = "dynamic-test-card";

    // Clean up if exists
    await Component.deleteOne({ slug: testSlug });

    // 1. Create draft
    const createReq = new NextRequest("http://localhost:3000/api/admin/components", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: "Dynamic Test Card",
        slug: testSlug,
        description: "Dynamic test card for publishing workflow",
        category: "Layout",
        version: "1.0.0",
        access: "free",
        usage: "export default function Test() { return <div>Test</div>; }",
        sourceCode: "export function DynamicTestCard() { return <div>Live</div>; }",
        installCommand: "npx inject-ui add dynamic-test-card",
        agentPrompt: "Add dynamic test card component",
        published: false, // Draft
      }),
    });
    const createRes = await createComponentHandler(createReq);
    const createData = await createRes.json();
    expect(createRes.status).toBe(201);
    const componentId = createData.component._id;

    // 2. Draft should NOT appear in public catalogue
    const publicReq1 = new NextRequest("http://localhost:3000/api/components");
    const publicRes1 = await getComponentsHandler(publicReq1);
    const publicData1 = await publicRes1.json();
    const foundInPublic1 = publicData1.components.some((c: any) => c.slug === testSlug);
    expect(foundInPublic1).toBe(false);

    // 3. Admin publishes component
    const pubReq = new NextRequest(
      `http://localhost:3000/api/admin/components/${componentId}/publish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const pubRes = await publishComponentHandler(pubReq, {
      params: Promise.resolve({ id: componentId }),
    });
    expect(pubRes.status).toBe(200);

    // 4. Component automatically appears in public catalogue
    const publicReq2 = new NextRequest("http://localhost:3000/api/components");
    const publicRes2 = await getComponentsHandler(publicReq2);
    const publicData2 = await publicRes2.json();
    const foundInPublic2 = publicData2.components.some((c: any) => c.slug === testSlug);
    expect(foundInPublic2).toBe(true);
  });

  // Test 12: Unpublish component
  it("12. Unpublish component: unpublishing hides component from public catalogue", async () => {
    const comp = await Component.findOne({ slug: "dynamic-test-card" });
    expect(comp).not.toBeNull();
    const componentId = comp!._id.toString();

    // 1. Admin unpublishes component
    const unpubReq = new NextRequest(
      `http://localhost:3000/api/admin/components/${componentId}/unpublish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const unpubRes = await unpublishComponentHandler(unpubReq, {
      params: Promise.resolve({ id: componentId }),
    });
    expect(unpubRes.status).toBe(200);

    // 2. Component is now gone from public catalogue
    const publicReq = new NextRequest("http://localhost:3000/api/components");
    const publicRes = await getComponentsHandler(publicReq);
    const publicData = await publicRes.json();
    const foundInPublic = publicData.components.some((c: any) => c.slug === "dynamic-test-card");
    expect(foundInPublic).toBe(false);

    // 3. Direct public access returns 404
    const detailReq = new NextRequest("http://localhost:3000/api/components/dynamic-test-card");
    const detailRes = await getComponentDetailHandler(detailReq, {
      params: Promise.resolve({ slug: "dynamic-test-card" }),
    });
    expect(detailRes.status).toBe(404);

    // Clean up
    await Component.findByIdAndDelete(componentId);
  });

  // Test 13: Customer cannot grant themselves premium
  it("13. Customer cannot grant themselves premium: regular user call to grant-premium is rejected", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/admin/customers/${freeUserId}/grant-premium`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${freeUserToken}` },
      }
    );
    const res = await grantPremiumHandler(req, {
      params: Promise.resolve({ id: freeUserId }),
    });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.message).toContain("Unauthorized");

    // Verify user in DB still has premium = false
    const checkUser = await User.findById(freeUserId);
    expect(checkUser?.premium).toBe(false);
  });
});
