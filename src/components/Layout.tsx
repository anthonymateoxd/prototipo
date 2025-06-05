import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  FileText,
  Building2,
  MapPin,
  BarChart3,
  Users,
  Shield,
  LogOut,
  User,
  Home,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const navigation: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    label: "Nueva Queja",
    href: "/complaint",
    icon: MessageSquare,
  },
  {
    label: "Comercios",
    href: "/businesses",
    icon: Building2,
    requiresAuth: true,
  },
  {
    label: "Propietarios",
    href: "/owners",
    icon: Users,
    requiresAuth: true,
  },
  {
    label: "Geografía",
    href: "/geography",
    icon: MapPin,
    requiresAuth: true,
  },
  {
    label: "Reportes",
    href: "/reports",
    icon: BarChart3,
    requiresAuth: true,
  },
  {
    label: "Usuarios",
    href: "/users",
    icon: Shield,
    requiresAuth: true,
    adminOnly: true,
  },
];

function NavLink({
  item,
  mobile = false,
}: {
  item: NavItem;
  mobile?: boolean;
}) {
  const location = useLocation();
  const { user } = useAuth();
  const Icon = item.icon;

  // Check if user can access this route
  if (item.requiresAuth && !user) return null;
  if (item.adminOnly && user?.role?.nombre !== "Administrador") return null;

  const isActive =
    location.pathname === item.href ||
    (item.href !== "/" && location.pathname.startsWith(item.href));

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        mobile && "w-full",
      )}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.nombreCompleto}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.nombreCompleto}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">{user.role?.nombre}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-card">
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Sistema de Quejas</h2>
          <p className="text-sm text-muted-foreground">Gestión Comercial</p>
        </div>
        <nav className="space-y-2">
          <NavLink
            key="/"
            item={{
              label: "Inicio",
              href: "/",
              icon: Home,
            }}
          />
        </nav>
      </div>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Sistema de Quejas</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-2">
          {navigation.map((item) => (
            <NavLink key={item.href} item={item} mobile />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="md:hidden">
              <h1 className="text-lg font-semibold">Sistema de Quejas</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
