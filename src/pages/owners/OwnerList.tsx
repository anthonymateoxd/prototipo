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
import { Owner, TableColumn } from "@/types";
import { ownerAPI } from "@/services/api";
import { Plus, Users, Loader2 } from "lucide-react";

export default function OwnerList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const response = await ownerAPI.getOwners();
      if (response.success) {
        setOwners(response.data || []);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los propietarios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error al cargar los propietarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (owner: Owner) => {
    navigate(`/owners/${owner.id}/edit`);
  };

  const handleDelete = async (owner: Owner) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar el propietario "${owner.nombreCompleto}"?`,
      )
    ) {
      return;
    }

    try {
      const response = await ownerAPI.deleteOwner(owner.id);
      if (response.success) {
        toast({
          title: "Propietario eliminado",
          description: "El propietario ha sido eliminado exitosamente",
        });
        loadOwners();
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
        description: "No se pudo eliminar el propietario",
        variant: "destructive",
      });
    }
  };

  const columns: TableColumn<Owner>[] = [
    {
      key: "nombreCompleto",
      label: "Nombre Completo",
      sortable: true,
    },
    {
      key: "nit",
      label: "NIT",
      sortable: true,
    },
    {
      key: "telefono",
      label: "Teléfono",
    },
    {
      key: "email",
      label: "Email",
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
            Gestión de Propietarios
          </h1>
          <p className="text-muted-foreground">
            Administre los propietarios de comercios registrados en el sistema
          </p>
        </div>
        <Link to="/owners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Propietario
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Propietarios
          </CardTitle>
          <CardDescription>
            Total de propietarios registrados: {owners.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={owners}
            columns={columns}
            searchPlaceholder="Buscar propietarios..."
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
