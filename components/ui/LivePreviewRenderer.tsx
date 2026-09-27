"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, LogIn, ArrowRight } from "lucide-react";
import { Button } from "./button-preview";
import { Input } from "./input-preview";
import { Badge } from "./badge-preview";
import { Alert } from "./alert-preview";
import { Card } from "./card-preview";
import { Modal } from "./modal-preview";
import { DataTable } from "./data-table-preview";
import { DashboardSidebar } from "./sidebar-preview";
import { Tabs } from "./tabs-preview";
import { DatePicker } from "./datepicker-preview";

export interface LivePreviewRendererProps {
  slug: string;
  isLocked: boolean;
  componentName: string;
}

export function LivePreviewRenderer({
  slug,
  isLocked,
  componentName,
}: LivePreviewRendererProps) {
  // If locked, render the required lock card
  if (isLocked) {
    return (
      <div className="w-full py-16 px-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            Premium Component
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          This component requires premium access.
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Please sign in with a premium account or contact the administrator to unlock the live preview, full source code, and integration prompts.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Premium Account
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-850 border border-slate-700/80 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-all"
          >
            View Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Live Interactive Previews
  return (
    <div className="w-full min-h-[280px] p-6 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center overflow-hidden">
      {slug === "button" && <ButtonPreviewDemo />}
      {slug === "input" && <InputPreviewDemo />}
      {slug === "badge" && <BadgePreviewDemo />}
      {slug === "alert" && <AlertPreviewDemo />}
      {slug === "card" && <CardPreviewDemo />}
      {slug === "modal" && <ModalPreviewDemo />}
      {slug === "data-table" && <DataTablePreviewDemo />}
      {slug === "dashboard-sidebar" && <DashboardSidebarPreviewDemo />}
      {slug === "tabs" && <TabsPreviewDemo />}
      {slug === "date-picker" && <DatePickerPreviewDemo />}
      {!["button", "input", "badge", "alert", "card", "modal", "data-table", "dashboard-sidebar", "tabs", "date-picker"].includes(slug) && (
        <div className="text-center p-8">
          <p className="text-slate-400 text-sm">Interactive preview for {componentName}</p>
        </div>
      )}
    </div>
  );
}

// Sub-demos for the 10 components
function ButtonPreviewDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button variant="primary" onClick={() => alert("Primary button clicked!")}>
        Primary Button
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
      <Button
        variant="primary"
        isLoading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
      >
        {loading ? "Processing..." : "Click to Load"}
      </Button>
    </div>
  );
}

function InputPreviewDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input label="Email address" placeholder="alex@company.com" hint="We will never share your email." />
      <Input label="Workspace Slug" defaultValue="my-app" error="Workspace name already exists" />
    </div>
  );
}

function BadgePreviewDemo() {
  return (
    <div className="flex flex-wrap gap-2.5 items-center justify-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">In Progress</Badge>
      <Badge variant="danger">High Priority</Badge>
      <Badge variant="purple" pill>Enterprise Pro</Badge>
    </div>
  );
}

function AlertPreviewDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Alert type="success" title="Changes Saved">
        Your production pipeline configuration was successfully updated.
      </Alert>
      <Alert type="warning" title="SSL Certificate Expiry">
        The domain certificate will renew in 5 days.
      </Alert>
    </div>
  );
}

function CardPreviewDemo() {
  return (
    <div className="w-full max-w-md">
      <Card
        title="Monthly Quota"
        description="Usage statistics across active API gateways"
        footer={<Button size="sm">Manage Plan</Button>}
      >
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Requests Processed</span>
            <span className="font-semibold text-white">824,000 / 1,000,000</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[82%]" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function ModalPreviewDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Live Modal
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Action">
        <div className="space-y-3">
          <p className="text-slate-300">Are you sure you want to promote this build to production?</p>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => { alert("Promoted!"); setOpen(false); }}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DataTablePreviewDemo() {
  const columns = [
    { key: "lead", label: "Lead Name" },
    { key: "value", label: "Deal Value" },
    { key: "stage", label: "Stage" },
  ];
  const data = [
    { lead: "Nexus Systems", value: "$45,000", stage: "Contract Sent" },
    { lead: "Vanguard Tech", value: "$82,000", stage: "Discovery" },
    { lead: "Apex Global", value: "$31,500", stage: "Won" },
  ];
  return (
    <div className="w-full max-w-lg">
      <DataTable columns={columns} data={data} searchable={true} />
    </div>
  );
}

function DashboardSidebarPreviewDemo() {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <DashboardSidebar />
    </div>
  );
}

function TabsPreviewDemo() {
  const tabs = [
    { key: "tab1", label: "General", content: <div className="p-4 bg-slate-950/60 rounded-lg text-slate-300 text-sm">General settings and metadata configuration.</div> },
    { key: "tab2", label: "Team Access", content: <div className="p-4 bg-slate-950/60 rounded-lg text-slate-300 text-sm">Invite members and assign role-based permissions.</div> },
    { key: "tab3", label: "Billing", content: <div className="p-4 bg-slate-950/60 rounded-lg text-slate-300 text-sm">View invoices, payment methods, and current tier.</div> },
  ];
  return (
    <div className="w-full max-w-md">
      <Tabs tabs={tabs} />
    </div>
  );
}

function DatePickerPreviewDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="flex flex-col items-center">
      <DatePicker label="Due Date" value={selectedDate} onChange={setSelectedDate} />
    </div>
  );
}
