import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  Building2,
  MapPin,
  BarChart3,
  Users,
  Shield,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const quickActions: QuickAction[] = [
  {
    title: "Nueva Queja",
    description: "Registrar una nueva queja de forma anónima",
    href: "/complaint",
    icon: MessageSquare,
  },
  {
    title: "Gestionar Comercios",
    description: "Administrar comercios y sus sucursales",
    href: "/businesses",
    icon: Building2,
    requiresAuth: true,
  },
  {
    title: "Gestionar Propietarios",
    description: "Administrar información de propietarios",
    href: "/owners",
    icon: Users,
    requiresAuth: true,
  },
  {
    title: "Configurar Geografía",
    description: "Administrar regiones, departamentos y municipios",
    href: "/geography",
    icon: MapPin,
    requiresAuth: true,
  },
  {
    title: "Ver Reportes",
    description: "Generar reportes y estadísticas de quejas",
    href: "/reports",
    icon: BarChart3,
    requiresAuth: true,
  },
  {
    title: "Administrar Usuarios",
    description: "Gestionar usuarios y roles del sistema",
    href: "/users",
    icon: Shield,
    requiresAuth: true,
    adminOnly: true,
  },
];

const stats = [
  {
    title: "Quejas Registradas",
    value: "1,234",
    description: "Total de quejas en el sistema",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Quejas Activas",
    value: "89",
    description: "Quejas pendientes de resolver",
    icon: AlertCircle,
    color: "text-orange-600",
  },
  {
    title: "Comercios Registrados",
    value: "456",
    description: "Total de comercios en el sistema",
    icon: Building2,
    color: "text-green-600",
  },
  {
    title: "Promedio Mensual",
    value: "23",
    description: "Quejas promedio por mes",
    icon: TrendingUp,
    color: "text-purple-600",
  },
];

export default function Index() {
  const { user } = useAuth();

  const availableActions = quickActions.filter((action) => {
    if (action.requiresAuth && !user) return false;
    if (action.adminOnly && user?.role?.nombre !== "Administrador")
      return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Sistema de Gestión de Quejas Comerciales
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Plataforma integral para la gestión y seguimiento de quejas
          comerciales, facilitando la comunicación entre consumidores y
          establecimientos comerciales.
        </p>
      </div>

      {/* Statistics */}
      {user && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Acciones Rápidas</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.href}
                className="transition-colors hover:bg-accent"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={action.href}>
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>
            Características y funcionalidades principales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Para Consumidores</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Registro anónimo de quejas</li>
                <li>• Categorización por tipo de problema</li>
                <li>• Seguimiento del estado de la queja</li>
                <li>• Confirmación de registro</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Para Administradores</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Gestión de comercios y propietarios</li>
                <li>• Reportes estadísticos detallados</li>
                <li>• Administración de usuarios y roles</li>
                <li>• Auditoría de acciones del sistema</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication CTA */}
      {!user && (
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>¿Eres administrador del sistema?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Inicia sesión para acceder a las funciones de administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button variant="secondary">Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
