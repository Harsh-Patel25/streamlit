import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const getGradientClass = () => {
    if (!achievement.earned) return "from-muted to-muted";
    
    const gradients = [
      "from-warning to-accent",
      "from-success to-primary", 
      "from-primary to-secondary",
      "from-accent to-warning",
    ];
    return gradients[Math.abs(achievement.id.charCodeAt(0)) % gradients.length];
  };

  return (
    <Card className={cn(
      "text-center hover:shadow-md transition-shadow cursor-pointer",
      !achievement.earned && "opacity-50"
    )}>
      <CardContent className="p-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-gradient-to-br",
          getGradientClass()
        )}>
          <i className={cn(
            "text-white",
            achievement.earned ? achievement.icon : "fas fa-lock text-muted-foreground"
          )}></i>
        </div>
        <div className={cn(
          "text-xs font-medium mb-1",
          achievement.earned ? "text-foreground" : "text-muted-foreground"
        )} data-testid={`text-achievement-${achievement.id}`}>
          {achievement.name}
        </div>
        <div className="text-xs text-muted-foreground">{achievement.description}</div>
      </CardContent>
    </Card>
  );
}
