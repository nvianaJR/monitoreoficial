import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Mapa = () => {
  const navigate = useNavigate();

  const ocorrencias = [
    {
      id: 1,
      type: "Calçada",
      status: "Em análise",
      description: "Buraco grande na calçada",
      location: "Rua das Flores, 123 - Centro",
      coordinates: { x: 30, y: 40 }, // Posição no mapa visual (%)
    },
    {
      id: 2,
      type: "Iluminação",
      status: "Concluída",
      description: "Poste de luz queimado",
      location: "Praça da Liberdade - Centro",
      coordinates: { x: 60, y: 30 },
    },
    {
      id: 3,
      type: "Lixo",
      status: "Recebida",
      description: "Acúmulo de lixo",
      location: "Av. Principal, 456",
      coordinates: { x: 45, y: 65 },
    },
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-500";
      case "Recebida":
      case "Em análise":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
          <h1 className="text-lg font-bold">Mapa de Ocorrências</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Concluída</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mapa Visual */}
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-0">
            <div className="relative w-full h-[400px] bg-muted">
              {/* Grid do mapa para parecer mais real */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Marcadores das ocorrências */}
              {ocorrencias.map((occurrence) => (
                <div
                  key={occurrence.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                  style={{
                    left: `${occurrence.coordinates.x}%`,
                    top: `${occurrence.coordinates.y}%`,
                  }}
                >
                  {/* Pin do marcador */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full ${getMarkerColor(
                        occurrence.status
                      )} shadow-lg flex items-center justify-center animate-pulse`}
                    >
                      <MapPin className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                    <div className="w-0.5 h-4 bg-current opacity-50"></div>
                    
                    {/* Tooltip ao passar o mouse */}
                    <div className="absolute top-full mt-2 hidden group-hover:block z-10 w-48">
                      <Card className="shadow-xl">
                        <CardContent className="p-3 space-y-2">
                          <div className="font-semibold">{occurrence.type}</div>
                          <Badge className={getStatusColor(occurrence.status)} variant="outline">
                            {occurrence.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {occurrence.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {occurrence.location}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ocorrências */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Ocorrências</h2>
          
          {ocorrencias.map((occurrence) => (
            <Card key={occurrence.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${getMarkerColor(
                    occurrence.status
                  )} mt-1 flex-shrink-0`}
                ></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{occurrence.type}</h3>
                    <Badge className={getStatusColor(occurrence.status)}>
                      {occurrence.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {occurrence.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{occurrence.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Mapa;
