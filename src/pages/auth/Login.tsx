import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, AlertCircle, Home } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema",
        });
        navigate("/");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error del sistema. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Quejas
          </h1>
          <p className="mt-2 text-gray-600">Gestión Comercial</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Credenciales de Prueba:
              </h3>
              <div className="text-xs text-blue-800 space-y-1">
                <div>
                  <strong>Administrador:</strong> admin / password123
                </div>
                <div>
                  <strong>Analista:</strong> ana.lopez / password123
                </div>
                <div>
                  <strong>Supervisor:</strong> carlos.mendoza / password123
                </div>
              </div>
            </div>

            {/* Back to home */}
            <div className="mt-4 text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>¿No tiene cuenta? Contacte al administrador del sistema</p>
        </div>
      </div>
    </div>
  );
}
