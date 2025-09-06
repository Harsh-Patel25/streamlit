import { useTasks } from "@/hooks/use-tasks";
import { useHabits } from "@/hooks/use-habits";
import { useChallenges } from "@/hooks/use-challenges";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: challenges, isLoading: challengesLoading } = useChallenges();

  const completedTasks = tasks?.filter(task => task.status === "completed").length || 0;
  const pendingTasks = tasks?.filter(task => task.status === "pending").length || 0;
  const activeChallenges = challenges?.filter(challenge => challenge.status === "active").length || 0;
  const bestStreak = Math.max(...(habits?.map(habit => habit.bestStreak) || [0]));

  const todayTasks = tasks?.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today;
  }).slice(0, 4) || [];

  const activeChallengesList = challenges?.filter(challenge => challenge.status === "active").slice(0, 3) || [];

  if (tasksLoading || habitsLoading || challengesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-xl p-6 text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-display font-semibold mb-2" data-testid="text-welcome">
              Good morning, Alex! 🌅
            </h2>
            <p className="text-primary-foreground/80 mb-4 md:mb-0">
              "Success is the sum of small efforts repeated day in and day out." - Robert Collier
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="text-tasks-today">{todayTasks.length}</div>
              <div className="text-sm text-primary-foreground/80">Tasks Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="text-best-streak">{bestStreak}</div>
              <div className="text-sm text-primary-foreground/80">Best Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-check text-success text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground" data-testid="text-completed-tasks">
                  {completedTasks}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
            <div className="text-sm text-success font-medium">This week</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-warning text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground" data-testid="text-pending-tasks">
                  {pendingTasks}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
            <div className="text-sm text-warning font-medium">{todayTasks.length} due today</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-fire text-accent text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground" data-testid="text-habit-streak">
                  {bestStreak}
                </div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </div>
            <div className="text-sm text-accent font-medium">Personal best!</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-trophy text-primary text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground" data-testid="text-challenges">
                  {challenges?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Challenges</div>
              </div>
            </div>
            <div className="text-sm text-primary font-medium">{activeChallenges} active</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
              <select className="text-sm border border-border rounded-md px-3 py-1 bg-background">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                const progress = [85, 92, 78, 95, 100, 0, 0][index];
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground w-20">{day}</span>
                    <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-12 text-right ${progress === 100 ? 'text-success' : ''}`}>
                      {progress}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Focus</h3>
            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle text-success text-2xl mb-2"></i>
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-primary'
                    }`}></div>
                    <span className="text-sm flex-1" data-testid={`text-task-${task.id}`}>
                      {task.title}
                    </span>
                    {task.status === 'completed' && (
                      <i className="fas fa-check text-success text-xs"></i>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Active Challenges</h3>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">View All</button>
          </div>
          {activeChallengesList.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-trophy text-muted-foreground text-3xl mb-4"></i>
              <p className="text-muted-foreground">No active challenges. Start one today!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallengesList.map((challenge) => {
                const progressPercent = Math.round((challenge.progress / challenge.duration) * 100);
                return (
                  <div key={challenge.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="challenge-badge w-8 h-8 rounded-full flex items-center justify-center">
                        <i className={`${challenge.icon} text-white text-sm`}></i>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {challenge.progress}/{challenge.duration} days
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mb-2" data-testid={`text-challenge-${challenge.id}`}>
                      {challenge.title}
                    </h4>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-warning to-accent h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {challenge.duration - challenge.progress} days remaining
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
