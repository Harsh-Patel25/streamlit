import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fas fa-chart-line" },
    { path: "/tasks", label: "Tasks", icon: "fas fa-tasks" },
    { path: "/habits", label: "Habits", icon: "fas fa-calendar-check" },
    { path: "/challenges", label: "Challenges", icon: "fas fa-trophy" },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-primary-foreground text-sm"></i>
            </div>
            <h1 className="text-xl font-display font-semibold text-foreground">ProductivityFlow</h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button 
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    location === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 hover:bg-muted rounded-lg transition-colors" 
              title="Notifications"
              data-testid="button-notifications"
            >
              <i className="fas fa-bell text-muted-foreground"></i>
            </button>
            <button 
              className="p-2 hover:bg-muted rounded-lg transition-colors" 
              title="Settings"
              data-testid="button-settings"
            >
              <i className="fas fa-cog text-muted-foreground"></i>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
