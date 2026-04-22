"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema } from "@/validations/task";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    dueDate: formData.get("dueDate") as string || undefined,
    projectId: formData.get("projectId") as string || undefined,
  };

  const validatedData = createTaskSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const projectId = validatedData.data.projectId || null;

  if (projectId) {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== session.user.id) {
      return { success: false, message: "Invalid project" };
    }
  }

  const task = await db.task.create({
    data: {
      title: validatedData.data.title,
      description: validatedData.data.description,
      status: validatedData.data.status,
      priority: validatedData.data.priority,
      dueDate: validatedData.data.dueDate ? new Date(validatedData.data.dueDate) : null,
      projectId: projectId,
      userId: session.user.id!,
    },
    include: {
      project: true,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);

  return { success: true, message: "Task created", task };
}

export async function updateTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    dueDate: formData.get("dueDate") as string || undefined,
    projectId: formData.get("projectId") as string || undefined,
  };

  const validatedData = updateTaskSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const existingTask = await db.task.findUnique({
    where: { id: validatedData.data.id },
  });

  if (!existingTask) {
    return { success: false, message: "Task not found" };
  }

  if (existingTask.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const projectId = validatedData.data.projectId || null;

  if (projectId) {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== session.user.id) {
      return { success: false, message: "Invalid project" };
    }
  }

  const task = await db.task.update({
    where: { id: validatedData.data.id },
    data: {
      title: validatedData.data.title,
      description: validatedData.data.description,
      status: validatedData.data.status,
      priority: validatedData.data.priority,
      dueDate: validatedData.data.dueDate ? new Date(validatedData.data.dueDate as string) : null,
      projectId: projectId,
    },
    include: {
      project: true,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true, message: "Task updated", task };
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const validatedData = deleteTaskSchema.safeParse({ id: taskId });

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid task ID",
    };
  }

  const existingTask = await db.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return { success: false, message: "Task not found" };
  }

  if (existingTask.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  await db.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true, message: "Task deleted" };
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const task = await db.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return { success: false, message: "Task not found" };
  }

  if (task.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  await db.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true, message: "Status updated" };
}

export async function getTasks(filters?: { status?: string; priority?: string; projectId?: string; search?: string }) {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  const where: Record<string, unknown> = { userId: session.user.id };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.priority) {
    where.priority = filters.priority;
  }

  if (filters?.projectId) {
    where.projectId = filters.projectId;
  }

  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }

  return db.task.findMany({
    where,
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
    },
  });

  if (!task || task.userId !== session.user.id) {
    return null;
  }

  return task;
}