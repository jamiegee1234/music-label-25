import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Mic,
  Search,
  Disc,
  Megaphone,
  Ticket,
  FileText,
  TrendingUp,
  DollarSign,
  Newspaper,
  Settings,
  Music,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, count: null },
  { name: "Artists", href: "/artists", icon: Mic, count: 12 },
  { name: "Scouting", href: "/scouting", icon: Search, count: 5 },
  { name: "Production", href: "/production", icon: Disc, count: 8 },
  { name: "Marketing", href: "/marketing", icon: Megaphone, count: 3 },
  { name: "Touring", href: "/touring", icon: Ticket, count: 6 },
  { name: "Contracts", href: "/contracts", icon: FileText, count: 2 },
  { name: "Charts & Trends", href: "/charts", icon: TrendingUp, count: null },
  { name: "Finance", href: "/finance", icon: DollarSign, count: null },
  { name: "Industry News", href: "/news", icon: Newspaper, count: 15 },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <div className={cn(
      "bg-[var(--fm-darker)] border-r border-[var(--fm-border)] flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-[var(--fm-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--fm-accent)] rounded-lg flex items-center justify-center">
              <Music className="text-white h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-[var(--fm-text)]">A&R Empire</h1>
                <p className="text-xs text-[var(--fm-text-dim)]">Stellar Music</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[var(--fm-text-dim)] hover:text-[var(--fm-text)]"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium group relative",
                  isActive
                    ? "bg-[var(--fm-panel)] text-[var(--fm-accent)] border border-[var(--fm-accent)]/30 shadow-lg"
                    : "text-[var(--fm-text)] hover:bg-[var(--fm-panel)] hover:text-[var(--fm-text)] hover:shadow-md"
                )}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span>{item.name}</span>
                    {item.count && (
                      <Badge className="ml-auto bg-[var(--fm-accent)] text-xs px-2 py-1 rounded-full text-white">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[var(--fm-accent)] rounded-r-full"></div>
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[var(--fm-border)]">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-[var(--fm-accent)] border-[var(--fm-accent)]/30 hover:bg-[var(--fm-accent)]/10"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications ({notifications})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-[var(--fm-accent)] border-[var(--fm-accent)]/30 hover:bg-[var(--fm-accent)]/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-[var(--fm-border)]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
              alt="CEO Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--fm-success)] rounded-full border-2 border-[var(--fm-darker)]"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm text-[var(--fm-text)]">Marcus Rivera</p>
              <p className="text-xs text-[var(--fm-text-dim)]">CEO</p>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[var(--fm-text-dim)] hover:text-[var(--fm-text)]"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[var(--fm-text-dim)] hover:text-[var(--fm-text)]"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 