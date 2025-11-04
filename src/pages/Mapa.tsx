import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Mapa = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  // Ocorrências com coordenadas reais de Cotia
  const ocorrencias = [
    {
      id: 1,
      type: "Calçada",
      status: "Em análise",
      description: "Buraco grande na calçada",
      location: "Rua das Flores, 123 - Centro",
      coordinates: { lng: -46.9188, lat: -23.6039 }, // Centro de Cotia
    },
    {
      id: 2,
      type: "Iluminação",
      status: "Concluída",
      description: "Poste de luz queimado",
      location: "Praça da Liberdade - Centro",
      coordinates: { lng: -46.9210, lat: -23.6050 },
    },
    {
      id: 3,
      type: "Lixo",
      status: "Recebida",
      description: "Acúmulo de lixo",
      location: "Av. Principal, 456",
      coordinates: { lng: -46.9170, lat: -23.6020 },
    },
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapReady) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-46.9188, -23.6039], // Centro de Cotia - SP
        zoom: 13,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setIsMapReady(true);

        // Adicionar marcadores para cada ocorrência
        ocorrencias.forEach((occurrence) => {
          const color = occurrence.status === "Concluída" ? "#22c55e" : "#ef4444";

          // Criar elemento customizado do marcador
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.style.width = "30px";
          el.style.height = "30px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = color;
          el.style.border = "3px solid white";
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
          el.style.cursor = "pointer";

          // Criar popup com informações
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${occurrence.type}</h3>
              <p style="margin-bottom: 4px;"><strong>Status:</strong> ${occurrence.status}</p>
              <p style="margin-bottom: 4px; font-size: 14px;">${occurrence.description}</p>
              <p style="font-size: 12px; color: #666;">${occurrence.location}</p>
            </div>
          `);

          // Adicionar marcador ao mapa
          new mapboxgl.Marker(el)
            .setLngLat([occurrence.coordinates.lng, occurrence.coordinates.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

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
        {!isMapReady && (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="mapbox-token" className="text-sm font-medium">
                  Token do Mapbox
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Para visualizar o mapa real de Cotia, insira seu token público do Mapbox.{" "}
                  <a 
                    href="https://account.mapbox.com/access-tokens/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Obter token
                  </a>
                </p>
                <div className="flex gap-2">
                  <Input
                    id="mapbox-token"
                    type="text"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      if (mapboxToken) {
                        window.location.reload();
                      }
                    }}
                    disabled={!mapboxToken}
                  >
                    Carregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Mapa Real do Mapbox */}
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-0">
            <div ref={mapContainer} className="w-full h-[400px] bg-muted" />
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
