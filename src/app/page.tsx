import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  FolderKanban,
  CheckSquare,
  FileText,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-lg font-semibold text-zinc-900">WorkNest</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-600">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Designed for modern teams</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 md:text-6xl">
            Your workspace for
            <br />
            <span className="text-indigo-600">better productivity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            Organize projects, manage tasks, and capture notes — all in one clean,
            intuitive workspace. Built for teams who value clarity and focus.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 w-full max-w-5xl">
          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-2xl shadow-zinc-900/5">
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                {[
                  { label: "Total Tasks", value: "24", color: "bg-indigo-100" },
                  { label: "In Progress", value: "8", color: "bg-blue-100" },
                  { label: "Completed", value: "16", color: "bg-green-100" },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                    <p className="text-sm text-zinc-600">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-900">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-100 p-6">
                <h3 className="mb-4 text-sm font-medium text-zinc-500">Recent Tasks</h3>
                <div className="space-y-3">
                  {[
                    { title: "Review design mockups", status: "In Progress", priority: "High" },
                    { title: "Update documentation", status: "To Do", priority: "Medium" },
                    { title: "Deploy to production", status: "Done", priority: "High" },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white p-3">
                      <span className="text-sm font-medium text-zinc-700">{task.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.status === "Done" ? "bg-green-100 text-green-700" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-zinc-100 text-zinc-600"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-zinc-900">Everything you need</h2>
            <p className="mt-4 text-lg text-zinc-500">
              Powerful features to help you stay organized and productive
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FolderKanban className="h-6 w-6 text-indigo-600" />,
                title: "Projects",
                description: "Organize your work into projects. Keep everything related to a goal in one place.",
              },
              {
                icon: <CheckSquare className="h-6 w-6 text-indigo-600" />,
                title: "Tasks",
                description: "Create, assign, and track tasks. Set priorities and due dates to stay on track.",
              },
              {
                icon: <FileText className="h-6 w-6 text-indigo-600" />,
                title: "Notes",
                description: "Capture ideas, meeting notes, and documentation. Everything at your fingertips.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-3">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">Built for speed</h2>
              <p className="mt-4 text-lg text-zinc-500">
                Every interaction is designed to be fast and responsive. No lag, no friction — just productivity.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Real-time updates across all your devices",
                  "Keyboard shortcuts for power users",
                  "Instant search across projects and tasks",
                  "Optimized for performance from day one",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-zinc-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-100" />
                  <div>
                    <div className="h-4 w-32 rounded bg-zinc-300" />
                    <div className="mt-2 h-3 w-48 rounded bg-zinc-200" />
                  </div>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100" />
                  <div>
                    <div className="h-4 w-40 rounded bg-zinc-300" />
                    <div className="mt-2 h-3 w-32 rounded bg-zinc-200" />
                  </div>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100" />
                  <div>
                    <div className="h-4 w-36 rounded bg-zinc-300" />
                    <div className="mt-2 h-3 w-44 rounded bg-zinc-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-lg text-zinc-400">
            Join thousands of teams who use WorkNest to stay organized and productive.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
              <span className="text-xs font-bold text-white">W</span>
            </div>
            <span className="text-sm font-medium text-zinc-600">WorkNest</span>
          </div>
          <p className="text-sm text-zinc-400">
            Built for productivity. Made with care.
          </p>
        </div>
      </footer>
    </div>
  );
}