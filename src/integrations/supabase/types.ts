export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agent_ia_config: {
        Row: {
          agent_name: string
          closing_message: string
          confirmation_email_html: string | null
          created_at: string
          customer_pause_duration_seconds: number | null
          follow_up_1_minutes: number | null
          follow_up_2_minutes: number | null
          follow_up_3_minutes: number | null
          greeting_message: string
          id: string
          openai_api_key: string | null
          organization_id: string
          pause_duration_seconds: number
          personality: string
          qualification_questions: Json | null
          reminder_1_minutes: number | null
          reminder_2_minutes: number | null
          reminder_3_minutes: number | null
          updated_at: string
        }
        Insert: {
          agent_name?: string
          closing_message?: string
          confirmation_email_html?: string | null
          created_at?: string
          customer_pause_duration_seconds?: number | null
          follow_up_1_minutes?: number | null
          follow_up_2_minutes?: number | null
          follow_up_3_minutes?: number | null
          greeting_message?: string
          id?: string
          openai_api_key?: string | null
          organization_id: string
          pause_duration_seconds?: number
          personality?: string
          qualification_questions?: Json | null
          reminder_1_minutes?: number | null
          reminder_2_minutes?: number | null
          reminder_3_minutes?: number | null
          updated_at?: string
        }
        Update: {
          agent_name?: string
          closing_message?: string
          confirmation_email_html?: string | null
          created_at?: string
          customer_pause_duration_seconds?: number | null
          follow_up_1_minutes?: number | null
          follow_up_2_minutes?: number | null
          follow_up_3_minutes?: number | null
          greeting_message?: string
          id?: string
          openai_api_key?: string | null
          organization_id?: string
          pause_duration_seconds?: number
          personality?: string
          qualification_questions?: Json | null
          reminder_1_minutes?: number | null
          reminder_2_minutes?: number | null
          reminder_3_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_ia_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          date: string
          end_datetime: string | null
          id: string
          observations: string | null
          organization_id: string
          patient_id: string | null
          patient_name: string
          reminder_1_sent: boolean | null
          reminder_2_sent: boolean | null
          reminder_3_sent: boolean | null
          session_id: string | null
          start_datetime: string | null
          status: string | null
          time: string
          type: string
        }
        Insert: {
          created_at?: string
          date: string
          end_datetime?: string | null
          id?: string
          observations?: string | null
          organization_id: string
          patient_id?: string | null
          patient_name: string
          reminder_1_sent?: boolean | null
          reminder_2_sent?: boolean | null
          reminder_3_sent?: boolean | null
          session_id?: string | null
          start_datetime?: string | null
          status?: string | null
          time: string
          type: string
        }
        Update: {
          created_at?: string
          date?: string
          end_datetime?: string | null
          id?: string
          observations?: string | null
          organization_id?: string
          patient_id?: string | null
          patient_name?: string
          reminder_1_sent?: boolean | null
          reminder_2_sent?: boolean | null
          reminder_3_sent?: boolean | null
          session_id?: string | null
          start_datetime?: string | null
          status?: string | null
          time?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      bem_estar_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      clientes_followup: {
        Row: {
          data_envio1: string | null
          data_envio2: string | null
          data_envio3: string | null
          followup: string | null
          followup1: string | null
          followup2: string | null
          followup3: string | null
          id: number
          mensagem1: string | null
          mensagem2: string | null
          mensagem3: string | null
          nome: string | null
          numero: string | null
          organization_id: string | null
          sessionid: string | null
          situacao: string | null
          ultima_atividade: string | null
          ultima_mensagem_ia: string | null
        }
        Insert: {
          data_envio1?: string | null
          data_envio2?: string | null
          data_envio3?: string | null
          followup?: string | null
          followup1?: string | null
          followup2?: string | null
          followup3?: string | null
          id?: number
          mensagem1?: string | null
          mensagem2?: string | null
          mensagem3?: string | null
          nome?: string | null
          numero?: string | null
          organization_id?: string | null
          sessionid?: string | null
          situacao?: string | null
          ultima_atividade?: string | null
          ultima_mensagem_ia?: string | null
        }
        Update: {
          data_envio1?: string | null
          data_envio2?: string | null
          data_envio3?: string | null
          followup?: string | null
          followup1?: string | null
          followup2?: string | null
          followup3?: string | null
          id?: number
          mensagem1?: string | null
          mensagem2?: string | null
          mensagem3?: string | null
          nome?: string | null
          numero?: string | null
          organization_id?: string | null
          sessionid?: string | null
          situacao?: string | null
          ultima_atividade?: string | null
          ultima_mensagem_ia?: string | null
        }
        Relationships: []
      }
      clinica_labz_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      clinica_mente_feliz_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      clinica_saude_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      documents_geral: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          titulo: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Relationships: []
      }
      empresa_digital_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      global_settings: {
        Row: {
          created_at: string
          id: string
          openai_api_key: string | null
          support_whatsapp: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          openai_api_key?: string | null
          support_whatsapp?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          openai_api_key?: string | null
          support_whatsapp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lado_digital_chats: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          consultation_duration: number | null
          contact_email: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          plan_features: Json | null
          settings: Json | null
          slug: string
          subscription_plan: string | null
        }
        Insert: {
          consultation_duration?: number | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          plan_features?: Json | null
          settings?: Json | null
          slug: string
          subscription_plan?: string | null
        }
        Update: {
          consultation_duration?: number | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          plan_features?: Json | null
          settings?: Json | null
          slug?: string
          subscription_plan?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          kanban_status: string | null
          last_visit: string | null
          name: string | null
          observations: string | null
          organization_id: string
          phone: string
          resumo: string | null
          session_id: string | null
          status: string | null
          total_visits: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          kanban_status?: string | null
          last_visit?: string | null
          name?: string | null
          observations?: string | null
          organization_id: string
          phone: string
          resumo?: string | null
          session_id?: string | null
          status?: string | null
          total_visits?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          kanban_status?: string | null
          last_visit?: string | null
          name?: string | null
          observations?: string | null
          organization_id?: string
          phone?: string
          resumo?: string | null
          session_id?: string | null
          status?: string | null
          total_visits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          is_active: boolean | null
          is_super_admin: boolean | null
          organization_id: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          is_active?: boolean | null
          is_super_admin?: boolean | null
          organization_id?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_super_admin?: boolean | null
          organization_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          clinic_name: string
          created_at: string
          doctor_name: string
          id: string
          organization_id: string
          subscription_plan: string | null
          subscription_renews_at: string | null
        }
        Insert: {
          clinic_name: string
          created_at?: string
          doctor_name: string
          id?: string
          organization_id: string
          subscription_plan?: string | null
          subscription_renews_at?: string | null
        }
        Update: {
          clinic_name?: string
          created_at?: string
          doctor_name?: string
          id?: string
          organization_id?: string
          subscription_plan?: string | null
          subscription_renews_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plan_configs: {
        Row: {
          agendamento_automatico: boolean | null
          analytics: boolean | null
          atendimento_inteligente: boolean | null
          base_conhecimento: boolean | null
          confirmacao_email: boolean | null
          created_at: string | null
          id: string
          integracao_whatsapp: boolean | null
          lembretes_automaticos: boolean | null
          max_agendamentos_mes: number | null
          max_mensagens_whatsapp_mes: number | null
          max_pacientes: number | null
          max_usuarios: number | null
          multi_usuarios: boolean | null
          personalizacao_agente: boolean | null
          plan_description: string | null
          plan_id: string
          plan_name: string
          price_annual: number | null
          price_monthly: number | null
          relatorios_avancados: boolean | null
          updated_at: string | null
        }
        Insert: {
          agendamento_automatico?: boolean | null
          analytics?: boolean | null
          atendimento_inteligente?: boolean | null
          base_conhecimento?: boolean | null
          confirmacao_email?: boolean | null
          created_at?: string | null
          id?: string
          integracao_whatsapp?: boolean | null
          lembretes_automaticos?: boolean | null
          max_agendamentos_mes?: number | null
          max_mensagens_whatsapp_mes?: number | null
          max_pacientes?: number | null
          max_usuarios?: number | null
          multi_usuarios?: boolean | null
          personalizacao_agente?: boolean | null
          plan_description?: string | null
          plan_id: string
          plan_name: string
          price_annual?: number | null
          price_monthly?: number | null
          relatorios_avancados?: boolean | null
          updated_at?: string | null
        }
        Update: {
          agendamento_automatico?: boolean | null
          analytics?: boolean | null
          atendimento_inteligente?: boolean | null
          base_conhecimento?: boolean | null
          confirmacao_email?: boolean | null
          created_at?: string | null
          id?: string
          integracao_whatsapp?: boolean | null
          lembretes_automaticos?: boolean | null
          max_agendamentos_mes?: number | null
          max_mensagens_whatsapp_mes?: number | null
          max_pacientes?: number | null
          max_usuarios?: number | null
          multi_usuarios?: boolean | null
          personalizacao_agente?: boolean | null
          plan_description?: string | null
          plan_id?: string
          plan_name?: string
          price_annual?: number | null
          price_monthly?: number | null
          relatorios_avancados?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          cost_reais: number
          created_at: string | null
          id: string
          organization_id: string
          total_tokens: number
        }
        Insert: {
          cost_reais?: number
          created_at?: string | null
          id?: string
          organization_id: string
          total_tokens?: number
        }
        Update: {
          cost_reais?: number
          created_at?: string | null
          id?: string
          organization_id?: string
          total_tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_items: {
        Row: {
          category: string | null
          created_at: string | null
          icon_url: string | null
          id: string
          notes: string | null
          password: string | null
          service_name: string
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          notes?: string | null
          password?: string | null
          service_name: string
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          notes?: string | null
          password?: string | null
          service_name?: string
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      whatsapp_instances: {
        Row: {
          admin_field_01: string
          created_at: string
          id: string
          instance_id: string
          instance_name: string
          organization_id: string
          pairing_code: string | null
          phone: string
          qr_code: string | null
          status: string
          token: string
          updated_at: string
          webhook_created: string | null
          webhook_url: string | null
        }
        Insert: {
          admin_field_01: string
          created_at?: string
          id?: string
          instance_id: string
          instance_name: string
          organization_id: string
          pairing_code?: string | null
          phone: string
          qr_code?: string | null
          status?: string
          token: string
          updated_at?: string
          webhook_created?: string | null
          webhook_url?: string | null
        }
        Update: {
          admin_field_01?: string
          created_at?: string
          id?: string
          instance_id?: string
          instance_name?: string
          organization_id?: string
          pairing_code?: string | null
          phone?: string
          qr_code?: string | null
          status?: string
          token?: string
          updated_at?: string
          webhook_created?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedules: {
        Row: {
          consultation_duration: number | null
          created_at: string | null
          domingo_fim_almoco: string | null
          domingo_fim_trabalho: string | null
          domingo_inicio_almoco: string | null
          domingo_inicio_trabalho: string | null
          domingo_is_active: boolean | null
          id: string
          organization_id: string
          quarta_fim_almoco: string | null
          quarta_fim_trabalho: string | null
          quarta_inicio_almoco: string | null
          quarta_inicio_trabalho: string | null
          quarta_is_active: boolean | null
          quinta_fim_almoco: string | null
          quinta_fim_trabalho: string | null
          quinta_inicio_almoco: string | null
          quinta_inicio_trabalho: string | null
          quinta_is_active: boolean | null
          sabado_fim_almoco: string | null
          sabado_fim_trabalho: string | null
          sabado_inicio_almoco: string | null
          sabado_inicio_trabalho: string | null
          sabado_is_active: boolean | null
          segunda_fim_almoco: string | null
          segunda_fim_trabalho: string | null
          segunda_inicio_almoco: string | null
          segunda_inicio_trabalho: string | null
          segunda_is_active: boolean | null
          sexta_fim_almoco: string | null
          sexta_fim_trabalho: string | null
          sexta_inicio_almoco: string | null
          sexta_inicio_trabalho: string | null
          sexta_is_active: boolean | null
          terca_fim_almoco: string | null
          terca_fim_trabalho: string | null
          terca_inicio_almoco: string | null
          terca_inicio_trabalho: string | null
          terca_is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consultation_duration?: number | null
          created_at?: string | null
          domingo_fim_almoco?: string | null
          domingo_fim_trabalho?: string | null
          domingo_inicio_almoco?: string | null
          domingo_inicio_trabalho?: string | null
          domingo_is_active?: boolean | null
          id?: string
          organization_id: string
          quarta_fim_almoco?: string | null
          quarta_fim_trabalho?: string | null
          quarta_inicio_almoco?: string | null
          quarta_inicio_trabalho?: string | null
          quarta_is_active?: boolean | null
          quinta_fim_almoco?: string | null
          quinta_fim_trabalho?: string | null
          quinta_inicio_almoco?: string | null
          quinta_inicio_trabalho?: string | null
          quinta_is_active?: boolean | null
          sabado_fim_almoco?: string | null
          sabado_fim_trabalho?: string | null
          sabado_inicio_almoco?: string | null
          sabado_inicio_trabalho?: string | null
          sabado_is_active?: boolean | null
          segunda_fim_almoco?: string | null
          segunda_fim_trabalho?: string | null
          segunda_inicio_almoco?: string | null
          segunda_inicio_trabalho?: string | null
          segunda_is_active?: boolean | null
          sexta_fim_almoco?: string | null
          sexta_fim_trabalho?: string | null
          sexta_inicio_almoco?: string | null
          sexta_inicio_trabalho?: string | null
          sexta_is_active?: boolean | null
          terca_fim_almoco?: string | null
          terca_fim_trabalho?: string | null
          terca_inicio_almoco?: string | null
          terca_inicio_trabalho?: string | null
          terca_is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consultation_duration?: number | null
          created_at?: string | null
          domingo_fim_almoco?: string | null
          domingo_fim_trabalho?: string | null
          domingo_inicio_almoco?: string | null
          domingo_inicio_trabalho?: string | null
          domingo_is_active?: boolean | null
          id?: string
          organization_id?: string
          quarta_fim_almoco?: string | null
          quarta_fim_trabalho?: string | null
          quarta_inicio_almoco?: string | null
          quarta_inicio_trabalho?: string | null
          quarta_is_active?: boolean | null
          quinta_fim_almoco?: string | null
          quinta_fim_trabalho?: string | null
          quinta_inicio_almoco?: string | null
          quinta_inicio_trabalho?: string | null
          quinta_is_active?: boolean | null
          sabado_fim_almoco?: string | null
          sabado_fim_trabalho?: string | null
          sabado_inicio_almoco?: string | null
          sabado_inicio_trabalho?: string | null
          sabado_is_active?: boolean | null
          segunda_fim_almoco?: string | null
          segunda_fim_trabalho?: string | null
          segunda_inicio_almoco?: string | null
          segunda_inicio_trabalho?: string | null
          segunda_is_active?: boolean | null
          sexta_fim_almoco?: string | null
          sexta_fim_trabalho?: string | null
          sexta_inicio_almoco?: string | null
          sexta_inicio_trabalho?: string | null
          sexta_is_active?: boolean | null
          terca_fim_almoco?: string | null
          terca_fim_trabalho?: string | null
          terca_inicio_almoco?: string | null
          terca_inicio_trabalho?: string | null
          terca_is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_vault_item: {
        Args: {
          p_category?: string
          p_icon_url?: string
          p_notes?: string
          p_password?: string
          p_service_name: string
          p_username?: string
          p_website_url?: string
        }
        Returns: string
      }
      delete_vault_item: { Args: { p_id: string }; Returns: boolean }
      generate_slug: { Args: { name: string }; Returns: string }
      get_user_organization_id: { Args: never; Returns: string }
      get_vault_item_by_id: {
        Args: { p_id: string }
        Returns: {
          category: string
          created_at: string
          icon_url: string
          id: string
          notes: string
          password: string
          service_name: string
          updated_at: string
          username: string
          website_url: string
        }[]
      }
      get_vault_items: {
        Args: never
        Returns: {
          category: string
          created_at: string
          icon_url: string
          id: string
          notes: string
          password: string
          service_name: string
          updated_at: string
          username: string
          website_url: string
        }[]
      }
      is_user_super_admin: { Args: never; Returns: boolean }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_dynamic: {
        Args: {
          filter?: Json
          match_count?: number
          query_embedding: string
          table_name: string
        }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_geral: {
        Args: { filter: Json; match_count: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      search_vault_items: {
        Args: { p_search_term: string }
        Returns: {
          category: string
          created_at: string
          icon_url: string
          id: string
          notes: string
          password: string
          service_name: string
          updated_at: string
          username: string
          website_url: string
        }[]
      }
      update_vault_item: {
        Args: {
          p_category?: string
          p_icon_url?: string
          p_id: string
          p_notes?: string
          p_password?: string
          p_service_name?: string
          p_username?: string
          p_website_url?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
