import { useState, useEffect } from "react";
import { Bot, Sparkles, Save, Loader2, Edit, X, Clock, MessageSquare, Smile, Plus, Trash2, Mail, Bell, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AgentConfig {
  id?: string;
  agent_name: string;
  personality: string;
  pause_duration: number;
  greeting_message: string;
  closing_message: string;
  reminder_1_minutes: number;
  reminder_2_minutes: number;
  reminder_3_minutes: number;
  qualification_questions: string[];
  confirmation_email_body: string;
}

const personalityLabels: Record<string, string> = {
  profissional: "Profissional",
  amigavel: "Amigável",
  formal: "Formal",
  descontraido: "Descontraído",
};

export default function AgentIA() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<AgentConfig>({
    agent_name: "Assistente Virtual",
    personality: "profissional",
    pause_duration: 30,
    greeting_message: "Olá! Sou o assistente virtual da clínica. Como posso ajudá-lo hoje?",
    closing_message: "Foi um prazer atendê-lo! Se precisar de algo mais, estou à disposição.",
    reminder_1_minutes: 15,
    reminder_2_minutes: 60,
    reminder_3_minutes: 1440,
    qualification_questions: [],
    confirmation_email_body: "<p>Olá, seu agendamento foi confirmado!</p>",
  });
  const [editConfig, setEditConfig] = useState<AgentConfig>(config);

  useEffect(() => {
    loadConfig();
  }, [profile?.organization_id]);

  const loadConfig = async () => {
    if (!profile?.organization_id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("agent_ia_config")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setConfig(data);
        setEditConfig(data);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditConfig(config);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile?.organization_id) {
      toast.error("Erro: organização não identificada");
      return;
    }

    try {
      setIsSaving(true);

      const configData = {
        organization_id: profile.organization_id,
        agent_name: editConfig.agent_name,
        personality: editConfig.personality,
        pause_duration: editConfig.pause_duration,
        greeting_message: editConfig.greeting_message,
        closing_message: editConfig.closing_message,
        reminder_1_minutes: editConfig.reminder_1_minutes,
        reminder_2_minutes: editConfig.reminder_2_minutes,
        reminder_3_minutes: editConfig.reminder_3_minutes,
        qualification_questions: editConfig.qualification_questions,
        confirmation_email_body: editConfig.confirmation_email_body,
      } as any;

      if (config.id) {
        const { error } = await supabase
          .from("agent_ia_config")
          // @ts-ignore
          .update(configData)
          .eq("id", config.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("agent_ia_config")
          // @ts-ignore
          .insert(configData)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setConfig(data);
          setEditConfig(data);
          setIsEditing(false);
          toast.success("Configurações salvas com sucesso!");
          return;
        }
      }

      setConfig(editConfig);
      setIsEditing(false);
      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Agent IA
              </h1>
            </div>
          </div>
          <Badge className="bg-accent/10 text-accent border-accent/20">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
        <p className="text-base md:text-lg text-muted-foreground">
          {isEditing ? "Editando configurações do assistente virtual" : "Configurações do seu assistente virtual"}
        </p>
      </div>

      {/* Configurações - Modo Visualização */}
      {!isEditing ? (
        <>
          <Card className="card-luxury p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Configurações do Atendimento
              </h2>
              <Button onClick={handleEdit} variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome do Agent */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">Nome do Agent</span>
                </div>
                <p className="text-lg font-semibold text-foreground pl-6">
                  {config.agent_name}
                </p>
              </div>

              {/* Personalidade */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Smile className="h-4 w-4" />
                  <span className="font-medium">Personalidade</span>
                </div>
                <p className="text-lg font-semibold text-foreground pl-6">
                  {personalityLabels[config.personality] || config.personality}
                </p>
              </div>

              {/* Tempo de Pausa */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Tempo de Pausa</span>
                </div>
                <p className="text-lg font-semibold text-foreground pl-6">
                  {config.pause_duration} minutos
                </p>
                <p className="text-xs text-muted-foreground pl-6">
                  Pausa quando atendente humano assume
                </p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="mt-8 space-y-6">
              {/* Mensagem de Saudação */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Mensagem de Saudação</span>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {config.greeting_message}
                  </p>
                </div>
              </div>

              {/* Mensagem de Finalização */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Mensagem de Finalização</span>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {config.closing_message}
                  </p>
                </div>
              </div>
            </div>

            {/* Lembretes */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-accent" />
                Lembretes de Agendamento
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">1º Lembrete</span>
                  <p className="text-lg font-semibold text-foreground">{config.reminder_1_minutes} minutos antes</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">2º Lembrete</span>
                  <p className="text-lg font-semibold text-foreground">{config.reminder_2_minutes} minutos antes</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">3º Lembrete</span>
                  <p className="text-lg font-semibold text-foreground">{config.reminder_3_minutes} minutos antes</p>
                </div>
              </div>
            </div>

            {/* Perguntas de Qualificação */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileQuestion className="h-5 w-5 text-accent" />
                Perguntas de Qualificação
              </h3>
              {config.qualification_questions && config.qualification_questions.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {config.qualification_questions.map((q, i) => (
                    <li key={i} className="text-foreground">{q}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">Nenhuma pergunta configurada.</p>
              )}
            </div>

            {/* Email de Confirmação */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-accent" />
                Email de Confirmação
              </h3>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono overflow-x-auto">
                  {config.confirmation_email_body}
                </pre>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Configurações - Modo Edição */
        <Card className="card-luxury p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              Editando Configurações
            </h2>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Nome do Agent */}
            <div className="space-y-2">
              <Label htmlFor="agent_name">Nome do Agent *</Label>
              <Input
                id="agent_name"
                placeholder="Ex: Sofia, Assistente Virtual, Dr. Bot"
                value={editConfig.agent_name}
                onChange={(e) => setEditConfig({ ...editConfig, agent_name: e.target.value })}
              />
            </div>

            {/* Personalidade */}
            <div className="space-y-2">
              <Label htmlFor="personality">Personalidade *</Label>
              <Select
                value={editConfig.personality}
                onValueChange={(value) => setEditConfig({ ...editConfig, personality: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="descontraido">Descontraído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tempo de Pausa */}
            <div className="space-y-2">
              <Label htmlFor="pause_duration">Tempo de Pausa (minutos) *</Label>
              <Input
                id="pause_duration"
                type="number"
                min="1"
                max="1440"
                value={editConfig.pause_duration}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, pause_duration: parseInt(e.target.value) || 30 })
                }
              />
              <p className="text-xs text-muted-foreground">
                Quanto tempo o agent deve pausar quando um atendente humano assumir
              </p>
            </div>

            {/* Mensagem de Saudação */}
            <div className="space-y-2">
              <Label htmlFor="greeting_message">Mensagem de Saudação *</Label>
              <Textarea
                id="greeting_message"
                rows={4}
                value={editConfig.greeting_message}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, greeting_message: e.target.value })
                }
              />
            </div>

            {/* Mensagem de Finalização */}
            <div className="space-y-2">
              <Label htmlFor="closing_message">Mensagem de Finalização *</Label>
              <Textarea
                id="closing_message"
                rows={4}
                value={editConfig.closing_message}
                onChange={(e) =>
                  setEditConfig({ ...editConfig, closing_message: e.target.value })
                }
              />
            </div>
          </div>

          {/* Lembretes */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Lembretes de Agendamento (minutos antes)
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="reminder_1">1º Lembrete</Label>
                <Input
                  id="reminder_1"
                  type="number"
                  min="1"
                  value={editConfig.reminder_1_minutes}
                  onChange={(e) => setEditConfig({ ...editConfig, reminder_1_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder_2">2º Lembrete</Label>
                <Input
                  id="reminder_2"
                  type="number"
                  min="1"
                  value={editConfig.reminder_2_minutes}
                  onChange={(e) => setEditConfig({ ...editConfig, reminder_2_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder_3">3º Lembrete</Label>
                <Input
                  id="reminder_3"
                  type="number"
                  min="1"
                  value={editConfig.reminder_3_minutes}
                  onChange={(e) => setEditConfig({ ...editConfig, reminder_3_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Perguntas de Qualificação */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-accent" />
                Perguntas de Qualificação
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditConfig({
                  ...editConfig,
                  qualification_questions: [...(editConfig.qualification_questions || []), ""]
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>
            <div className="space-y-3">
              {editConfig.qualification_questions?.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => {
                      const newQuestions = [...(editConfig.qualification_questions || [])];
                      newQuestions[index] = e.target.value;
                      setEditConfig({ ...editConfig, qualification_questions: newQuestions });
                    }}
                    placeholder="Digite a pergunta..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newQuestions = [...(editConfig.qualification_questions || [])];
                      newQuestions.splice(index, 1);
                      setEditConfig({ ...editConfig, qualification_questions: newQuestions });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!editConfig.qualification_questions || editConfig.qualification_questions.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Nenhuma pergunta adicionada.</p>
              )}
            </div>
          </div>

          {/* Email de Confirmação */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent" />
              Email de Confirmação (HTML)
            </h3>
            <Textarea
              rows={10}
              value={editConfig.confirmation_email_body}
              onChange={(e) => setEditConfig({ ...editConfig, confirmation_email_body: e.target.value })}
              className="font-mono text-sm"
              placeholder="<html>...</html>"
            />
          </div>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 animate-fade-in-up">
        <div className="card-luxury p-4">
          <p className="text-sm text-muted-foreground mb-2">Conversas Hoje</p>
          <p className="text-2xl font-bold text-foreground">0</p>
        </div>
        <div className="card-luxury p-4">
          <p className="text-sm text-muted-foreground mb-2">Taxa de Resposta</p>
          <p className="text-2xl font-bold text-success">0%</p>
        </div>
        <div className="card-luxury p-4">
          <p className="text-sm text-muted-foreground mb-2">Leads Qualificados</p>
          <p className="text-2xl font-bold text-accent">0</p>
        </div>
        <div className="card-luxury p-4">
          <p className="text-sm text-muted-foreground mb-2">Tempo Médio</p>
          <p className="text-2xl font-bold text-foreground">0min</p>
        </div>
      </div>
    </div>
  );
}
