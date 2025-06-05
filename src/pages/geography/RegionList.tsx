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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { Region, Department, Municipality, TableColumn } from "@/types";
import { geographyAPI } from "@/services/api";
import { Plus, MapPin, Loader2 } from "lucide-react";

export default function RegionList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGeographyData();
  }, []);

  const loadGeographyData = async () => {
    try {
      const [regionsRes, departmentsRes, municipalitiesRes] = await Promise.all(
        [
          geographyAPI.getRegions(),
          geographyAPI.getDepartments(),
          geographyAPI.getMunicipalities(),
        ],
      );

      if (regionsRes.success) setRegions(regionsRes.data || []);
      if (departmentsRes.success) setDepartments(departmentsRes.data || []);
      if (municipalitiesRes.success)
        setMunicipalities(municipalitiesRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos geográficos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRegion = async (region: Region) => {
    if (
      !window.confirm(`¿Está seguro de eliminar la región "${region.nombre}"?`)
    ) {
      return;
    }

    try {
      const response = await geographyAPI.deleteRegion(region.id);
      if (response.success) {
        toast({
          title: "Región eliminada",
          description: "La región ha sido eliminada exitosamente",
        });
        loadGeographyData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la región",
        variant: "destructive",
      });
    }
  };

  const regionColumns: TableColumn<Region>[] = [
    {
      key: "nombre",
      label: "Nombre de la Región",
      sortable: true,
    },
    {
      key: "departments",
      label: "Departamentos",
      render: (_, region) => {
        const count = departments.filter(
          (d) => d.regionId === region.id,
        ).length;
        return `${count} departamento(s)`;
      },
    },
    {
      key: "createdAt",
      label: "Fecha de Registro",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("es-GT"),
    },
  ];

  const departmentColumns: TableColumn<Department>[] = [
    {
      key: "nombre",
      label: "Nombre del Departamento",
      sortable: true,
    },
    {
      key: "region.nombre",
      label: "Región",
      sortable: true,
      render: (_, department) => department.region?.nombre || "No asignada",
    },
    {
      key: "municipalities",
      label: "Municipios",
      render: (_, department) => {
        const count = municipalities.filter(
          (m) => m.departmentId === department.id,
        ).length;
        return `${count} municipio(s)`;
      },
    },
    {
      key: "createdAt",
      label: "Fecha de Registro",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("es-GT"),
    },
  ];

  const municipalityColumns: TableColumn<Municipality>[] = [
    {
      key: "nombre",
      label: "Nombre del Municipio",
      sortable: true,
    },
    {
      key: "department.nombre",
      label: "Departamento",
      sortable: true,
      render: (_, municipality) =>
        municipality.department?.nombre || "No asignado",
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
            Gestión Geográfica
          </h1>
          <p className="text-muted-foreground">
            Administre las regiones, departamentos y municipios del sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="regions">Regiones</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="municipalities">Municipios</TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Regiones
                  </CardTitle>
                  <CardDescription>
                    Total de regiones: {regions.length}
                  </CardDescription>
                </div>
                <Link to="/geography/regions/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Región
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={regions}
                columns={regionColumns}
                searchPlaceholder="Buscar regiones..."
                onEdit={(region) =>
                  navigate(`/geography/regions/${region.id}/edit`)
                }
                onDelete={handleDeleteRegion}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Departamentos
                  </CardTitle>
                  <CardDescription>
                    Total de departamentos: {departments.length}
                  </CardDescription>
                </div>
                <Link to="/geography/departments/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Departamento
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={departments}
                columns={departmentColumns}
                searchPlaceholder="Buscar departamentos..."
                onEdit={(department) =>
                  navigate(`/geography/departments/${department.id}/edit`)
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="municipalities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Municipios
                  </CardTitle>
                  <CardDescription>
                    Total de municipios: {municipalities.length}
                  </CardDescription>
                </div>
                <Link to="/geography/municipalities/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Municipio
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={municipalities}
                columns={municipalityColumns}
                searchPlaceholder="Buscar municipios..."
                onEdit={(municipality) =>
                  navigate(`/geography/municipalities/${municipality.id}/edit`)
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
