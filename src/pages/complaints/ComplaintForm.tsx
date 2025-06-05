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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Region,
  Department,
  Municipality,
  Business,
  ComplaintCategory,
  ComplaintFormDTO,
  ValidationError,
} from "@/types";
import { geographyAPI, businessAPI, complaintAPI } from "@/services/api";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState<ComplaintFormDTO>({
    regionId: "",
    municipalityId: "",
    businessId: "",
    categoryId: "",
    descripcion: "",
  });

  // Options data
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load departments when region changes
  useEffect(() => {
    if (formData.regionId) {
      loadDepartments(formData.regionId);
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        municipalityId: "",
        businessId: "",
      }));
      setMunicipalities([]);
    }
  }, [formData.regionId]);

  // Load municipalities when department changes
  useEffect(() => {
    if (departments.length > 0 && formData.regionId) {
      const regionDepartments = departments.filter(
        (d) => d.regionId === formData.regionId,
      );
      if (regionDepartments.length > 0) {
        loadMunicipalities(regionDepartments[0].id);
      }
    }
  }, [departments, formData.regionId]);

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

  const handleInputChange = (field: keyof ComplaintFormDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.regionId) {
      newErrors.push({
        field: "regionId",
        message: "La región es obligatoria",
      });
    }

    if (!formData.municipalityId) {
      newErrors.push({
        field: "municipalityId",
        message: "El municipio es obligatorio",
      });
    }

    if (!formData.businessId) {
      newErrors.push({
        field: "businessId",
        message: "El comercio es obligatorio",
      });
    }

    if (!formData.categoryId) {
      newErrors.push({
        field: "categoryId",
        message: "La categoría es obligatoria",
      });
    }

    if (!formData.descripcion.trim()) {
      newErrors.push({
        field: "descripcion",
        message: "La descripción es obligatoria",
      });
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.push({
        field: "descripcion",
        message: "La descripción debe tener al menos 10 caracteres",
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
      const response = await complaintAPI.submitComplaint(formData);

      if (response.success) {
        toast({
          title: "Queja registrada",
          description: "Su queja ha sido registrada exitosamente",
        });

        // Navigate to confirmation page with complaint ID
        navigate("/complaint/confirmation", {
          state: { complaintId: response.data?.id },
          replace: true,
        });
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        toast({
          title: "Error al registrar queja",
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registro de Queja</CardTitle>
          <CardDescription>
            Complete el siguiente formulario para registrar su queja. Todos los
            campos son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Región */}
            <div className="space-y-2">
              <Label htmlFor="region">Región</Label>
              <Select
                value={formData.regionId || undefined}
                onValueChange={(value) => handleInputChange("regionId", value)}
              >
                <SelectTrigger
                  className={getFieldError("regionId") ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccione una región" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("regionId") && (
                <p className="text-sm text-red-500">
                  {getFieldError("regionId")}
                </p>
              )}
            </div>

            {/* Municipio */}
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio</Label>
              <Select
                value={formData.municipalityId || undefined}
                onValueChange={(value) =>
                  handleInputChange("municipalityId", value)
                }
                disabled={!formData.regionId || municipalities.length === 0}
              >
                <SelectTrigger
                  className={
                    getFieldError("municipalityId") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccione un municipio" />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality.id} value={municipality.id}>
                      {municipality.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("municipalityId") && (
                <p className="text-sm text-red-500">
                  {getFieldError("municipalityId")}
                </p>
              )}
            </div>

            {/* Comercio */}
            <div className="space-y-2">
              <Label htmlFor="business">Comercio</Label>
              <Select
                value={formData.businessId || undefined}
                onValueChange={(value) =>
                  handleInputChange("businessId", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("businessId") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccione un comercio" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("businessId") && (
                <p className="text-sm text-red-500">
                  {getFieldError("businessId")}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría de la Queja</Label>
              <Select
                value={formData.categoryId || undefined}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError("categoryId") ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("categoryId") && (
                <p className="text-sm text-red-500">
                  {getFieldError("categoryId")}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción de la Queja</Label>
              <Textarea
                id="description"
                placeholder="Describa detalladamente su queja..."
                value={formData.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                className={getFieldError("descripcion") ? "border-red-500" : ""}
                rows={5}
              />
              {getFieldError("descripcion") && (
                <p className="text-sm text-red-500">
                  {getFieldError("descripcion")}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Mínimo 10 caracteres. Caracteres actuales:{" "}
                {formData.descripcion.length}
              </p>
            </div>

            {/* General errors */}
            {errors.some((error) => error.field === "general") && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.find((error) => error.field === "general")?.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Privacy notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Aviso de Privacidad:</strong> Esta queja se registra de
                forma anónima. No se almacenará información personal que pueda
                identificarlo.
              </AlertDescription>
            </Alert>

            {/* Submit button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Queja
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
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
