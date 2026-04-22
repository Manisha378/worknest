import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const projects = await db.project.findMany({
    where: { userId: userId! },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Header
        title="Projects"
        description="Organize your work into projects"
      />
      <ProjectsClient projects={projects} />
    </div>
  );
}