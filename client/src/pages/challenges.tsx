import { useState } from "react";
import { useChallenges } from "@/hooks/use-challenges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ChallengeCard from "@/components/challenges/challenge-card";
import AchievementBadge from "@/components/challenges/achievement-badge";

export default function Challenges() {
  const { data: challenges, isLoading } = useChallenges();

  const activeChallenges = challenges?.filter(c => c.status === "active") || [];
  const completedChallenges = challenges?.filter(c => c.status === "completed") || [];
  const availableChallenges = challenges?.filter(c => c.status === "available") || [];

  // Mock achievement data
  const achievements = [
    { id: "1", name: "Fire Starter", description: "7-day streak", icon: "fas fa-fire", earned: true },
    { id: "2", name: "First Win", description: "Complete challenge", icon: "fas fa-trophy", earned: true },
    { id: "3", name: "Consistent", description: "14-day streak", icon: "fas fa-star", earned: true },
    { id: "4", name: "Lightning", description: "Fast completion", icon: "fas fa-bolt", earned: true },
    { id: "5", name: "Champion", description: "30-day streak", icon: "fas fa-lock", earned: false },
    { id: "6", name: "Legend", description: "90-day streak", icon: "fas fa-lock", earned: false },
  ];

  const earnedBadges = achievements.filter(a => a.earned).length;
  const bestStreak = 72;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Challenges</h2>
          <p className="text-muted-foreground">Take on 30-day challenges to build lasting habits</p>
        </div>
        <Button className="mt-4 sm:mt-0" data-testid="button-join-challenge">
          <i className="fas fa-plus mr-2"></i>
          Join Challenge
        </Button>
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-trophy text-success text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-completed-challenges">
              {completedChallenges.length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-clock text-primary text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-active-challenges">
              {activeChallenges.length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-star text-accent text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-badges-earned">
              {earnedBadges}
            </div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-fire text-warning text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-best-streak">
              {bestStreak}
            </div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      {/* Available Challenges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Challenges</h3>
        {availableChallenges.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <i className="fas fa-trophy text-muted-foreground text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">No challenges available</h3>
              <p className="text-muted-foreground">New challenges will be added soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
