import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatRelativeTime, isOverdue } from "@/lib/utils";
import { TaskStatus, TaskPriority } from "@prisma/client";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [projects, tasks, notes] = await Promise.all([
    db.project.findMany({
      where: { userId: userId! },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.task.findMany({
      where: { userId: userId! },
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.note.findMany({
      where: { userId: userId! },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "DONE").length,
    inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
  };

  const allTasks = await db.task.findMany({
    where: { userId: userId! },
    select: { status: true },
  });

  const completedCount = allTasks.filter((t) => t.status === "DONE").length;
  const inProgressCount = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingCount = allTasks.filter((t) => t.status === "TODO").length;

  const recentActivity = [
    ...projects.map((p) => ({
      id: p.id,
      type: "project" as const,
      title: p.title,
      createdAt: p.createdAt,
    })),
    ...tasks.map((t) => ({
      id: t.id,
      type: "task" as const,
      title: t.title,
      createdAt: t.createdAt,
    })),
    ...notes.map((n) => ({
      id: n.id,
      type: "note" as const,
      title: n.title,
      createdAt: n.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <Header
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "there"}`}
        description="Here's what's happening with your workspace"
        action={
          <Link href="/tasks">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Tasks</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900">{allTasks.length}</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Completed</p>
                <p className="mt-2 text-3xl font-semibold text-green-600">{completedCount}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">In Progress</p>
                <p className="mt-2 text-3xl font-semibold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Pending</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-600">{pendingCount}</p>
              </div>
              <div className="rounded-full bg-zinc-100 p-3">
                <AlertCircle className="h-6 w-6 text-zinc-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/projects"
                className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="rounded-lg bg-indigo-100 p-2">
                  <Plus className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">New Project</span>
              </Link>
              <Link
                href="/tasks"
                className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">New Task</span>
              </Link>
              <Link
                href="/notes"
                className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-green-200 hover:bg-green-50"
              >
                <div className="rounded-lg bg-green-100 p-2">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">New Note</span>
              </Link>
              <Link
                href="/profile"
                className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                <div className="rounded-lg bg-zinc-100 p-2">
                  <Clock className="h-5 w-5 text-zinc-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Settings</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-500">No recent activity</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Create your first project to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg px-2 py-1 text-xs font-medium ${
                          item.type === "project"
                            ? "bg-indigo-100 text-indigo-700"
                            : item.type === "task"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.type}
                      </div>
                      <span className="text-sm text-zinc-700">{item.title}</span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tasks</CardTitle>
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-zinc-300" />
                <h3 className="mt-4 text-sm font-medium text-zinc-900">No tasks yet</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Create your first task to start tracking work
                </p>
                <Link href="/tasks" className="mt-4 inline-block">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {task.project && (
                          <span className="text-xs text-zinc-400">
                            {task.project.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.status === "DONE"
                            ? "done"
                            : task.status === "IN_PROGRESS"
                            ? "in_progress"
                            : "todo"
                        }
                      >
                        {task.status === "TODO"
                          ? "To Do"
                          : task.status === "IN_PROGRESS"
                          ? "In Progress"
                          : "Done"}
                      </Badge>
                      <Badge
                        variant={
                          task.priority === "HIGH"
                            ? "high"
                            : task.priority === "MEDIUM"
                            ? "medium"
                            : "low"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}