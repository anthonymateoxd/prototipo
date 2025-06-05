import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  ReportFilterDTO,
  ReportDataDTO,
  ComplaintSummaryDTO,
  TableColumn,
} from "@/types";
import { reportsAPI } from "@/services/api";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  BarChart3,
} from "lucide-react";

export default function ReportResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const filters = location.state?.filters as ReportFilterDTO;
  const [reportData, setReportData] = useState<ReportDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!filters) {
      toast({
        title: "Error",
        description: "No se encontraron filtros para el reporte",
        variant: "destructive",
      });
      navigate("/reports");
      return;
    }

    generateReport();
  }, [filters]);

  const generateReport = async () => {
    try {
      const response = await reportsAPI.generateReport(filters);
      if (response.success) {
        setReportData(response.data);
      } else {
        toast({
          title: "Error",
          description: "No se pudo generar el reporte",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error al generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: "PDF" | "EXCEL") => {
    if (!reportData) return;

    setIsExporting(true);
    try {
      const response = await reportsAPI.exportReport(format, reportData);
      if (response.success) {
        toast({
          title: "Exportación exitosa",
          description: `El reporte ha sido exportado a ${format}`,
        });

        // In a real app, this would trigger a download
        window.open(response.data?.url, "_blank");
      } else {
        toast({
          title: "Error de exportación",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getAppliedFiltersText = (): string => {
    if (!filters) return "";

    const appliedFilters: string[] = [];
    if (filters.regionId) appliedFilters.push("Región");
    if (filters.departmentId) appliedFilters.push("Departamento");
    if (filters.municipalityId) appliedFilters.push("Municipio");
    if (filters.businessId) appliedFilters.push("Comercio");
    if (filters.categoryId) appliedFilters.push("Categoría");
    if (filters.fechaInicio || filters.fechaFin)
      appliedFilters.push("Rango de fechas");

    return appliedFilters.join(", ");
  };

  const columns: TableColumn<ComplaintSummaryDTO>[] = [
    {
      key: "businessNombre",
      label: "Comercio",
      sortable: true,
    },
    {
      key: "municipalityNombre",
      label: "Municipio",
      sortable: true,
    },
    {
      key: "departmentNombre",
      label: "Departamento",
      sortable: true,
    },
    {
      key: "regionNombre",
      label: "Región",
      sortable: true,
    },
    {
      key: "categoryNombre",
      label: "Categoría",
      sortable: true,
    },
    {
      key: "totalQuejas",
      label: "Total de Quejas",
      sortable: true,
      render: (value) => <span className="font-semibold text-lg">{value}</span>,
    },
    {
      key: "fechaUltimaQueja",
      label: "Última Queja",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("es-GT"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Generando reporte...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Error al cargar el reporte</CardTitle>
            <CardDescription>
              No se pudieron cargar los datos del reporte
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/reports")}>
              Volver a Filtros
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/reports")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Filtros
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resultados del Reporte
          </h1>
          <p className="text-muted-foreground">
            Reporte generado el{" "}
            {reportData.metadatos.fechaGeneracion.toLocaleString("es-GT")}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Quejas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.metadatos.total}
            </div>
            <p className="text-xs text-muted-foreground">Quejas encontradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comercios Afectados
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(reportData.resultados.map((r) => r.businessNombre)).size}
            </div>
            <p className="text-xs text-muted-foreground">Comercios únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio por Comercio
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.resultados.length > 0
                ? Math.round(
                    reportData.metadatos.total / reportData.resultados.length,
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Quejas por comercio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtros Aplicados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {reportData.metadatos.filtrosAplicados.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {getAppliedFiltersText()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones de Exportación</CardTitle>
          <CardDescription>
            Exporte los resultados del reporte en diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => handleExport("PDF")}
              disabled={isExporting}
              variant="outline"
            >
              {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Exportar a PDF
            </Button>
            <Button
              onClick={() => handleExport("EXCEL")}
              disabled={isExporting}
              variant="outline"
            >
              {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Exportar a Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados Detallados</CardTitle>
          <CardDescription>
            Mostrando {reportData.resultados.length} resultado(s) de{" "}
            {reportData.metadatos.total} quejas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportData.resultados.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">
                No se encontraron resultados
              </h3>
              <p className="text-muted-foreground">
                No hay quejas que coincidan con los filtros seleccionados
              </p>
            </div>
          ) : (
            <DataTable
              data={reportData.resultados}
              columns={columns}
              searchPlaceholder="Buscar en resultados..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
