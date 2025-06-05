import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { User, TableColumn } from "@/types";
import { userAPI } from "@/services/api";
import { Plus, Users, Loader2 } from "lucide-react";

export default function UserList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error al cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar el usuario "${user.nombreCompleto}"?`,
      )
    ) {
      return;
    }

    try {
      const response = await userAPI.deleteUser(user.id);
      if (response.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado exitosamente",
        });
        loadUsers();
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: "nombreCompleto",
      label: "Nombre Completo",
      sortable: true,
    },
    {
      key: "username",
      label: "Usuario",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role.nombre",
      label: "Rol",
      sortable: true,
      render: (_, user) => (
        <Badge
          variant={
            user.role?.nombre === "Administrador" ? "default" : "secondary"
          }
        >
          {user.role?.nombre || "Sin rol"}
        </Badge>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (_, user) => (
        <Badge variant={user.activo ? "default" : "destructive"}>
          {user.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha de Registro",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("es-GT"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administre los usuarios del sistema y sus roles
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/roles">
            <Button variant="outline">Gestionar Roles</Button>
          </Link>
          <Link to="/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            Total de usuarios registrados: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            searchPlaceholder="Buscar usuarios..."
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.activo).length}
            </div>
            <p className="text-xs text-muted-foreground">
              De {users.length} usuarios totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role?.nombre === "Administrador").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios con rol admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registros Recientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                users.filter((u) => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(u.createdAt) > oneWeekAgo;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Últimos 7 días</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
