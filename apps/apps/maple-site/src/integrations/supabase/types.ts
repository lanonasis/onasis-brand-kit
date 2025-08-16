export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_banks_memories: {
        Row: {
          access_count: number | null
          content: string
          created_at: string | null
          id: string
          memory_type: string | null
          metadata: Json | null
          project_ref: string | null
          relevance_score: number | null
          source_url: string | null
          status: string | null
          summary: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          access_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          memory_type?: string | null
          metadata?: Json | null
          project_ref?: string | null
          relevance_score?: number | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          access_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          memory_type?: string | null
          metadata?: Json | null
          project_ref?: string | null
          relevance_score?: number | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_banks_memory_search_logs: {
        Row: {
          created_at: string | null
          execution_time_ms: number | null
          filters: Json | null
          id: string
          limit_requested: number | null
          query: string
          results_count: number | null
          search_type: string | null
          session_id: string | null
          threshold: number | null
          top_similarity_score: number | null
          user_context: string | null
        }
        Insert: {
          created_at?: string | null
          execution_time_ms?: number | null
          filters?: Json | null
          id?: string
          limit_requested?: number | null
          query: string
          results_count?: number | null
          search_type?: string | null
          session_id?: string | null
          threshold?: number | null
          top_similarity_score?: number | null
          user_context?: string | null
        }
        Update: {
          created_at?: string | null
          execution_time_ms?: number | null
          filters?: Json | null
          id?: string
          limit_requested?: number | null
          query?: string
          results_count?: number | null
          search_type?: string | null
          session_id?: string | null
          threshold?: number | null
          top_similarity_score?: number | null
          user_context?: string | null
        }
        Relationships: []
      }
      agent_banks_sessions: {
        Row: {
          completed_at: string | null
          description: string | null
          id: string
          last_activity: string | null
          memory_count: number | null
          metadata: Json | null
          session_name: string
          session_type: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          description?: string | null
          id?: string
          last_activity?: string | null
          memory_count?: number | null
          metadata?: Json | null
          session_name: string
          session_type?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          description?: string | null
          id?: string
          last_activity?: string | null
          memory_count?: number | null
          metadata?: Json | null
          session_name?: string
          session_type?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      ai_response_cache: {
        Row: {
          created_at: string
          expires_at: string | null
          hit_count: number | null
          id: string
          model_used: string
          prompt: string
          prompt_hash: string
          response: string
          tokens_used: number | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          hit_count?: number | null
          id?: string
          model_used: string
          prompt: string
          prompt_hash: string
          response: string
          tokens_used?: number | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          hit_count?: number | null
          id?: string
          model_used?: string
          prompt?: string
          prompt_hash?: string
          response?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string
          estimated_cost: number | null
          feedback_text: string | null
          id: string
          model_used: string
          prompt: string
          query_complexity: string
          response_time_ms: number | null
          tokens_used: number | null
          user_feedback: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number | null
          feedback_text?: string | null
          id?: string
          model_used: string
          prompt: string
          query_complexity: string
          response_time_ms?: number | null
          tokens_used?: number | null
          user_feedback?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number | null
          feedback_text?: string | null
          id?: string
          model_used?: string
          prompt?: string
          query_complexity?: string
          response_time_ms?: number | null
          tokens_used?: number | null
          user_feedback?: number | null
          user_id?: string
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_code: string
          category: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          bank_code: string
          category?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          bank_code?: string
          category?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bulk_payments: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          last_error: string | null
          modified_by: string | null
          processed_at: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["payment_status"]
          title: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          last_error?: string | null
          modified_by?: string | null
          processed_at?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          title: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          last_error?: string | null
          modified_by?: string | null
          processed_at?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          title?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          title: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          encrypted: boolean
          id: string
          role: string
          timestamp: string
        }
        Insert: {
          content: string
          conversation_id: string
          encrypted?: boolean
          id: string
          role: string
          timestamp?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          encrypted?: boolean
          id?: string
          role?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      company_endpoints: {
        Row: {
          auth_required: boolean
          created_at: string
          description: string | null
          id: string
          method: string
          path: string
          rate_limit: number | null
          service_id: string
          updated_at: string
        }
        Insert: {
          auth_required?: boolean
          created_at?: string
          description?: string | null
          id?: string
          method: string
          path: string
          rate_limit?: number | null
          service_id: string
          updated_at?: string
        }
        Update: {
          auth_required?: boolean
          created_at?: string
          description?: string | null
          id?: string
          method?: string
          path?: string
          rate_limit?: number | null
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_endpoints_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      company_projects: {
        Row: {
          api_key: string
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          api_key?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_services: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          name: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "company_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      company_usage_logs: {
        Row: {
          endpoint_id: string | null
          execution_time_ms: number | null
          id: string
          metadata: Json | null
          project_id: string
          request_method: string | null
          request_path: string | null
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_status: number | null
          service_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          endpoint_id?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          project_id: string
          request_method?: string | null
          request_path?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          service_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          endpoint_id?: string | null
          execution_time_ms?: number | null
          id?: string
          metadata?: Json | null
          project_id?: string
          request_method?: string | null
          request_path?: string | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          service_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_usage_logs_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "company_endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_usage_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "company_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_usage_logs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      imported_data: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          source_type: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          source_type: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          source_type?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      marketplace_transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string
          id: string
          order_id: string | null
          platform_fee: number
          seller_amount: number
          seller_id: string | null
          status: string
          stripe_charge_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          platform_fee: number
          seller_amount: number
          seller_id?: string | null
          status?: string
          stripe_charge_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          platform_fee?: number
          seller_amount?: number
          seller_id?: string | null
          status?: string
          stripe_charge_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          error_enabled: boolean
          id: string
          info_enabled: boolean
          success_enabled: boolean
          updated_at: string
          user_id: string
          warning_enabled: boolean
        }
        Insert: {
          created_at?: string
          error_enabled?: boolean
          id?: string
          info_enabled?: boolean
          success_enabled?: boolean
          updated_at?: string
          user_id: string
          warning_enabled?: boolean
        }
        Update: {
          created_at?: string
          error_enabled?: boolean
          id?: string
          info_enabled?: boolean
          success_enabled?: boolean
          updated_at?: string
          user_id?: string
          warning_enabled?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          notification_group: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          notification_group?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          notification_group?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          order_date: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          order_date?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          order_date?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_audit: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_status: Database["public"]["Enums"]["payment_status"] | null
          old_status: Database["public"]["Enums"]["payment_status"] | null
          payment_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["payment_status"] | null
          old_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["payment_status"] | null
          old_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_id?: string
        }
        Relationships: []
      }
      payment_items: {
        Row: {
          amount: number
          beneficiary_id: string
          bulk_payment_id: string
          created_at: string
          currency_code: string
          description: string | null
          error_message: string | null
          id: string
          processed_at: string | null
          retry_count: number | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          beneficiary_id: string
          bulk_payment_id: string
          created_at?: string
          currency_code?: string
          description?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          retry_count?: number | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          beneficiary_id?: string
          bulk_payment_id?: string
          created_at?: string
          currency_code?: string
          description?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          retry_count?: number | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_items_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_bulk_payment_id_fkey"
            columns: ["bulk_payment_id"]
            isOneToOne: false
            referencedRelation: "bulk_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_insights: {
        Row: {
          confidence_score: number
          created_at: string | null
          expires_at: string | null
          id: string
          market_trend: string | null
          max_viable_price: number | null
          min_viable_price: number | null
          price_elasticity: number | null
          product_id: string
          reasoning: string | null
          suggested_price: number
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          market_trend?: string | null
          max_viable_price?: number | null
          min_viable_price?: number | null
          price_elasticity?: number | null
          product_id: string
          reasoning?: string | null
          suggested_price: number
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          market_trend?: string | null
          max_viable_price?: number | null
          min_viable_price?: number | null
          price_elasticity?: number | null
          product_id?: string
          reasoning?: string | null
          suggested_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_insights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_embeddings: {
        Row: {
          created_at: string | null
          embedding: string | null
          id: string
          product_id: string
          text_content: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          id?: string
          product_id: string
          text_content: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          id?: string
          product_id?: string
          text_content?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_embeddings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock_quantity: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_type: string | null
          company_name: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_vendor: boolean | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          business_type?: string | null
          company_name?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_vendor?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          business_type?: string | null
          company_name?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_vendor?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      query_classifications: {
        Row: {
          actual_complexity: string | null
          classified_complexity: string
          created_at: string
          feedback_score: number | null
          id: string
          prompt: string
          tokens_used: number | null
          was_escalated: boolean | null
        }
        Insert: {
          actual_complexity?: string | null
          classified_complexity: string
          created_at?: string
          feedback_score?: number | null
          id?: string
          prompt: string
          tokens_used?: number | null
          was_escalated?: boolean | null
        }
        Update: {
          actual_complexity?: string | null
          classified_complexity?: string
          created_at?: string
          feedback_score?: number | null
          id?: string
          prompt?: string
          tokens_used?: number | null
          was_escalated?: boolean | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          clicked: boolean | null
          created_at: string | null
          id: string
          product_id: string
          reason: string | null
          recommendation_type: string
          relevance_score: number
          supplier_id: string
          updated_at: string | null
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          clicked?: boolean | null
          created_at?: string | null
          id?: string
          product_id: string
          reason?: string | null
          recommendation_type: string
          relevance_score: number
          supplier_id: string
          updated_at?: string | null
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          clicked?: boolean | null
          created_at?: string | null
          id?: string
          product_id?: string
          reason?: string | null
          recommendation_type?: string
          relevance_score?: number
          supplier_id?: string
          updated_at?: string | null
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_analysis: {
        Row: {
          created_at: string | null
          id: string
          is_flagged: boolean | null
          order_id: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          risk_factors: Json | null
          risk_score: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          order_id?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          risk_factors?: Json | null
          risk_score: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          order_id?: string | null
          review_status?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          risk_factors?: Json | null
          risk_score?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_analysis_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          category: string | null
          created_at: string | null
          filters: Json | null
          id: string
          results_count: number | null
          search_query: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          created_at: string
          id: string
          onboarding_complete: boolean
          stripe_account_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          business_size: string | null
          created_at: string
          id: string
          industry_focus: string[] | null
          payment_methods: string[] | null
          preferred_currencies: string[] | null
          regions_of_interest: string[] | null
          risk_tolerance: string | null
          trade_frequency: string | null
          trade_volume: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_size?: string | null
          created_at?: string
          id?: string
          industry_focus?: string[] | null
          payment_methods?: string[] | null
          preferred_currencies?: string[] | null
          regions_of_interest?: string[] | null
          risk_tolerance?: string | null
          trade_frequency?: string | null
          trade_volume?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_size?: string | null
          created_at?: string
          id?: string
          industry_focus?: string[] | null
          payment_methods?: string[] | null
          preferred_currencies?: string[] | null
          regions_of_interest?: string[] | null
          risk_tolerance?: string | null
          trade_frequency?: string | null
          trade_volume?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tiers: {
        Row: {
          can_use_advanced_models: boolean
          created_at: string
          expires_at: string | null
          id: string
          max_queries_per_day: number
          tier_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_use_advanced_models?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          max_queries_per_day?: number
          tier_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_use_advanced_models?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          max_queries_per_day?: number
          tier_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_cards: {
        Row: {
          card_id: string | null
          cardholder_id: string | null
          created_at: string
          id: string
          is_locked: boolean
          last4: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          cardholder_id?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          last4?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          cardholder_id?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          last4?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vortex_items: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          keywords: string[] | null
          owner_id: string | null
          pitch: string | null
          source: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          url: string | null
          writer: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          owner_id?: string | null
          pitch?: string | null
          source?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          writer?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          owner_id?: string | null
          pitch?: string | null
          source?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          writer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vortex_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_safe_query: {
        Args: { query_text: string; query_params?: Json }
        Returns: Json
      }
      get_product_image_url: {
        Args: { image_path: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_owner: {
        Args: { bulk_id: string }
        Returns: boolean
      }
      request_password_reset: {
        Args: { email: string }
        Returns: boolean
      }
    }
    Enums: {
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "canceled"
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
    Enums: {
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "canceled",
      ],
    },
  },
} as const
