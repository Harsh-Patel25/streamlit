import { useState } from "react";
import { Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async () => {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      return apiRequest("PATCH", `/api/tasks/${task.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: task.status === "completed" ? "Task marked as pending" : "Task completed!",
        description: task.title,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: task.title,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-destructive";
      case "medium": return "border-l-warning";
      default: return "border-l-muted";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const isCompleted = task.status === "completed";
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <Card className={cn(
      "task-card border-l-4 transition-all duration-200",
      getPriorityColor(task.priority),
      isCompleted && "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Button
            variant="ghost"
            size="sm" 
            className={cn(
              "mt-1 w-5 h-5 p-0 rounded",
              isCompleted 
                ? "bg-success hover:bg-success/80 text-success-foreground" 
                : "border-2 border-muted-foreground hover:border-primary"
            )}
            onClick={() => toggleTaskMutation.mutate()}
            disabled={toggleTaskMutation.isPending}
            data-testid={`button-toggle-task-${task.id}`}
          >
            {isCompleted && <i className="fas fa-check text-xs animate-check"></i>}
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn(
                "font-medium text-foreground truncate",
                isCompleted && "line-through"
              )} data-testid={`text-task-title-${task.id}`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
                  isCompleted 
                    ? "bg-success text-success-foreground"
                    : getPriorityBadgeColor(task.priority)
                )}>
                  {isCompleted ? "Completed" : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                  data-testid={`button-expand-task-${task.id}`}
                >
                  <i className="fas fa-edit text-sm"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTaskMutation.mutate()}
                  disabled={deleteTaskMutation.isPending}
                  data-testid={`button-delete-task-${task.id}`}
                >
                  <i className="fas fa-trash text-sm"></i>
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-sm text-muted-foreground mb-3",
                isCompleted && "line-through"
              )} data-testid={`text-task-description-${task.id}`}>
                {task.description}
              </p>
            )}
            
            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-4 h-4 p-0 rounded",
                        subtask.completed 
                          ? "bg-success text-success-foreground" 
                          : "border border-muted-foreground hover:border-primary"
                      )}
                      data-testid={`button-toggle-subtask-${subtask.id}`}
                    >
                      {subtask.completed && <i className="fas fa-check text-xs"></i>}
                    </Button>
                    <span className={cn(
                      "text-muted-foreground",
                      subtask.completed && "line-through"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {task.dueDate && (
                  <span className={cn(
                    "flex items-center",
                    isOverdue ? "text-destructive" : "text-muted-foreground"
                  )}>
                    <i className="fas fa-calendar-alt mr-1"></i>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {task.category && (
                  <span className="text-muted-foreground flex items-center">
                    <i className="fas fa-tag mr-1"></i>
                    {task.category}
                  </span>
                )}
              </div>
              
              {isCompleted && task.completedAt && (
                <span className="text-success font-medium flex items-center">
                  <i className="fas fa-check-circle mr-1"></i>
                  Completed
                </span>
              )}
              
              {isOverdue && (
                <span className="text-destructive font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
