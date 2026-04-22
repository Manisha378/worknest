"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { ToasterProvider } from "@/components/ui/toast";

interface ShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function Shell({ children, userName, userEmail }: ShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ToasterProvider />
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="min-h-screen pl-0 pt-0 lg:pl-64 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}