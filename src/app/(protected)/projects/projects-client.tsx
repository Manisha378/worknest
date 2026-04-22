"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
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
import { createProject, updateProject, deleteProject } from "@/actions/project";

interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  _count?: {
    tasks: number;
  };
}

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await createProject(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to create project");
    } else {
      toast.success("Project created");
      setIsCreateOpen(false);
      router.refresh();
    }
  }

  async function handleEdit(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await updateProject(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to update project");
    } else {
      toast.success("Project updated");
      setIsEditOpen(false);
      setSelectedProject(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!selectedProject) return;
    setLoading(true);
    const result = await deleteProject(selectedProject.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Failed to delete project");
    } else {
      toast.success("Project deleted");
      setIsDeleteOpen(false);
      setSelectedProject(null);
      router.refresh();
    }
  }

  function openEdit(project: Project) {
    setSelectedProject(project);
    setErrors({});
    setIsEditOpen(true);
  }

  function openDelete(project: Project) {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-900">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-sm text-zinc-500">Manage your workspace projects</p>
        </div>
        <Button onClick={() => { setErrors({}); setIsCreateOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-300" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900">No projects yet</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Create your first project to organize your work
          </p>
          <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-medium text-zinc-900">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(project)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDelete(project)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {project._count?.tasks || 0} task{project._count?.tasks !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Add a new project to organize your work
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Project name"
                error={errors.title?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Optional project description"
                error={errors.description?.[0]}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <form action={handleEdit} className="space-y-4">
              <input type="hidden" name="id" value={selectedProject.id} />
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={selectedProject.title}
                  error={errors.title?.[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={selectedProject.description || ""}
                  error={errors.description?.[0]}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedProject(null);
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
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This will
              also delete all tasks in this project. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProject(null)}>
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