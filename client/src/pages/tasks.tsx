import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TaskCard from "@/components/tasks/task-card";
import TaskForm from "@/components/tasks/task-form";
import { cn } from "@/lib/utils";

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "high", label: "High Priority" },
    { key: "completed", label: "Completed" },
  ];

  const filteredTasks = tasks?.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    
    switch (filter) {
      case "today":
        return taskDate?.toDateString() === today.toDateString();
      case "week":
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return taskDate && taskDate >= today && taskDate <= weekFromNow;
      case "high":
        return task.priority === "high";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Tasks</h2>
          <p className="text-muted-foreground">Organize and track your daily tasks</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0"
          data-testid="button-new-task"
        >
          <i className="fas fa-plus mr-2"></i>
          New Task
        </Button>
      </div>

      {/* Task Form */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filterItem) => (
          <Button
            key={filterItem.key}
            variant={filter === filterItem.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterItem.key)}
            data-testid={`filter-${filterItem.key}`}
          >
            {filterItem.label}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <i className="fas fa-tasks text-muted-foreground text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === "all" 
                  ? "Create your first task to get started!" 
                  : `No tasks match the "${filters.find(f => f.key === filter)?.label}" filter.`
                }
              </p>
              {filter === "all" && (
                <Button onClick={() => setShowForm(true)} data-testid="button-create-first-task">
                  <i className="fas fa-plus mr-2"></i>
                  Create Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
