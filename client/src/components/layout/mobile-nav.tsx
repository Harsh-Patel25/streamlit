import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fas fa-chart-line" },
    { path: "/tasks", label: "Tasks", icon: "fas fa-tasks" },
    { path: "/habits", label: "Habits", icon: "fas fa-calendar-check" },
    { path: "/challenges", label: "Challenges", icon: "fas fa-trophy" },
  ];

  return (
    <nav className="md:hidden bg-card border-b border-border px-4 py-2">
      <div className="flex space-x-1 overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button 
              className={cn(
                "px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                location === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <i className={`${item.icon} mr-1`}></i>
              {item.label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
