import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .max(10000, "Content must be less than 10000 characters")
    .optional(),
});

export const updateNoteSchema = z.object({
  id: z.string().cuid("Invalid note ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .max(10000, "Content must be less than 10000 characters")
    .optional(),
});

export const deleteNoteSchema = z.object({
  id: z.string().cuid("Invalid note ID"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;