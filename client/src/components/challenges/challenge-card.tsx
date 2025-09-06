import { Challenge } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const progressPercent = Math.round((challenge.progress / challenge.duration) * 100);
  const daysRemaining = challenge.duration - challenge.progress;

  const joinChallengeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/challenges/${challenge.id}`, {
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      toast({
        title: "Challenge joined!",
        description: `You've joined the ${challenge.title} challenge.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join challenge",
        variant: "destructive",
      });
    },
  });

  const getGradientClass = () => {
    const gradients = [
      "from-success to-primary",
      "from-warning to-accent", 
      "from-secondary to-accent",
      "from-primary to-accent",
    ];
    return gradients[Math.abs(challenge.id.charCodeAt(0)) % gradients.length];
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
            getGradientClass()
          )}>
            <i className={`${challenge.icon} text-white text-xl`}></i>
          </div>
          
          {challenge.status === "available" ? (
            <Button
              size="sm"
              onClick={() => joinChallengeMutation.mutate()}
              disabled={joinChallengeMutation.isPending}
              data-testid={`button-join-challenge-${challenge.id}`}
            >
              {joinChallengeMutation.isPending ? "Joining..." : "Join Challenge"}
            </Button>
          ) : (
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              challenge.status === "active" 
                ? "bg-primary/10 text-primary"
                : "bg-success/10 text-success"
            )}>
              {challenge.progress}/{challenge.duration} days
            </span>
          )}
        </div>
        
        <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-challenge-title-${challenge.id}`}>
          {challenge.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
        
        {challenge.status !== "available" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{progressPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={cn("h-2 rounded-full transition-all duration-500 bg-gradient-to-r", getGradientClass())}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{daysRemaining} days remaining</span>
              <div className="flex items-center space-x-1 text-primary">
                <i className="fas fa-fire text-xs"></i>
                <span className="font-medium">{challenge.progress} day streak</span>
              </div>
            </div>
          </div>
        )}
        
        {challenge.status === "available" && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>⏱️ {challenge.duration} days</span>
            <span>👥 {challenge.participants} participants</span>
            <span>🏆 {challenge.badges?.length || 0} badges</span>
          </div>
        )}
        
        {challenge.status !== "available" && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[...Array(Math.min(3, challenge.participants))].map((_, i) => (
                  <div key={i} className={cn(
                    "w-6 h-6 rounded-full border-2 border-card flex items-center justify-center bg-gradient-to-br",
                    i === 0 ? "from-primary to-secondary" : 
                    i === 1 ? "from-success to-primary" : "from-accent to-warning"
                  )}>
                    <span className="text-xs text-white font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                ))}
                {challenge.participants > 3 && (
                  <div className="w-6 h-6 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-medium">
                      +{challenge.participants - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {challenge.participants} participants
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
