import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Upload, X, Workflow, Sparkles, Loader2, MessageSquare, Check, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface OrganizationFormData {
  name: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
  is_active: boolean;
}

export default function OrganizationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState<string>("");
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [isConfiguringWebhook, setIsConfiguringWebhook] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<OrganizationFormData>({
    defaultValues: {
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  // Upload de logo para Supabase Storage
  const uploadLogo = async (file: File, orgId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orgId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('organization-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('organization-logos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 2MB.');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas imagens são permitidas.');
        return;
      }

      setLogoFile(file);
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleConfigureWebhook = async () => {
    if (!whatsappInstance) {
      toast.error("Nenhuma instância WhatsApp encontrada");
      return;
    }

    try {
      setIsConfiguringWebhook(true);

      const payload = {
        instanceId: whatsappInstance.instance_id,
        token: whatsappInstance.token,
        instanceName: whatsappInstance.instance_name,
        adminField01: whatsappInstance.admin_field_01,
        phone: whatsappInstance.phone,
        organizationId: id,
        organizationName: organization?.name,
      };

      console.log("Configurando webhook, payload:", payload);

      const response = await fetch("https://webhook.n8nlabz.com.br/webhook/configurar-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao configurar webhook");
      }

      const result = await response.json();
      console.log("Resultado configurar webhook:", result);

      // Processar resposta (pode ser array ou objeto)
      const webhookData = Array.isArray(result) ? result[0] : result;

      if (webhookData && webhookData.url) {
        // Salvar URL do webhook no banco (apenas webhook_url existe atualmente)
        const { error: updateError } = await supabase
          .from("whatsapp_instances")
          .update({ 
            webhook_url: webhookData.url,
          })
          .eq("id", whatsappInstance.id);

        if (updateError) {
          console.error("Erro ao salvar webhook:", updateError);
          toast.error("Webhook configurado mas erro ao salvar no banco: " + updateError.message);
        } else {
          console.log("Webhook URL salva com sucesso!");
          toast.success("Webhook configurado com sucesso!");
          // Recarregar dados da instância
          window.location.reload();
        }
      } else {
        toast.success("Webhook configurado!");
      }
    } catch (error: any) {
      console.error("Erro ao configurar webhook:", error);
      toast.error(error.message || "Erro ao configurar webhook");
    } finally {
      setIsConfiguringWebhook(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!id) {
      toast.error("ID da organização não encontrado");
      return;
    }

    try {
      setIsCreatingWorkflow(true);

      // Buscar todos os dados da organização
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (orgError) throw orgError;

      // Buscar configuração do Agent IA
      const { data: agentData, error: agentError } = await supabase
        .from("agent_ia_config")
        .select("*")
        .eq("organization_id", id)
        .single();

      // Buscar instância WhatsApp
      const { data: whatsappData, error: whatsappError } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .eq("organization_id", id)
        .single();

      // Buscar configurações gerais
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("*")
        .eq("organization_id", id)
        .single();

      // Buscar perfis (usuários) da organização
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("organization_id", id);

      // Montar payload com TODAS as informações
      const payload = {
        organization: orgData,
        agent_ia_config: agentData || null,
        whatsapp_instance: whatsappData || null,
        settings: settingsData || null,
        profiles: profilesData || [],
        timestamp: new Date().toISOString(),
      };

      console.log("Enviando dados para criação de workflow:", payload);

      // Chamar webhook
      const response = await fetch("https://webhook.n8nlabz.com.br/webhook/criacao-fluxo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar workflow");
      }

      const result = await response.json();
      console.log("Resultado da criação de workflow:", result);

      toast.success("Workflow criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar workflow:", error);
      toast.error(error.message || "Erro ao criar workflow");
    } finally {
      setIsCreatingWorkflow(false);
    }
  };

  // Buscar organização (se editando)
  const { data: organization } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Buscar instância WhatsApp (se editando)
  const { data: whatsappInstance, isLoading: isLoadingWhatsapp } = useQuery({
    queryKey: ["whatsapp-instance", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .eq("organization_id", id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar instância WhatsApp:", error);
      }
      return data || null;
    },
    enabled: isEditing,
  });

  // Buscar configuração do Agent IA (se editando)
  useEffect(() => {
    const loadAgentConfig = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("agent_ia_config")
        .select("openai_api_key")
        .eq("organization_id", id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar config do agent:", error);
        return;
      }

      if (data) {
        setOpenaiApiKey(data.openai_api_key || "");
      }
    };

    if (isEditing) {
      loadAgentConfig();
    }
  }, [id, isEditing]);

  // Preencher form ao editar
  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name,
        is_active: organization.is_active,
        adminEmail: "",
        adminPassword: "",
        adminFullName: "",
      });
      setCurrentLogoUrl(organization.logo_url);
    }
  }, [organization, reset]);

  // Criar/Atualizar organização
  const saveMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Não autenticado");
      }

      let logoUrl = currentLogoUrl;

      // Upload do logo se houver arquivo novo
      if (logoFile && id) {
        try {
          setUploadingLogo(true);
          logoUrl = await uploadLogo(logoFile, id);
          toast.success('Logo enviado com sucesso!');
        } catch (error) {
          console.error('Erro ao fazer upload do logo:', error);
          toast.error('Erro ao enviar logo');
          throw error;
        } finally {
          setUploadingLogo(false);
        }
      }

      if (isEditing) {
        // Atualizar direto no banco (super admin pode)
        const { error } = await supabase
          .from('organizations')
          .update({
            name: data.name,
            is_active: data.is_active,
            logo_url: logoUrl,
          })
          .eq('id', id);

        if (error) throw error;

        // Atualizar/Criar API Key OpenAI no agent_ia_config
        if (openaiApiKey) {
          // Verificar se já existe config
          const { data: existingConfig } = await supabase
            .from('agent_ia_config')
            .select('id')
            .eq('organization_id', id)
            .single();

          if (existingConfig) {
            // Atualizar
            const { error: apiKeyError } = await supabase
              .from('agent_ia_config')
              .update({ openai_api_key: openaiApiKey })
              .eq('organization_id', id);

            if (apiKeyError) {
              console.error('Erro ao atualizar API Key:', apiKeyError);
              toast.error('Erro ao atualizar API Key OpenAI');
            }
          } else {
            // Criar nova config com API Key
            const { error: apiKeyError } = await supabase
              .from('agent_ia_config')
              .insert({
                organization_id: id,
                agent_name: 'Assistente Virtual',
                personality: 'profissional',
                pause_duration_seconds: 1800, // 30 minutos em segundos
                customer_pause_duration_seconds: 300, // 5 minutos em segundos
                greeting_message: 'Olá! Sou o assistente virtual. Como posso ajudá-lo?',
                closing_message: 'Foi um prazer atendê-lo!',
                openai_api_key: openaiApiKey,
              });

            if (apiKeyError) {
              console.error('Erro ao criar config com API Key:', apiKeyError);
              toast.error('Erro ao salvar API Key OpenAI');
            }
          }
        }
      } else {
        // Chamar Edge Function para criar
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-organization`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              organizationName: data.name,
              adminEmail: data.adminEmail,
              adminPassword: data.adminPassword,
              adminFullName: data.adminFullName,
              isActive: data.is_active,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Erro ao criar organização");
        }
      }
    },
    onSuccess: () => {
      toast.success(
        isEditing
          ? "Organização atualizada com sucesso!"
          : "Organização criada com sucesso!"
      );
      navigate("/super-admin/organizations");
    },
    onError: (error: any) => {
      console.error("Erro ao salvar organização:", error);
      toast.error(error.message || "Erro ao salvar organização");
    },
  });

  const onSubmit = (data: OrganizationFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/super-admin/organizations")}
          className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/30"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-purple-100">
            {isEditing ? "Editar Organização" : "Nova Organização"}
          </h1>
          <p className="text-purple-400 mt-1">
            {isEditing
              ? "Atualize as informações da organização"
              : "Crie uma nova clínica/consultório e seu administrador"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Info */}
        <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-purple-100">Informações da Organização</CardTitle>
            <CardDescription className="text-purple-400">
              Dados básicos da clínica/consultório
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">
                Nome da Organização *
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Nome é obrigatório" })}
                placeholder="Ex: Clínica São Paulo"
                className="mt-1.5 bg-slate-800/40 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-purple-200">
                  Organização Ativa
                </Label>
                <p className="text-xs text-purple-400">
                  Organizações inativas não podem acessar o sistema
                </p>
              </div>
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload (only when editing) */}
        {isEditing && (
          <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-100">Logo da Organização</CardTitle>
              <CardDescription className="text-purple-400">
                Faça upload do logo que aparecerá no sistema da organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview do logo atual ou novo */}
              {(logoPreview || currentLogoUrl) && (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={logoPreview || currentLogoUrl || ''}
                      alt="Logo"
                      className="h-20 w-20 object-contain rounded-lg border border-purple-600/30 bg-slate-800/40 p-2"
                    />
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-200">
                      {logoPreview ? 'Novo logo (não salvo)' : 'Logo atual'}
                    </p>
                    <p className="text-xs text-purple-400">
                      {logoPreview
                        ? 'Clique em "Atualizar" para salvar'
                        : 'Faça upload de uma nova imagem para substituir'}
                    </p>
                  </div>
                </div>
              )}

              {/* Input de upload */}
              <div>
                <Label htmlFor="logo" className="text-purple-200">
                  {currentLogoUrl ? 'Alterar Logo' : 'Adicionar Logo'}
                </Label>
                <div className="mt-2">
                  <label
                    htmlFor="logo"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-600/30 bg-slate-800/40 px-4 py-8 text-center transition-colors hover:border-purple-600/50 hover:bg-slate-800/60"
                  >
                    <Upload className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      Clique para fazer upload ou arraste uma imagem
                    </span>
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-purple-400 mt-2">
                  PNG, JPG ou SVG. Máximo 2MB. Recomendado: 200x200px
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OpenAI API Key (only when editing) */}
        {isEditing && (
          <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Configuração de IA
              </CardTitle>
              <CardDescription className="text-purple-400">
                Configure a API Key OpenAI para funcionalidades de IA desta organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai_api_key" className="text-purple-200">
                  API Key OpenAI
                </Label>
                <Input
                  id="openai_api_key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="mt-1.5 bg-slate-800/40 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50 font-mono"
                />
                <p className="text-xs text-purple-400 mt-2">
                  Esta chave será usada para funcionalidades como email de confirmação com IA, respostas automáticas, etc.
                </p>
                {openaiApiKey && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-green-400 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      API Key configurada (primeiros 8 caracteres: {openaiApiKey.substring(0, 8)}...)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Info (only when creating) */}
        {!isEditing && (
          <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-100">Administrador da Organização</CardTitle>
              <CardDescription className="text-purple-400">
                Criar usuário admin para gerenciar a clínica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminFullName" className="text-purple-200">
                  Nome Completo *
                </Label>
                <Input
                  id="adminFullName"
                  {...register("adminFullName", {
                    required: !isEditing && "Nome completo é obrigatório",
                  })}
                  placeholder="Ex: Dr. João Silva"
                  className="mt-1.5 bg-slate-800/40 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50"
                />
                {errors.adminFullName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.adminFullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="adminEmail" className="text-purple-200">
                  Email *
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  {...register("adminEmail", {
                    required: !isEditing && "Email é obrigatório",
                  })}
                  placeholder="admin@clinica.com"
                  className="mt-1.5 bg-slate-800/40 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50"
                />
                {errors.adminEmail && (
                  <p className="text-xs text-red-400 mt-1">{errors.adminEmail.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adminPassword" className="text-purple-200">
                  Senha *
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  {...register("adminPassword", {
                    required: !isEditing && "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Senha deve ter no mínimo 6 caracteres",
                    },
                  })}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1.5 bg-slate-800/40 border-purple-800/30 text-purple-100 placeholder:text-purple-400/50"
                />
                {errors.adminPassword && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.adminPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workflow Section (only when editing) */}
        {isEditing && (
          <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-100">Automações e Workflows</CardTitle>
              <CardDescription className="text-purple-400">
                Configure fluxos de trabalho automatizados para esta organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                onClick={handleCreateWorkflow}
                disabled={isCreatingWorkflow}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {isCreatingWorkflow ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando Workflow...
                  </>
                ) : (
                  <>
                    <Workflow className="mr-2 h-4 w-4" />
                    Criar Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* WhatsApp Instance Info (only when editing) */}
        {isEditing && (
          <Card className="border-purple-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                Instância WhatsApp
              </CardTitle>
              <CardDescription className="text-purple-400">
                Informações de conexão do WhatsApp desta organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWhatsapp ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  <span className="ml-2 text-purple-300">Carregando...</span>
                </div>
              ) : whatsappInstance ? (
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-300">Status:</span>
                    {whatsappInstance.status === 'connected' ? (
                      <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                        <Check className="h-4 w-4" />
                        Conectado
                      </span>
                    ) : whatsappInstance.status === 'pending' ? (
                      <span className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        Aguardando
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium">
                        <XCircle className="h-4 w-4" />
                        {whatsappInstance.status}
                      </span>
                    )}
                  </div>

                  {/* Instance Details */}
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Nome da Instância:</span>
                      <span className="text-sm font-mono text-purple-100">{whatsappInstance.instance_name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Empresa:</span>
                      <span className="text-sm text-purple-100">{whatsappInstance.admin_field_01}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Telefone:</span>
                      <span className="text-sm font-mono text-purple-100">{whatsappInstance.phone}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Instance ID:</span>
                      <span className="text-xs font-mono text-purple-300">{whatsappInstance.instance_id}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Token:</span>
                      <span className="text-xs font-mono text-purple-300 break-all">
                        {whatsappInstance.token}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                      <span className="text-sm text-purple-400">Criado em:</span>
                      <span className="text-sm text-purple-100">
                        {new Date(whatsappInstance.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-400">Atualizado em:</span>
                      <span className="text-sm text-purple-100">
                        {new Date(whatsappInstance.updated_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Webhook Info */}
                  {whatsappInstance.webhook_url && (
                    <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                        <Workflow className="h-4 w-4" />
                        Webhook Configurado
                      </h4>
                      <div className="space-y-2">
                        <span className="text-xs text-purple-400 block">URL do Webhook:</span>
                        <div className="bg-slate-900/60 rounded p-2 border border-purple-800/30">
                          <p className="text-xs font-mono text-purple-100 break-all">
                            {whatsappInstance.webhook_url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <Check className="h-3 w-3" />
                          <span>Webhook ativo e recebendo eventos</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão Configurar Webhook */}
                  <div className="pt-4 border-t border-purple-800/30">
                    <Button
                      type="button"
                      onClick={handleConfigureWebhook}
                      disabled={isConfiguringWebhook}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isConfiguringWebhook ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Configurando Webhook...
                        </>
                      ) : (
                        <>
                          <Workflow className="mr-2 h-4 w-4" />
                          {whatsappInstance.webhook_url ? 'Reconfigurar Webhook' : 'Configurar Webhook'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <p className="text-purple-300 text-sm">
                    Nenhuma instância WhatsApp conectada
                  </p>
                  <p className="text-purple-500 text-xs mt-1">
                    O cliente ainda não conectou o WhatsApp
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/super-admin/organizations")}
            className="border-purple-600/30 text-purple-300 hover:bg-purple-800/30 hover:text-purple-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saveMutation.isPending || uploadingLogo}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {uploadingLogo
              ? "Enviando logo..."
              : saveMutation.isPending
              ? "Salvando..."
              : isEditing
              ? "Atualizar"
              : "Criar Organização"}
          </Button>
        </div>
      </form>
    </div>
  );
}

