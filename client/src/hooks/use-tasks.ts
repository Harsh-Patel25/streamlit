import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Task } from "@shared/schema";

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
  });
}
