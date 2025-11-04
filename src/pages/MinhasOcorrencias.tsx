import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MinhasOcorrencias = () => {
  const navigate = useNavigate();

  const minhasOcorrencias: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebida":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Em análise":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Concluída":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "destructive";
      case "Média":
        return "default";
      case "Baixa":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Minhas Ocorrências</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-muted-foreground">Em andamento</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">1</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Suas Ocorrências</h2>
          
          {minhasOcorrencias.map((occurrence) => (
            <Card key={occurrence.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{occurrence.type}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getStatusColor(occurrence.status)}>
                        {occurrence.status}
                      </Badge>
                      <Badge variant={getPriorityColor(occurrence.priority)}>
                        Prioridade: {occurrence.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {occurrence.description}
                </p>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{occurrence.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Registrada em {occurrence.date}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {minhasOcorrencias.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Você ainda não registrou nenhuma ocorrência.
            </p>
            <Button
              onClick={() => navigate("/nova-ocorrencia")}
              className="mt-4"
            >
              Registrar primeira ocorrência
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MinhasOcorrencias;
