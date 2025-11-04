import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const NovaOcorrencia = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto1, setFoto1] = useState<File | null>(null);
  const [foto2, setFoto2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string>("");
  const [preview2, setPreview2] = useState<string>("");

  const handleFoto1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto1(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview1(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFoto2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto2(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview2(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFoto1 = () => {
    setFoto1(null);
    setPreview1("");
  };

  const removeFoto2 = () => {
    setFoto2(null);
    setPreview2("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !telefone || !categoria || !endereco || !descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você pode implementar a lógica de envio
    toast({
      title: "Ocorrência registrada!",
      description: "Sua ocorrência foi registrada com sucesso.",
    });
    
    navigate("/");
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
          <h1 className="text-lg font-bold">Nova Ocorrência</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Problema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados de quem está registrando */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={categoria} onValueChange={setCategoria} required>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iluminacao">Iluminação</SelectItem>
                      <SelectItem value="ruas-avenidas">Ruas & Avenidas</SelectItem>
                      <SelectItem value="calcada">Calçada</SelectItem>
                      <SelectItem value="poda-arvore">Poda de Árvore</SelectItem>
                      <SelectItem value="carro-abandonado">Carro Abandonado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fotos */}
              <div className="space-y-4">
                <Label>Fotos do Problema</Label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Foto 1 */}
                  <div>
                    {preview1 ? (
                      <div className="relative">
                        <img
                          src={preview1}
                          alt="Preview 1"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeFoto1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Foto 1</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFoto1Change}
                        />
                      </label>
                    )}
                  </div>

                  {/* Foto 2 */}
                  <div>
                    {preview2 ? (
                      <div className="relative">
                        <img
                          src={preview2}
                          alt="Preview 2"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeFoto2}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Foto 2</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFoto2Change}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="endereco">Endereço do Problema *</Label>
                  <Input
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ponto-referencia">Ponto de Referência</Label>
                  <Input
                    id="ponto-referencia"
                    value={pontoReferencia}
                    onChange={(e) => setPontoReferencia(e.target.value)}
                    placeholder="Ex: Próximo ao mercado"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao">Descrição do Problema *</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva detalhadamente o problema encontrado"
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Registrar Ocorrência
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NovaOcorrencia;
