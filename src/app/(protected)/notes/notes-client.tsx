"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createNote, updateNote, deleteNote } from "@/actions/note";
import { formatRelativeTime, truncate } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesClientProps {
  notes: Note[];
}

export function NotesClient({ notes }: NotesClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await createNote(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to create note");
    } else {
      toast.success("Note created");
      setIsCreateOpen(false);
      router.refresh();
    }
  }

  async function handleEdit(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await updateNote(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to update note");
    } else {
      toast.success("Note updated");
      setIsEditOpen(false);
      setSelectedNote(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!selectedNote) return;
    setLoading(true);
    const result = await deleteNote(selectedNote.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Failed to delete note");
    } else {
      toast.success("Note deleted");
      setIsDeleteOpen(false);
      setSelectedNote(null);
      router.refresh();
    }
  }

  function openEdit(note: Note) {
    setSelectedNote(note);
    setErrors({});
    setIsEditOpen(true);
  }

  function openDelete(note: Note) {
    setSelectedNote(note);
    setIsDeleteOpen(true);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-900">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-sm text-zinc-500">Capture and organize your thoughts</p>
        </div>
        <Button onClick={() => { setErrors({}); setIsCreateOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-zinc-300" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900">
            {notes.length === 0 ? "No notes yet" : "No matching notes"}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {notes.length === 0
              ? "Create your first note to capture your thoughts"
              : "Try adjusting your search"}
          </p>
          {notes.length === 0 && (
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group relative rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-medium text-zinc-900">
                    {note.title}
                  </h3>
                  {note.content && (
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-500">
                      {truncate(note.content, 150)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {formatRelativeTime(note.updatedAt)}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(note)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDelete(note)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription>
              Add a new note to capture your thoughts
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Note title"
                error={errors.title?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your note here..."
                className="min-h-[200px]"
                error={errors.content?.[0]}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Update note details</DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <form action={handleEdit} className="space-y-4">
              <input type="hidden" name="id" value={selectedNote.id} />
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={selectedNote.title}
                  error={errors.title?.[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={selectedNote.content || ""}
                  className="min-h-[200px]"
                  error={errors.content?.[0]}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedNote(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedNote?.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedNote(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}