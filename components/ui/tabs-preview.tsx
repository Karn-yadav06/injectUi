"use client";

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
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-400 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
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
