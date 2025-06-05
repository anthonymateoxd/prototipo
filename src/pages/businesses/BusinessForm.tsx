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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Business, Owner, ValidationError } from "@/types";
import { businessAPI, ownerAPI } from "@/services/api";
import { ArrowLeft, Loader2, Building } from "lucide-react";

export default function BusinessForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Business>>({
    nombre: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      loadBusiness(id);
    } else {
      setIsLoadingData(false);
    }
  }, [isEditing, id]);

  const loadInitialData = async () => {
    try {
      const response = await ownerAPI.getOwners();
      if (response.success) {
        setOwners(response.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los propietarios",
        variant: "destructive",
      });
    }
  };

  const loadBusiness = async (businessId: string) => {
    try {
      const response = await businessAPI.getBusinesses();
      if (response.success) {
        const business = response.data?.find((b) => b.id === businessId);
        if (business) {
          setFormData({
            nombre: business.nombre,
            ownerId: business.ownerId,
          });
        } else {
          toast({
            title: "Error",
            description: "Comercio no encontrado",
            variant: "destructive",
          });
          navigate("/businesses");
        }
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "No se pudo cargar el comercio",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof Business, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.nombre?.trim()) {
      newErrors.push({
        field: "nombre",
        message: "El nombre del comercio es obligatorio",
      });
    } else if (formData.nombre.trim().length < 3) {
      newErrors.push({
        field: "nombre",
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!formData.ownerId) {
      newErrors.push({
        field: "ownerId",
        message: "Debe seleccionar un propietario",
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
        ? await businessAPI.updateBusiness(id!, formData)
        : await businessAPI.createBusiness(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Comercio actualizado" : "Comercio creado",
          description: `El comercio ha sido ${isEditing ? "actualizado" : "creado"} exitosamente`,
        });
        navigate("/businesses");
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
        <Button variant="ghost" onClick={() => navigate("/businesses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Comercio" : "Nuevo Comercio"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modifique la información del comercio"
              : "Complete la información para registrar un nuevo comercio"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información del Comercio
          </CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del comercio */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Comercio *</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ej: Supermercado La Canasta"
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

            {/* Propietario */}
            <div className="space-y-2">
              <Label htmlFor="owner">Propietario *</Label>
              <Select
                value={formData.ownerId || undefined}
                onValueChange={(value) => handleInputChange("ownerId", value)}
              >
                <SelectTrigger
                  className={getFieldError("ownerId") ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccione un propietario" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      <div>
                        <div className="font-medium">
                          {owner.nombreCompleto}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          NIT: {owner.nit}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("ownerId") && (
                <p className="text-sm text-red-500">
                  {getFieldError("ownerId")}
                </p>
              )}
              {owners.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay propietarios registrados.
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-1"
                    onClick={() => navigate("/owners/new")}
                  >
                    Crear propietario
                  </Button>
                </p>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar Comercio" : "Crear Comercio"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/businesses")}
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
