import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in - WorkNest",
  description: "Sign in to your WorkNest account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-full flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <span className="text-lg font-bold text-white">W</span>
            </div>
            <span className="text-2xl font-semibold text-zinc-900">WorkNest</span>
          </div>
          {children}
        </div>
        <p className="mt-8 text-center text-sm text-zinc-400">
          Your productivity workspace
        </p>
      </div>
    </div>
  );
}