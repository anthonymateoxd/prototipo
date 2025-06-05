import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Region, ValidationError } from "@/types";
import { geographyAPI } from "@/services/api";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";

export default function RegionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Region>>({
    nombre: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoadingData(true);
      loadRegion(id);
    }
  }, [isEditing, id]);

  const loadRegion = async (regionId: string) => {
    try {
      const response = await geographyAPI.getRegions();
      if (response.success) {
        const region = response.data?.find((r) => r.id === regionId);
        if (region) {
          setFormData({
            nombre: region.nombre,
          });
        } else {
          toast({
            title: "Error",
            description: "Región no encontrada",
            variant: "destructive",
          });
          navigate("/geography");
        }
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "No se pudo cargar la región",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof Region, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.nombre?.trim()) {
      newErrors.push({
        field: "nombre",
        message: "El nombre de la región es obligatorio",
      });
    } else if (formData.nombre.trim().length < 3) {
      newErrors.push({
        field: "nombre",
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = isEditing
        ? await geographyAPI.updateRegion(id!, formData)
        : await geographyAPI.createRegion(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Región actualizada" : "Región creada",
          description: `La región ha sido ${isEditing ? "actualizada" : "creada"} exitosamente`,
        });
        navigate("/geography");
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        toast({
          title: "Error al guardar",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description:
          "Ocurrió un error inesperado. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((error) => error.field === field)?.message;
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/geography")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Región" : "Nueva Región"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modifique la información de la región"
              : "Complete la información para registrar una nueva región"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Información de la Región
          </CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre de la región */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Región *</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ej: Región Central"
                value={formData.nombre || ""}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={getFieldError("nombre") ? "border-red-500" : ""}
              />
              {getFieldError("nombre") && (
                <p className="text-sm text-red-500">
                  {getFieldError("nombre")}
                </p>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar Región" : "Crear Región"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/geography")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
