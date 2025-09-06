import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HabitCard from "@/components/habits/habit-card";
import HabitForm from "@/components/habits/habit-form";

export default function Habits() {
  const { data: habits, isLoading } = useHabits();
  const [showForm, setShowForm] = useState(false);

  const activeHabits = habits?.filter(habit => habit.isActive) || [];
  const bestStreak = Math.max(...(habits?.map(habit => habit.bestStreak) || [0]));
  const currentStreaks = activeHabits.map(habit => habit.currentStreak);
  const averageStreak = currentStreaks.length > 0 
    ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length) 
    : 0;

  // Calculate this week's completion rate
  const thisWeekRate = 85; // Placeholder calculation

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
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
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Habits</h2>
          <p className="text-muted-foreground">Build consistent daily habits for long-term success</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0"
          data-testid="button-new-habit"
        >
          <i className="fas fa-plus mr-2"></i>
          New Habit
        </Button>
      </div>

      {/* Habit Form */}
      {showForm && (
        <HabitForm onClose={() => setShowForm(false)} />
      )}

      {/* Habit Streak Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 habit-streak rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-fire text-white text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2" data-testid="text-best-streak">
              {bestStreak}
            </div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-calendar-check text-primary text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2" data-testid="text-active-habits">
              {activeHabits.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Habits</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-accent text-2xl"></i>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2" data-testid="text-week-rate">
              {thisWeekRate}%
            </div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Habits */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Habits</h3>
          <div className="space-y-4">
            {activeHabits.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-calendar-check text-muted-foreground text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building consistent daily habits to achieve your goals!
                </p>
                <Button onClick={() => setShowForm(true)} data-testid="button-create-first-habit">
                  <i className="fas fa-plus mr-2"></i>
                  Create Habit
                </Button>
              </div>
            ) : (
              activeHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Habit Calendar */}
      {activeHabits.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <i className="fas fa-chevron-left"></i>
                </Button>
                <span className="text-sm font-medium text-foreground px-3">Nov 13 - Nov 19</span>
                <Button variant="outline" size="sm">
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Habit</th>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                      <th key={day} className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {activeHabits.map((habit) => (
                    <tr key={habit.id} className="border-t border-border">
                      <td className="py-3 px-4 text-sm font-medium text-foreground" data-testid={`text-habit-${habit.id}`}>
                        {habit.name}
                      </td>
                      {[...Array(7)].map((_, dayIndex) => {
                        // Simulate completion data
                        const isCompleted = Math.random() > 0.3;
                        const isPartial = Math.random() > 0.7;
                        return (
                          <td key={dayIndex} className="text-center py-3 px-2">
                            <div className={`w-6 h-6 rounded mx-auto flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-success' 
                                : isPartial 
                                ? 'bg-warning' 
                                : 'bg-muted'
                            }`}>
                              {isCompleted ? (
                                <i className="fas fa-check text-white text-xs"></i>
                              ) : isPartial ? (
                                <span className="text-white text-xs font-bold">6</span>
                              ) : null}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
