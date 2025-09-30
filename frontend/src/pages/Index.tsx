import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          Sistema de Transacciones
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Gestiona tus transacciones bancarias de forma segura
        </p>
        <Link to="/transaction/new">
          <Button size="lg">
            Nueva transacción
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;