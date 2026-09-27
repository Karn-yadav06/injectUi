"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Mail,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleGrantPremium = async (customerId: string) => {
    setActionLoading(customerId);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/grant-premium`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
      } else {
        alert(data.message || "Failed to grant premium access.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokePremium = async (customerId: string) => {
    setActionLoading(customerId);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/revoke-premium`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomers();
      } else {
        alert(data.message || "Failed to revoke premium access.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Customer Premium Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review customer accounts and toggle premium tier access permissions.
        </p>
      </div>

      {/* Security Rule Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Live Access Control:</span> Granting or revoking premium status takes effect immediately on subsequent API requests. Customers cannot change their own tier, and premium status does not bestow administrative rights.
        </div>
      </div>

      {/* Customers Table */}
      <div className="border border-slate-800 bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Email</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Premium Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{cust.email}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {cust.name}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {cust.premium ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          Free Tier
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {cust.premium ? (
                        <button
                          onClick={() => handleRevokePremium(cust._id)}
                          disabled={actionLoading === cust._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 transition-colors inline-flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Revoke Premium
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGrantPremium(cust._id)}
                          disabled={actionLoading === cust._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Grant Premium
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
