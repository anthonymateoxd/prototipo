import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function AuditList() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <Construction className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <CardTitle>Página en Construcción</CardTitle>
          <CardDescription>
            El módulo de auditoría está en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Esta página mostrará el historial de acciones realizadas en el
            sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
