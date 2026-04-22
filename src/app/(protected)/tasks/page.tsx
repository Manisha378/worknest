import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [tasks, projects] = await Promise.all([
    db.task.findMany({
      where: { userId: userId! },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    db.project.findMany({
      where: { userId: userId! },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div>
      <Header
        title="Tasks"
        description="Track and manage your tasks"
      />
      <TasksClient tasks={tasks} projects={projects} />
    </div>
  );
}