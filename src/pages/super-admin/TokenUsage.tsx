import { useEffect, useState } from "react";
import { Zap, TrendingUp, Building2, Loader2, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface OrganizationTokens {
  organization_id: string;
  organization_name: string;
  organization_logo: string | null;
  total_tokens: number;
  total_cost: number;
}

export default function TokenUsage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orgTokens, setOrgTokens] = useState<OrganizationTokens[]>([]);
  const [grandTotalTokens, setGrandTotalTokens] = useState<number>(0);
  const [grandTotalCost, setGrandTotalCost] = useState<number>(0);

  useEffect(() => {
    loadTokenUsage();
  }, []);

  const loadTokenUsage = async () => {
    try {
      setIsLoading(true);

      // Buscar todos os registros de token_usage com informações da organização
      const { data: tokenData, error: tokenError } = await supabase
        .from("token_usage")
        .select(`
          organization_id,
          total_tokens,
          cost_reais
        `);

      if (tokenError) throw tokenError;

      // Buscar informações das organizações
      const { data: orgsData, error: orgsError } = await supabase
        .from("organizations")
        .select("id, name, logo_url");

      if (orgsError) throw orgsError;

      // Agrupar por organização
      const grouped: Record<string, { total_tokens: number; total_cost: number }> = {};
      
      tokenData?.forEach((record) => {
        if (!grouped[record.organization_id]) {
          grouped[record.organization_id] = { total_tokens: 0, total_cost: 0 };
        }
        grouped[record.organization_id].total_tokens += record.total_tokens || 0;
        grouped[record.organization_id].total_cost += record.cost_reais || 0;
      });

      // Combinar com dados das organizações
      const result: OrganizationTokens[] = Object.entries(grouped).map(([orgId, data]) => {
        const org = orgsData?.find((o) => o.id === orgId);
        return {
          organization_id: orgId,
          organization_name: org?.name || "Organização Desconhecida",
          organization_logo: org?.logo_url || null,
          total_tokens: data.total_tokens,
          total_cost: data.total_cost,
        };
      });

      // Ordenar por custo (maior para menor)
      result.sort((a, b) => b.total_cost - a.total_cost);

      setOrgTokens(result);

      // Calcular totais gerais
      const totalTks = result.reduce((sum, org) => sum + org.total_tokens, 0);
      const totalCst = result.reduce((sum, org) => sum + org.total_cost, 0);
      setGrandTotalTokens(totalTks);
      setGrandTotalCost(totalCst);
    } catch (error) {
      console.error("Erro ao carregar gastos de token:", error);
      toast.error("Erro ao carregar gastos de token");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Carregando gastos...</p>
        </div>
      </div>
    );
  }

  // Calcular média de custo por organização
  const avgCostPerOrg = orgTokens.length > 0 ? grandTotalCost / orgTokens.length : 0;
  const avgTokensPerOrg = orgTokens.length > 0 ? grandTotalTokens / orgTokens.length : 0;

  // KPIs principais
  const kpis = [
    {
      title: "Total de Tokens",
      value: grandTotalTokens.toLocaleString('pt-BR'),
      description: `${orgTokens.length} organizações`,
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Custo Total",
      value: grandTotalCost.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      description: "Todos os gastos",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Média por Organização",
      value: avgCostPerOrg.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      description: "Custo médio",
      icon: TrendingUp,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Organizações Ativas",
      value: orgTokens.length,
      description: "Com consumo registrado",
      icon: Activity,
      color: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-100">Gastos de Token</h1>
        <p className="text-blue-400 mt-1">
          Consumo de tokens e custos por organização
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="border-blue-800/30 bg-slate-900/40 backdrop-blur-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">
                  {kpi.title}
                </CardTitle>
                <div
                  className={`rounded-lg bg-gradient-to-br ${kpi.color} p-2`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-50">
                  {kpi.value}
                </div>
                <p className="text-xs text-blue-400 mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo Detalhado */}
      <Card className="border-blue-800/30 bg-slate-900/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-100">Resumo Detalhado</CardTitle>
          <CardDescription className="text-blue-400">
            Estatísticas gerais de consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-4 border border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <p className="text-sm text-blue-400">Total de Tokens</p>
              </div>
              <p className="text-2xl font-bold text-blue-100">
                {grandTotalTokens.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Média: {Math.round(avgTokensPerOrg).toLocaleString('pt-BR')} por org
              </p>
            </div>
            
            <div className="bg-slate-800/40 rounded-lg p-4 border border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <p className="text-sm text-blue-400">Custo Total</p>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {grandTotalCost.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Média: {avgCostPerOrg.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} por org
              </p>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-4 border border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <p className="text-sm text-blue-400">Organizações</p>
              </div>
              <p className="text-2xl font-bold text-blue-100">
                {orgTokens.length}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Com consumo registrado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards por Organização */}
      <div>
        <h2 className="text-xl font-semibold text-blue-100 mb-4">
          Consumo por Organização
        </h2>
        
        {orgTokens.length === 0 ? (
          <Card className="border-blue-800/30 bg-slate-900/40 backdrop-blur-xl">
            <CardContent className="py-12 text-center">
              <Zap className="h-16 w-16 mx-auto mb-4 text-blue-500/50" />
              <p className="text-lg text-blue-400">
                Nenhum consumo de token registrado ainda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orgTokens.map((org, index) => {
              const percentage = grandTotalCost > 0 ? (org.total_cost / grandTotalCost) * 100 : 0;
              return (
                <Card
                  key={org.organization_id}
                  className="border-blue-800/30 bg-slate-900/40 backdrop-blur-xl hover:border-blue-600/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {org.organization_logo ? (
                          <img
                            src={org.organization_logo}
                            alt={org.organization_name}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-blue-100 truncate">
                            {org.organization_name}
                          </CardTitle>
                          <CardDescription className="text-blue-400 text-xs">
                            {percentage.toFixed(1)}% do total
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Barra de progresso visual */}
                      <div className="w-full bg-slate-800/40 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/40 rounded-lg p-3 border border-blue-800/30">
                          <p className="text-xs text-blue-400 mb-1">Tokens</p>
                          <p className="text-lg font-bold text-blue-100">
                            {org.total_tokens.toLocaleString('pt-BR')}
                          </p>
                        </div>

                        <div className="bg-slate-800/40 rounded-lg p-3 border border-blue-800/30">
                          <p className="text-xs text-blue-400 mb-1">Custo</p>
                          <p className="text-lg font-bold text-green-400">
                            {org.total_cost.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

