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
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { Business, TableColumn } from "@/types";
import { businessAPI } from "@/services/api";
import { Plus, Building, Loader2 } from "lucide-react";

export default function BusinessList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const response = await businessAPI.getBusinesses();
      if (response.success) {
        setBusinesses(response.data || []);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los comercios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error al cargar los comercios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (business: Business) => {
    navigate(`/businesses/${business.id}/edit`);
  };

  const handleDelete = async (business: Business) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar el comercio "${business.nombre}"?`,
      )
    ) {
      return;
    }

    try {
      const response = await businessAPI.deleteBusiness(business.id);
      if (response.success) {
        toast({
          title: "Comercio eliminado",
          description: "El comercio ha sido eliminado exitosamente",
        });
        loadBusinesses();
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
        description: "No se pudo eliminar el comercio",
        variant: "destructive",
      });
    }
  };

  const handleViewBranches = (business: Business) => {
    navigate(`/businesses/${business.id}/branches`);
  };

  const columns: TableColumn<Business>[] = [
    {
      key: "nombre",
      label: "Nombre del Comercio",
      sortable: true,
    },
    {
      key: "owner.nombreCompleto",
      label: "Propietario",
      sortable: true,
      render: (_, business) => business.owner?.nombreCompleto || "No asignado",
    },
    {
      key: "owner.nit",
      label: "NIT del Propietario",
      render: (_, business) => business.owner?.nit || "No disponible",
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
            Gestión de Comercios
          </h1>
          <p className="text-muted-foreground">
            Administre los comercios registrados en el sistema
          </p>
        </div>
        <Link to="/businesses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Comercio
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Lista de Comercios
          </CardTitle>
          <CardDescription>
            Total de comercios registrados: {businesses.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={businesses}
            columns={columns}
            searchPlaceholder="Buscar comercios..."
            onEdit={handleEdit}
            onDelete={handleDelete}
            customActions={[
              {
                label: "Ver Sucursales",
                onClick: handleViewBranches,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comercios
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">
              Comercios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propietarios Únicos
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(businesses.map((b) => b.ownerId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Propietarios diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registros Recientes
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                businesses.filter((b) => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(b.createdAt) > oneWeekAgo;
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
