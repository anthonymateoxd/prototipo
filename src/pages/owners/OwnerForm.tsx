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
import { Owner, ValidationError } from "@/types";
import { ownerAPI } from "@/services/api";
import { ArrowLeft, Loader2, Users } from "lucide-react";

export default function OwnerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Owner>>({
    nombreCompleto: "",
    nit: "",
    telefono: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoadingData(true);
      loadOwner(id);
    }
  }, [isEditing, id]);

  const loadOwner = async (ownerId: string) => {
    try {
      const response = await ownerAPI.getOwners();
      if (response.success) {
        const owner = response.data?.find((o) => o.id === ownerId);
        if (owner) {
          setFormData({
            nombreCompleto: owner.nombreCompleto,
            nit: owner.nit,
            telefono: owner.telefono,
            email: owner.email,
          });
        } else {
          toast({
            title: "Error",
            description: "Propietario no encontrado",
            variant: "destructive",
          });
          navigate("/owners");
        }
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "No se pudo cargar el propietario",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof Owner, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.nombreCompleto?.trim()) {
      newErrors.push({
        field: "nombreCompleto",
        message: "El nombre completo es obligatorio",
      });
    } else if (formData.nombreCompleto.trim().length < 3) {
      newErrors.push({
        field: "nombreCompleto",
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!formData.nit?.trim()) {
      newErrors.push({ field: "nit", message: "El NIT es obligatorio" });
    } else if (!/^\d{8}-\d$/.test(formData.nit.trim())) {
      newErrors.push({
        field: "nit",
        message: "El NIT debe tener el formato 12345678-9",
      });
    }

    if (!formData.telefono?.trim()) {
      newErrors.push({
        field: "telefono",
        message: "El teléfono es obligatorio",
      });
    } else if (!/^\d{4}-\d{4}$/.test(formData.telefono.trim())) {
      newErrors.push({
        field: "telefono",
        message: "El teléfono debe tener el formato 1234-5678",
      });
    }

    if (!formData.email?.trim()) {
      newErrors.push({ field: "email", message: "El email es obligatorio" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.push({
        field: "email",
        message: "El email no tiene un formato válido",
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
        ? await ownerAPI.updateOwner(id!, formData)
        : await ownerAPI.createOwner(formData);

      if (response.success) {
        toast({
          title: isEditing ? "Propietario actualizado" : "Propietario creado",
          description: `El propietario ha sido ${isEditing ? "actualizado" : "creado"} exitosamente`,
        });
        navigate("/owners");
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
        <Button variant="ghost" onClick={() => navigate("/owners")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Propietario" : "Nuevo Propietario"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modifique la información del propietario"
              : "Complete la información para registrar un nuevo propietario"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Información del Propietario
          </CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
              <Input
                id="nombreCompleto"
                type="text"
                placeholder="Ej: Juan Carlos Pérez López"
                value={formData.nombreCompleto || ""}
                onChange={(e) =>
                  handleInputChange("nombreCompleto", e.target.value)
                }
                className={
                  getFieldError("nombreCompleto") ? "border-red-500" : ""
                }
              />
              {getFieldError("nombreCompleto") && (
                <p className="text-sm text-red-500">
                  {getFieldError("nombreCompleto")}
                </p>
              )}
            </div>

            {/* NIT */}
            <div className="space-y-2">
              <Label htmlFor="nit">NIT *</Label>
              <Input
                id="nit"
                type="text"
                placeholder="12345678-9"
                value={formData.nit || ""}
                onChange={(e) => handleInputChange("nit", e.target.value)}
                className={getFieldError("nit") ? "border-red-500" : ""}
              />
              {getFieldError("nit") && (
                <p className="text-sm text-red-500">{getFieldError("nit")}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Formato: 12345678-9
              </p>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                type="text"
                placeholder="2234-5678"
                value={formData.telefono || ""}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                className={getFieldError("telefono") ? "border-red-500" : ""}
              />
              {getFieldError("telefono") && (
                <p className="text-sm text-red-500">
                  {getFieldError("telefono")}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Formato: 1234-5678
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.perez@email.com"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={getFieldError("email") ? "border-red-500" : ""}
              />
              {getFieldError("email") && (
                <p className="text-sm text-red-500">{getFieldError("email")}</p>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar Propietario" : "Crear Propietario"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/owners")}
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
