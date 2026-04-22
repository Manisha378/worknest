"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, CheckSquare, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { createTask, updateTask, deleteTask, updateTaskStatus } from "@/actions/task";
import { formatDate, isOverdue } from "@/lib/utils";
import { TaskStatus, TaskPriority } from "@prisma/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string | null;
  project?: { id: string; title: string } | null;
}

interface Project {
  id: string;
  title: string;
}

interface TasksClientProps {
  tasks: Task[];
  projects: Project[];
}

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export function TasksClient({ tasks, projects }: TasksClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (projectFilter !== "all" && task.projectId !== projectFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await createTask(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to create task");
    } else {
      toast.success("Task created");
      setIsCreateOpen(false);
      router.refresh();
    }
  }

  async function handleEdit(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await updateTask(formData);
    setLoading(false);

    if (!result.success) {
      if (result.errors) setErrors(result.errors);
      toast.error(result.message || "Failed to update task");
    } else {
      toast.success("Task updated");
      setIsEditOpen(false);
      setSelectedTask(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!selectedTask) return;
    setLoading(true);
    const result = await deleteTask(selectedTask.id);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Failed to delete task");
    } else {
      toast.success("Task deleted");
      setIsDeleteOpen(false);
      setSelectedTask(null);
      router.refresh();
    }
  }

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    const result = await updateTaskStatus(taskId, newStatus);
    if (result.success) {
      toast.success("Status updated");
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update status");
    }
  }

  function openEdit(task: Task) {
    setSelectedTask(task);
    setErrors({});
    setIsEditOpen(true);
  }

  function openDelete(task: Task) {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-900">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {tasks.length !== filteredTasks.length && ` (filtered from ${tasks.length})`}
          </h2>
          <p className="text-sm text-zinc-500">Manage your tasks</p>
        </div>
        <Button onClick={() => { setErrors({}); setIsCreateOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {PRIORITY_OPTIONS.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <CheckSquare className="mx-auto h-12 w-12 text-zinc-300" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900">
            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {tasks.length === 0
              ? "Create your first task to start tracking work"
              : "Try adjusting your filters"}
          </p>
          {tasks.length === 0 && (
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Task
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Project
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                    >
                      <SelectTrigger className="h-7 w-[120px]">
                        <Badge
                          variant={
                            task.status === "DONE"
                              ? "done"
                              : task.status === "IN_PROGRESS"
                              ? "in_progress"
                              : "todo"
                          }
                          className="text-xs"
                        >
                          {task.status === "TODO"
                            ? "To Do"
                            : task.status === "IN_PROGRESS"
                            ? "In Progress"
                            : "Done"}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    {task.dueDate ? (
                      <span
                        className={`text-sm ${
                          task.status !== "DONE" && isOverdue(task.dueDate)
                            ? "text-red-600 font-medium"
                            : "text-zinc-600"
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {task.project ? (
                      <span className="text-sm text-zinc-600">{task.project.title}</span>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(task)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDelete(task)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
            setSelectedTask(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {selectedTask ? "Update task details" : "Add a new task to your workspace"}
            </DialogDescription>
          </DialogHeader>
          <form
            action={selectedTask ? handleEdit : handleCreate}
            className="space-y-4"
          >
            {selectedTask && <input type="hidden" name="id" value={selectedTask.id} />}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Task title"
                defaultValue={selectedTask?.title}
                error={errors.title?.[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Optional task description"
                defaultValue={selectedTask?.description || ""}
                error={errors.description?.[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  name="status"
                  defaultValue={selectedTask?.status || "TODO"}
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  name="priority"
                  defaultValue={selectedTask?.priority || "MEDIUM"}
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={
                    selectedTask?.dueDate
                      ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <select
                  name="projectId"
                  defaultValue={selectedTask?.projectId || ""}
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                  setSelectedTask(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {selectedTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTask(null)}>
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