import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function UserForm() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <Construction className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <CardTitle>Página en Construcción</CardTitle>
          <CardDescription>
            El formulario de usuarios está en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => navigate("/users")}>Volver a Usuarios</Button>
        </CardContent>
      </Card>
    </div>
  );
}
