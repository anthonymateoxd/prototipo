import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Home, MessageSquare, FileText } from "lucide-react";

export default function ComplaintConfirmation() {
  const location = useLocation();
  const complaintId = location.state?.complaintId;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            ¡Queja Registrada Exitosamente!
          </CardTitle>
          <CardDescription>
            Su queja ha sido registrada en nuestro sistema y será procesada por
            nuestro equipo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confirmation Details */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Número de Referencia:</span>
                <span className="font-mono text-sm bg-background px-2 py-1 rounded">
                  {complaintId || "QJ-" + Date.now().toString().slice(-8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Fecha de Registro:</span>
                <span>
                  {new Date().toLocaleDateString("es-GT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendiente de Revisión
                </span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Información Importante:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  • Su queja será revisada en un plazo máximo de 5 días hábiles
                </li>
                <li>• No es necesario proporcionar información de contacto</li>
                <li>• El comercio será notificado sobre la queja recibida</li>
                <li>
                  • Puede consultar el estado usando el número de referencia
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Process Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">¿Qué sucede ahora?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Revisión Inicial</p>
                  <p className="text-sm text-muted-foreground">
                    Nuestro equipo revisará la queja para verificar la
                    información proporcionada.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Notificación al Comercio</p>
                  <p className="text-sm text-muted-foreground">
                    El comercio será notificado sobre la queja para que pueda
                    tomar las medidas correspondientes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Seguimiento</p>
                  <p className="text-sm text-muted-foreground">
                    Se realizará seguimiento al caso hasta su resolución o
                    cierre.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Información de Contacto
            </h4>
            <p className="text-sm text-blue-800">
              Si tiene preguntas adicionales o necesita reportar información
              urgente relacionada con su queja, puede contactarnos al teléfono{" "}
              <strong>1234-5678</strong> o enviar un correo a{" "}
              <strong>quejas@sistema.gob.gt</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
            <Link to="/complaint" className="flex-1">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Registrar Otra Queja
              </Button>
            </Link>
          </div>

          {/* Print/Save Options */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              ¿Desea guardar esta confirmación?
            </p>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              Imprimir Confirmación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
