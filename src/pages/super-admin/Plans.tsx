import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanConfig {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_description: string | null;
  atendimento_inteligente: boolean;
  agendamento_automatico: boolean;
  lembretes_automaticos: boolean;
  confirmacao_email: boolean;
  base_conhecimento: boolean;
  relatorios_avancados: boolean;
  integracao_whatsapp: boolean;
  multi_usuarios: boolean;
  personalizacao_agente: boolean;
  analytics: boolean;
  max_agendamentos_mes: number | null;
  max_mensagens_whatsapp_mes: number | null;
  max_usuarios: number | null;
  max_pacientes: number | null;
  price_monthly: number | null;
  price_annual: number | null;
}

// Recursos principais que diferenciam os planos
const mainFeatures = [
  { key: 'atendimento_inteligente', label: 'Atendimento Inteligente', description: 'Chatbot com IA para atendimento' },
  { key: 'base_conhecimento', label: 'Base de Conhecimento', description: 'Personalização com informações do negócio' },
  { key: 'agendamento_automatico', label: 'Agendamento Automático', description: 'Sistema de agenda integrado' },
];

// Recursos secundários
const secondaryFeatures = [
  { key: 'lembretes_automaticos', label: 'Lembretes Automáticos' },
  { key: 'confirmacao_email', label: 'Confirmação por Email' },
  { key: 'relatorios_avancados', label: 'Relatórios Avançados' },
  { key: 'integracao_whatsapp', label: 'Integração WhatsApp' },
  { key: 'multi_usuarios', label: 'Múltiplos Usuários' },
  { key: 'personalizacao_agente', label: 'Personalização do Agente' },
  { key: 'analytics', label: 'Analytics' },
];

export default function Plans() {
  // Carregar planos
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plan_configs')
        .select('*')
        .order('plan_id', { ascending: true });
      
      if (error) throw error;
      return data as PlanConfig[];
    },
  });

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'plano_a': return 'border-blue-500/30 bg-blue-500/5';
      case 'plano_b': return 'border-indigo-500/30 bg-indigo-500/5';
      case 'plano_c': return 'border-cyan-500/30 bg-cyan-500/5';
      case 'plano_d': return 'border-teal-500/30 bg-teal-500/5';
      default: return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getCrownColor = (planId: string) => {
    switch (planId) {
      case 'plano_a': return 'text-blue-500';
      case 'plano_b': return 'text-indigo-500';
      case 'plano_c': return 'text-cyan-500';
      case 'plano_d': return 'text-teal-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-100">Planos de Assinatura</h1>
        <p className="text-blue-400 mt-1">
          Visualize os planos disponíveis e seus recursos
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.plan_id}
            className={cn(
              "border-2 transition-all",
              getPlanColor(plan.plan_id)
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Crown className={cn("h-6 w-6", getCrownColor(plan.plan_id))} />
                <div>
                  <CardTitle className="text-blue-100">{plan.plan_name}</CardTitle>
                  <CardDescription className="text-blue-400 mt-1">
                    {plan.plan_description}
                  </CardDescription>
                </div>
              </div>
              
              {/* Preço */}
              <div className="mt-4">
                {plan.price_monthly ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-100">
                      R$ {plan.price_monthly.toFixed(2)}
                    </span>
                    <span className="text-blue-400">/mês</span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-blue-300">
                    Sob consulta
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Recursos Principais */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                  Recursos Principais
                </h3>
                <div className="space-y-2">
                  {mainFeatures.map((feature) => {
                    const isEnabled = plan[feature.key as keyof PlanConfig] as boolean;
                    return (
                      <div 
                        key={feature.key} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          isEnabled ? "bg-green-500/10" : "bg-slate-800/30"
                        )}
                      >
                        {isEnabled ? (
                          <Check className="h-5 w-5 text-green-400 shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-red-400/50 shrink-0" />
                        )}
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isEnabled ? "text-blue-100" : "text-blue-400/50"
                          )}>
                            {feature.label}
                          </p>
                          <p className={cn(
                            "text-xs",
                            isEnabled ? "text-blue-300" : "text-blue-500/50"
                          )}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recursos Secundários */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                  Outros Recursos
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryFeatures.map((feature) => {
                    const isEnabled = plan[feature.key as keyof PlanConfig] as boolean;
                    return (
                      <div 
                        key={feature.key} 
                        className="flex items-center gap-2"
                      >
                        {isEnabled ? (
                          <Check className="h-4 w-4 text-green-400 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-red-400/50 shrink-0" />
                        )}
                        <span className={cn(
                          "text-xs",
                          isEnabled ? "text-blue-200" : "text-blue-500/50"
                        )}>
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Limites */}
              <div className="space-y-3 pt-3 border-t border-blue-800/30">
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                  Limites
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-slate-800/30">
                    <p className="text-2xl font-bold text-blue-100">
                      {plan.max_agendamentos_mes || '∞'}
                    </p>
                    <p className="text-xs text-blue-400">Agendamentos/mês</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-800/30">
                    <p className="text-2xl font-bold text-blue-100">
                      {plan.max_mensagens_whatsapp_mes || '∞'}
                    </p>
                    <p className="text-xs text-blue-400">Mensagens/mês</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-800/30">
                    <p className="text-2xl font-bold text-blue-100">
                      {plan.max_usuarios || '∞'}
                    </p>
                    <p className="text-xs text-blue-400">Usuários</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-800/30">
                    <p className="text-2xl font-bold text-blue-100">
                      {plan.max_pacientes || '∞'}
                    </p>
                    <p className="text-xs text-blue-400">Pacientes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Alert */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-200">
                Sobre os Planos
              </p>
              <p className="text-xs text-blue-300">
                Os recursos de cada plano são fixos. Para alterar o plano de uma organização, 
                acesse a página de edição da organização em "Organizações".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
