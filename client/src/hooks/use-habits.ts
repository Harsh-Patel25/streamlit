import { useQuery } from "@tanstack/react-query";
import { type Habit } from "@shared/schema";

export function useHabits() {
  return useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });
}

export function useHabit(id: string) {
  return useQuery<Habit>({
    queryKey: ["/api/habits", id],
    enabled: !!id,
  });
}
