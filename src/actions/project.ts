"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createProjectSchema, updateProjectSchema, deleteProjectSchema } from "@/validations/project";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
  };

  const validatedData = createProjectSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const project = await db.project.create({
    data: {
      title: validatedData.data.title,
      description: validatedData.data.description,
      userId: session.user.id!,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { success: true, message: "Project created", project };
}

export async function updateProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
  };

  const validatedData = updateProjectSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const existingProject = await db.project.findUnique({
    where: { id: validatedData.data.id },
  });

  if (!existingProject) {
    return { success: false, message: "Project not found" };
  }

  if (existingProject.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const project = await db.project.update({
    where: { id: validatedData.data.id },
    data: {
      title: validatedData.data.title,
      description: validatedData.data.description,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { success: true, message: "Project updated", project };
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const validatedData = deleteProjectSchema.safeParse({ id: projectId });

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid project ID",
    };
  }

  const existingProject = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    return { success: false, message: "Project not found" };
  }

  if (existingProject.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  await db.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { success: true, message: "Project deleted" };
}

export async function getProjects() {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  return db.project.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project || project.userId !== session.user.id) {
    return null;
  }

  return project;
}