import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Region,
  Department,
  Municipality,
  Business,
  ComplaintCategory,
  ReportFilterDTO,
} from "@/types";
import { geographyAPI, businessAPI, complaintAPI } from "@/services/api";
import { BarChart3, Loader2, Search } from "lucide-react";

export default function ReportFilters() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState<ReportFilterDTO>({
    regionId: undefined,
    departmentId: undefined,
    municipalityId: undefined,
    businessId: undefined,
    categoryId: undefined,
    fechaInicio: undefined,
    fechaFin: undefined,
  });

  // Options data
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.regionId && filters.regionId !== "all") {
      loadDepartments(filters.regionId);
      setFilters((prev) => ({
        ...prev,
        departmentId: undefined,
        municipalityId: undefined,
      }));
      setMunicipalities([]);
    } else {
      setDepartments([]);
      setMunicipalities([]);
    }
  }, [filters.regionId]);

  useEffect(() => {
    if (filters.departmentId && filters.departmentId !== "all") {
      loadMunicipalities(filters.departmentId);
      setFilters((prev) => ({ ...prev, municipalityId: undefined }));
    } else {
      setMunicipalities([]);
    }
  }, [filters.departmentId]);

  const loadInitialData = async () => {
    try {
      const [regionsRes, businessesRes, categoriesRes] = await Promise.all([
        geographyAPI.getRegions(),
        businessAPI.getBusinesses(),
        complaintAPI.getCategories(),
      ]);

      if (regionsRes.success) setRegions(regionsRes.data || []);
      if (businessesRes.success) setBusinesses(businessesRes.data || []);
      if (categoriesRes.success) setCategories(categoriesRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del formulario",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadDepartments = async (regionId: string) => {
    try {
      const response = await geographyAPI.getDepartments(regionId);
      if (response.success) {
        setDepartments(response.data || []);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const loadMunicipalities = async (departmentId: string) => {
    try {
      const response = await geographyAPI.getMunicipalities(departmentId);
      if (response.success) {
        setMunicipalities(response.data || []);
      }
    } catch (error) {
      console.error("Error loading municipalities:", error);
    }
  };

  const handleFilterChange = (
    field: keyof ReportFilterDTO,
    value: string | Date | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);

    try {
      // Validate that at least one filter is selected
      const hasFilters = Object.values(filters).some(
        (value) => value !== undefined && value !== null,
      );

      if (!hasFilters) {
        toast({
          title: "Filtros requeridos",
          description:
            "Debe seleccionar al menos un filtro para generar el reporte",
          variant: "destructive",
        });
        return;
      }

      // Navigate to results page with filters
      navigate("/reports/results", { state: { filters } });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      regionId: undefined,
      departmentId: undefined,
      municipalityId: undefined,
      businessId: undefined,
      categoryId: undefined,
      fechaInicio: undefined,
      fechaFin: undefined,
    });
    setDepartments([]);
    setMunicipalities([]);
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Generación de Reportes
        </h1>
        <p className="text-muted-foreground">
          Configure los filtros para generar reportes estadísticos de quejas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Filtros de Reporte
          </CardTitle>
          <CardDescription>
            Seleccione los criterios para generar el reporte. Debe seleccionar
            al menos un filtro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Región */}
            <div className="space-y-2">
              <Label htmlFor="region">Región</Label>
              <Select
                value={filters.regionId || "all"}
                onValueChange={(value) => handleFilterChange("regionId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las regiones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={filters.departmentId || "all"}
                onValueChange={(value) =>
                  handleFilterChange("departmentId", value)
                }
                disabled={!filters.regionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Municipio */}
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio</Label>
              <Select
                value={filters.municipalityId || "all"}
                onValueChange={(value) =>
                  handleFilterChange("municipalityId", value)
                }
                disabled={!filters.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los municipios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los municipios</SelectItem>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality.id} value={municipality.id}>
                      {municipality.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comercio */}
            <div className="space-y-2">
              <Label htmlFor="business">Comercio</Label>
              <Select
                value={filters.businessId || "all"}
                onValueChange={(value) =>
                  handleFilterChange("businessId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los comercios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los comercios</SelectItem>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría de Queja</Label>
              <Select
                value={filters.categoryId || "all"}
                onValueChange={(value) =>
                  handleFilterChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={
                  filters.fechaInicio
                    ? filters.fechaInicio.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleFilterChange(
                    "fechaInicio",
                    e.target.value ? new Date(e.target.value) : undefined,
                  )
                }
              />
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha de Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={
                  filters.fechaFin
                    ? filters.fechaFin.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleFilterChange(
                    "fechaFin",
                    e.target.value ? new Date(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Search className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={isLoading}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">
                Tipos de Reportes Disponibles
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Quejas por comercio</li>
                <li>• Quejas por ubicación geográfica</li>
                <li>• Quejas por categoría</li>
                <li>• Estadísticas por rango de fechas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Formatos de Exportación</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Exportación a PDF</li>
                <li>• Exportación a Excel</li>
                <li>• Visualización en pantalla</li>
                <li>• Gráficos estadísticos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
