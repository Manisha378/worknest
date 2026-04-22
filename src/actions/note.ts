"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from "@/validations/note";

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string || undefined,
  };

  const validatedData = createNoteSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const note = await db.note.create({
    data: {
      title: validatedData.data.title,
      content: validatedData.data.content,
      userId: session.user.id!,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");

  return { success: true, message: "Note created", note };
}

export async function updateNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string || undefined,
  };

  const validatedData = updateNoteSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const existingNote = await db.note.findUnique({
    where: { id: validatedData.data.id },
  });

  if (!existingNote) {
    return { success: false, message: "Note not found" };
  }

  if (existingNote.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  const note = await db.note.update({
    where: { id: validatedData.data.id },
    data: {
      title: validatedData.data.title,
      content: validatedData.data.content,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");

  return { success: true, message: "Note updated", note };
}

export async function deleteNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const validatedData = deleteNoteSchema.safeParse({ id: noteId });

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid note ID",
    };
  }

  const existingNote = await db.note.findUnique({
    where: { id: noteId },
  });

  if (!existingNote) {
    return { success: false, message: "Note not found" };
  }

  if (existingNote.userId !== session.user.id) {
    return { success: false, message: "Unauthorized" };
  }

  await db.note.delete({
    where: { id: noteId },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");

  return { success: true, message: "Note deleted" };
}

export async function getNotes(search?: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  const where: Record<string, unknown> = { userId: session.user.id };

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  return db.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const note = await db.note.findUnique({
    where: { id: noteId },
  });

  if (!note || note.userId !== session.user.id) {
    return null;
  }

  return note;
}