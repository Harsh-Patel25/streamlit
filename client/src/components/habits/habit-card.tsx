import { useState } from "react";
import { Habit } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProgressRing from "@/components/ui/progress-ring";

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if completed today
  const today = new Date().toISOString().split('T')[0];
  const todayCompletion = habit.completions?.find(c => c.date === today);
  const isCompletedToday = todayCompletion?.value >= habit.targetValue;
  const currentProgress = todayCompletion?.value || 0;
  const progressPercent = Math.round((currentProgress / habit.targetValue) * 100);

  const toggleHabitMutation = useMutation({
    mutationFn: async () => {
      const newValue = isCompletedToday ? 0 : habit.targetValue;
      const newCompletions = habit.completions?.filter(c => c.date !== today) || [];
      if (newValue > 0) {
        newCompletions.push({ date: today, value: newValue });
      }

      // Update streak
      let newCurrentStreak = habit.currentStreak;
      if (newValue > 0 && !isCompletedToday) {
        newCurrentStreak += 1;
      } else if (newValue === 0 && isCompletedToday) {
        newCurrentStreak = Math.max(0, newCurrentStreak - 1);
      }

      const newBestStreak = Math.max(habit.bestStreak, newCurrentStreak);

      return apiRequest("PATCH", `/api/habits/${habit.id}`, {
        completions: newCompletions,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: isCompletedToday ? "Progress reset" : "Great job!",
        description: isCompletedToday ? "Habit marked as incomplete" : "Habit completed for today!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border transition-colors",
      isCompletedToday 
        ? "bg-success/5 border-success/20" 
        : currentProgress > 0
        ? "bg-primary/5 border-primary/20"
        : "bg-background border-border"
    )}>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-8 h-8 p-0 rounded-full transition-colors",
            isCompletedToday
              ? "bg-success hover:bg-success/80 text-success-foreground"
              : currentProgress > 0
              ? "bg-primary/20 border-2 border-primary text-primary"
              : "bg-muted border-2 border-muted-foreground hover:bg-primary/20 hover:border-primary"
          )}
          onClick={() => toggleHabitMutation.mutate()}
          disabled={toggleHabitMutation.isPending}
          data-testid={`button-toggle-habit-${habit.id}`}
        >
          {isCompletedToday ? (
            <i className="fas fa-check"></i>
          ) : (
            <i className={habit.icon}></i>
          )}
        </Button>
        
        <div>
          <h4 className="font-medium text-foreground" data-testid={`text-habit-name-${habit.id}`}>
            {habit.name}
          </h4>
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className={cn(
            "flex items-center space-x-1",
            isCompletedToday ? "text-success" : "text-muted-foreground"
          )}>
            <i className="fas fa-fire text-sm"></i>
            <span className="font-medium" data-testid={`text-habit-streak-${habit.id}`}>
              {habit.currentStreak} days
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Current streak</div>
        </div>
        
        <ProgressRing 
          progress={progressPercent} 
          size={48}
          strokeWidth={3}
          className={isCompletedToday ? "text-success" : "text-primary"}
        />
      </div>
    </div>
  );
}
