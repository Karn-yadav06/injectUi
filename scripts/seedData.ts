export interface SeedComponent {
  name: string;
  slug: string;
  description: string;
  category: "Inputs" | "Feedback" | "Layout" | "Data" | "Navigation" | "General";
  version: string;
  access: "free" | "premium";
  props: Array<{
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
    required?: boolean;
  }>;
  usage: string;
  sourceCode: string;
  previewData?: Record<string, unknown>;
  dependencies: string[];
  installCommand: string;
  agentPrompt: string;
  published: boolean;
}

export const initialComponents: SeedComponent[] = [
  // --- FREE COMPONENTS ---
  {
    name: "Button",
    slug: "button",
    description: "Interactive button component with variants, sizes, loading states, and icon support.",
    category: "Inputs",
    version: "1.0.0",
    access: "free",
    published: true,
    props: [
      { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'", defaultValue: "'primary'", description: "Visual style variant" },
      { name: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "Button dimensions" },
      { name: "isLoading", type: "boolean", defaultValue: "false", description: "Shows loading spinner state" },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables user interaction" },
      { name: "children", type: "React.ReactNode", defaultValue: "-", description: "Button label or nested elements", required: true }
    ],
    usage: `import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button variant="primary">Get Started</Button>
      <Button variant="secondary">Documentation</Button>
      <Button variant="outline" size="sm">Learn More</Button>
    </div>
  );
}`,
    sourceCode: `'use client';

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
      secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500",
      outline: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
      danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
      ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
`,
    previewData: { label: "Click Me", variant: "primary", size: "md" },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add button",
    agentPrompt: `Add the InjectUI Button component to this React TypeScript project.

Preserve the existing project theme.
Install the required dependencies: none (standard Tailwind CSS).
Create the component at @/components/ui/button.tsx.
Ensure full TypeScript types and forwardRef support.
Verify the component renders correctly with variant and size props.`
  },
  {
    name: "Input",
    slug: "input",
    description: "Accessible text input field with error messaging, label, and clear states.",
    category: "Inputs",
    version: "1.0.0",
    access: "free",
    published: true,
    props: [
      { name: "label", type: "string", defaultValue: "-", description: "Input label text" },
      { name: "error", type: "string", defaultValue: "-", description: "Error message displayed below input" },
      { name: "hint", type: "string", defaultValue: "-", description: "Helper text displayed below input" },
      { name: "placeholder", type: "string", defaultValue: "''", description: "Placeholder string" }
    ],
    usage: `import { Input } from "@/components/ui/input";

export default function Example() {
  return (
    <div className="space-y-4 max-w-sm">
      <Input label="Email Address" type="email" placeholder="you@company.com" />
      <Input label="Password" type="password" error="Password must be at least 8 characters" />
    </div>
  );
}`,
    sourceCode: `'use client';

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={\`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors \${
            error ? "border-rose-500 focus:ring-rose-500" : "border-slate-300 dark:border-slate-700 focus:border-indigo-500"
          } \${className}\`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
`,
    previewData: { label: "Work Email", placeholder: "developer@example.com" },
    dependencies: [],
    installCommand: "npx inject-ui add input",
    agentPrompt: `Add the InjectUI Input component to this React TypeScript project.

Preserve the existing project theme.
Support label, hint, and error states with accessible id associations.
Create the component at @/components/ui/input.tsx.`
  },
  {
    name: "Badge",
    slug: "badge",
    description: "Small status indicator and labeling badge with customizable colors and pill shapes.",
    category: "Feedback",
    version: "1.0.0",
    access: "free",
    published: true,
    props: [
      { name: "variant", type: "'default' | 'success' | 'warning' | 'danger' | 'purple'", defaultValue: "'default'", description: "Color theme variant" },
      { name: "pill", type: "boolean", defaultValue: "false", description: "Fully rounded pill shape" },
      { name: "children", type: "React.ReactNode", defaultValue: "-", description: "Badge content", required: true }
    ],
    usage: `import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <div className="flex gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">In Review</Badge>
      <Badge variant="purple" pill>Pro Feature</Badge>
    </div>
  );
}`,
    sourceCode: `'use client';

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "purple";
  pill?: boolean;
}

export function Badge({ className = "", variant = "default", pill = false, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    purple: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
  };

  return (
    <span
      className={\`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border \${pill ? "rounded-full" : "rounded-md"} \${variants[variant]} \${className}\`}
      {...props}
    >
      {children}
    </span>
  );
}
`,
    previewData: { label: "Verified Member", variant: "purple" },
    dependencies: [],
    installCommand: "npx inject-ui add badge",
    agentPrompt: `Add the InjectUI Badge component to this React TypeScript project.

Preserve theme consistency with Tailwind CSS borders and subtle background hues.
Create the component at @/components/ui/badge.tsx.`
  },
  {
    name: "Alert",
    slug: "alert",
    description: "Notification banner displaying info, success, warning, or error messages.",
    category: "Feedback",
    version: "1.0.0",
    access: "free",
    published: true,
    props: [
      { name: "type", type: "'info' | 'success' | 'warning' | 'error'", defaultValue: "'info'", description: "Severity type" },
      { name: "title", type: "string", defaultValue: "-", description: "Bold header text" },
      { name: "children", type: "React.ReactNode", defaultValue: "-", description: "Detailed alert text", required: true }
    ],
    usage: `import { Alert } from "@/components/ui/alert";

export default function Example() {
  return (
    <Alert type="success" title="Deployment Complete">
      Your application has been deployed to the edge production cluster.
    </Alert>
  );
}`,
    sourceCode: `'use client';

import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = "info", title, children, className = "" }: AlertProps) {
  const configs = {
    info: {
      border: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
    },
    success: {
      border: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
    },
    warning: {
      border: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
    },
    error: {
      border: "border-rose-500/20 bg-rose-500/10 text-rose-300",
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
    }
  };

  const current = configs[type];

  return (
    <div className={\`flex gap-3 p-4 rounded-xl border text-sm text-left \${current.border} \${className}\`}>
      {current.icon}
      <div>
        {title && <h4 className="font-semibold text-white mb-0.5">{title}</h4>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
`,
    previewData: { title: "API Rate Limit", type: "warning", message: "You have used 85% of your allotted monthly credits." },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add alert",
    agentPrompt: `Add the InjectUI Alert component to this React project.

Install lucide-react for icon representation.
Create the component at @/components/ui/alert.tsx.`
  },
  {
    name: "Card",
    slug: "card",
    description: "Container component for displaying grouped content, headers, footers, and actions.",
    category: "Layout",
    version: "1.0.0",
    access: "free",
    published: true,
    props: [
      { name: "title", type: "string", defaultValue: "-", description: "Card title" },
      { name: "description", type: "string", defaultValue: "-", description: "Subtitle or description" },
      { name: "footer", type: "React.ReactNode", defaultValue: "-", description: "Footer actions element" },
      { name: "children", type: "React.ReactNode", defaultValue: "-", description: "Card body content", required: true }
    ],
    usage: `import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <Card
      title="Monthly Invoicing"
      description="Manage automated client billing schedules"
      footer={<Button size="sm">Configure</Button>}
    >
      <p className="text-sm text-slate-400">Next billing run will execute on the 1st of next month.</p>
    </Card>
  );
}`,
    sourceCode: `'use client';

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export function Card({ title, description, footer, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={\`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm text-left \${className}\`}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      )}
      <div className="text-slate-300 text-sm">{children}</div>
      {footer && <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-end">{footer}</div>}
    </div>
  );
}
`,
    previewData: { title: "Revenue Overview", description: "Current billing period summary" },
    dependencies: [],
    installCommand: "npx inject-ui add card",
    agentPrompt: `Add the InjectUI Card component to this React project.

Create the component at @/components/ui/card.tsx with title, description, and footer slot support.`
  },

  // --- PREMIUM COMPONENTS ---
  {
    name: "Modal",
    slug: "modal",
    description: "Accessible dialog overlay with keyboard focus trap, backdrop blur, and smooth transitions.",
    category: "Feedback",
    version: "1.0.0",
    access: "premium",
    published: true,
    props: [
      { name: "isOpen", type: "boolean", defaultValue: "false", description: "Controls visibility", required: true },
      { name: "onClose", type: "() => void", defaultValue: "-", description: "Callback when backdrop or close button is clicked", required: true },
      { name: "title", type: "string", defaultValue: "-", description: "Modal title" },
      { name: "children", type: "React.ReactNode", defaultValue: "-", description: "Modal dialog content", required: true }
    ],
    usage: `import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Subscription Upgrade">
        <p className="text-sm text-slate-300">Are you sure you want to upgrade to the Enterprise tier?</p>
      </Modal>
    </>
  );
}`,
    sourceCode: `'use client';

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-4 text-slate-300 text-sm">{children}</div>
      </div>
    </div>
  );
}
`,
    previewData: { title: "Confirm Upgrade", message: "Modal preview content" },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add modal",
    agentPrompt: `Add the InjectUI Premium Modal component to this React project.

Include backdrop blur, ESC key dismiss, body scroll lock, and close callbacks.
Place in @/components/ui/modal.tsx.`
  },
  {
    name: "Data Table",
    slug: "data-table",
    description: "Full-featured data grid with column sorting, filtering, row selection, and pagination.",
    category: "Data",
    version: "1.0.0",
    access: "premium",
    published: true,
    props: [
      { name: "columns", type: "Column[]", defaultValue: "[]", description: "Column definitions with headers and keys", required: true },
      { name: "data", type: "any[]", defaultValue: "[]", description: "Array of record objects", required: true },
      { name: "searchable", type: "boolean", defaultValue: "true", description: "Shows instant search input" }
    ],
    usage: `import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "name", label: "Customer" },
  { key: "plan", label: "Subscription" },
  { key: "mrr", label: "MRR" },
  { key: "status", label: "Status" },
];

const data = [
  { name: "Acme Corp", plan: "Enterprise", mrr: "$2,400", status: "Active" },
  { name: "Stripe Inc", plan: "Scale", mrr: "$1,800", status: "Active" },
];

export default function Example() {
  return <DataTable columns={columns} data={data} />;
}`,
    sourceCode: `'use client';

import React, { useState, useMemo } from "react";
import { ArrowUpDown, Search } from "lucide-react";

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        const compare = valA > valB ? 1 : -1;
        return sortOrder === "asc" ? compare : -compare;
      });
    }
    return result;
  }, [data, searchTerm, sortKey, sortOrder]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {searchable && (
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 font-semibold uppercase tracking-wider text-xs cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 font-medium">
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
    previewData: {
      columns: [{ key: "lead", label: "Lead Name" }, { key: "value", label: "Deal Value" }, { key: "stage", label: "Stage" }],
      data: [
        { lead: "Nexus Systems", value: "$45,000", stage: "Contract Sent" },
        { lead: "Vanguard Tech", value: "$82,000", stage: "Discovery" },
      ]
    },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add data-table",
    agentPrompt: `Add the InjectUI Premium Data Table component to this React project.

Support column definition mapping, interactive sorting, and global search filtering.
Install lucide-react for sort and search icons.
Place at @/components/ui/data-table.tsx.`
  },
  {
    name: "Dashboard Sidebar",
    slug: "dashboard-sidebar",
    description: "Responsive collapsible navigation sidebar with nested items, badges, and user profile switcher.",
    category: "Navigation",
    version: "1.0.0",
    access: "premium",
    published: true,
    props: [
      { name: "items", type: "SidebarItem[]", defaultValue: "[]", description: "Navigation links and badges", required: true },
      { name: "currentPath", type: "string", defaultValue: "'/'", description: "Currently active route path" },
      { name: "collapsed", type: "boolean", defaultValue: "false", description: "Collapse to icon-only rail" }
    ],
    usage: `import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";

const navItems = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Pipelines", href: "/admin/pipelines", badge: "New" },
  { label: "Accounts", href: "/admin/accounts" },
];

export default function Example() {
  return <DashboardSidebar items={navItems} currentPath="/admin" />;
}`,
    sourceCode: `'use client';

import React from "react";
import Link from "next/link";
import { LayoutGrid, BarChart3, Users, Settings, ChevronRight } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

export interface DashboardSidebarProps {
  items?: NavItem[];
  currentPath?: string;
}

export function DashboardSidebar({
  items = [
    { label: "Dashboard", href: "#", icon: "dashboard" },
    { label: "Pipeline", href: "#", icon: "chart", badge: "12" },
    { label: "Customers", href: "#", icon: "users" },
    { label: "Settings", href: "#", icon: "settings" },
  ],
  currentPath = "#",
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[380px] p-4 flex flex-col justify-between text-left">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            UI
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Inject Studio</h2>
            <p className="text-xs text-slate-400">Enterprise Workspace</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item, index) => {
            const isActive = item.href === currentPath || index === 0;
            return (
              <a
                key={item.label}
                href={item.href}
                className={\`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }\`}
              >
                <div className="flex items-center gap-2.5">
                  {index === 0 && <LayoutGrid className="w-4 h-4" />}
                  {index === 1 && <BarChart3 className="w-4 h-4" />}
                  {index === 2 && <Users className="w-4 h-4" />}
                  {index === 3 && <Settings className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 px-2 flex items-center justify-between text-xs text-slate-400">
        <span>v2.4.0</span>
        <span className="text-emerald-400 flex items-center gap-1">● Online</span>
      </div>
    </aside>
  );
}
`,
    previewData: { currentPath: "/admin" },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add dashboard-sidebar",
    agentPrompt: `Add the InjectUI Premium Dashboard Sidebar to this project.

Support nested items, active indicator badges, and modern dark-mode palette.
Place at @/components/ui/dashboard-sidebar.tsx.`
  },
  {
    name: "Tabs",
    slug: "tabs",
    description: "Organized multi-panel tab navigation with keyboard support and animated active indicators.",
    category: "Navigation",
    version: "1.0.0",
    access: "premium",
    published: true,
    props: [
      { name: "tabs", type: "TabItem[]", defaultValue: "[]", description: "Array of tab labels and keys", required: true },
      { name: "defaultTab", type: "string", defaultValue: "tabs[0].key", description: "Initially active tab" },
      { name: "onChange", type: "(key: string) => void", defaultValue: "-", description: "Active tab change handler" }
    ],
    usage: `import { Tabs } from "@/components/ui/tabs";

const items = [
  { key: "preview", label: "Live Preview", content: <div>Preview content here</div> },
  { key: "code", label: "Source Code", content: <div>Source code viewer</div> },
  { key: "props", label: "API Reference", content: <div>Props documentation</div> },
];

export default function Example() {
  return <Tabs tabs={items} />;
}`,
    sourceCode: `'use client';

import React, { useState } from "react";

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (key: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultTab || (tabs[0]?.key ?? ""));

  const handleSelect = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const activeTabItem = tabs.find((t) => t.key === activeKey) || tabs[0];

  return (
    <div className="w-full text-left">
      <div className="flex border-b border-slate-800 gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => handleSelect(tab.key)}
              className={\`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors \${
                isActive
                  ? "border-indigo-500 text-indigo-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }\`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4">{activeTabItem?.content}</div>
    </div>
  );
}
`,
    previewData: { defaultTab: "tab1" },
    dependencies: [],
    installCommand: "npx inject-ui add tabs",
    agentPrompt: `Add the InjectUI Premium Tabs component to this project.

Include keyboard accessible tabs with underline indicator and smooth tab switching.
Place at @/components/ui/tabs.tsx.`
  },
  {
    name: "Date Picker",
    slug: "date-picker",
    description: "Interactive calendar popover for selecting dates, ranges, and quick presets.",
    category: "Inputs",
    version: "1.0.0",
    access: "premium",
    published: true,
    props: [
      { name: "value", type: "Date", defaultValue: "new Date()", description: "Currently selected date" },
      { name: "onChange", type: "(date: Date) => void", defaultValue: "-", description: "Selection change listener" },
      { name: "label", type: "string", defaultValue: "-", description: "Input label" }
    ],
    usage: `import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export default function Example() {
  const [date, setDate] = useState(new Date());

  return <DatePicker label="Follow-up Date" value={date} onChange={setDate} />;
}`,
    sourceCode: `'use client';

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DatePicker({ label, value = new Date(), onChange }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [isOpen, setIsOpen] = useState(false);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleString("default", { month: "long" });

  const handleSelectDay = (day: number) => {
    const nextDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(nextDate);
    onChange?.(nextDate);
    setIsOpen(false);
  };

  const daysCount = daysInMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full max-w-xs text-left">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-sm hover:border-slate-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-30 w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-white">
            <span>{monthName} {currentYear}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth - 1, 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth + 1, 1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="text-slate-500 font-semibold py-1">{d}</span>
            ))}
            {daysArray.map((day) => {
              const isSelected = day === selectedDate.getDate();
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={\`py-1.5 rounded text-xs font-medium transition-colors \${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-300 hover:bg-slate-800"
                  }\`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
`,
    previewData: { label: "Pick a date" },
    dependencies: ["lucide-react"],
    installCommand: "npx inject-ui add date-picker",
    agentPrompt: `Add the InjectUI Premium Date Picker component to this project.

Include month navigation, calendar grid, popover trigger, and selected state styles.
Place at @/components/ui/date-picker.tsx.`
  }
];
