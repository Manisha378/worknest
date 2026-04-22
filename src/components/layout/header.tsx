"use client";

import * as React from "react";
import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </header>
  );
}