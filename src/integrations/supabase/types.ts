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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_bundle_waitlist: {
        Row: {
          bundle: string
          created_at: string
          email: string
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          bundle: string
          created_at?: string
          email: string
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          bundle?: string
          created_at?: string
          email?: string
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_bundle_waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generation_history: {
        Row: {
          additional_instructions: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          error_message: string | null
          generated_content: string | null
          id: string
          input_tokens: number | null
          is_active: boolean | null
          model_used: string | null
          output_tokens: number | null
          pinned: boolean
          selected_document_ids: string[] | null
          status: Database["public"]["Enums"]["generation_status"]
          topic: string
          total_tokens: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_instructions?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          error_message?: string | null
          generated_content?: string | null
          id?: string
          input_tokens?: number | null
          is_active?: boolean | null
          model_used?: string | null
          output_tokens?: number | null
          pinned?: boolean
          selected_document_ids?: string[] | null
          status?: Database["public"]["Enums"]["generation_status"]
          topic: string
          total_tokens?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_instructions?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          error_message?: string | null
          generated_content?: string | null
          id?: string
          input_tokens?: number | null
          is_active?: boolean | null
          model_used?: string | null
          output_tokens?: number | null
          pinned?: boolean
          selected_document_ids?: string[] | null
          status?: Database["public"]["Enums"]["generation_status"]
          topic?: string
          total_tokens?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generation_history_instructor_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_subscriptions: {
        Row: {
          bundle: Database["public"]["Enums"]["ai_bundle"]
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bundle: Database["public"]["Enums"]["ai_bundle"]
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bundle?: Database["public"]["Enums"]["ai_bundle"]
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_tier_limits: {
        Row: {
          created_at: string | null
          daily_limit: number
          description: string | null
          requests_per_minute: number
          tier_name: string
        }
        Insert: {
          created_at?: string | null
          daily_limit: number
          description?: string | null
          requests_per_minute?: number
          tier_name: string
        }
        Update: {
          created_at?: string | null
          daily_limit?: number
          description?: string | null
          requests_per_minute?: number
          tier_name?: string
        }
        Relationships: []
      }
      ai_tutor_usage: {
        Row: {
          chapter_id: string
          created_at: string | null
          discussion_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tutor_usage_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tutor_usage_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          chapter_id: string | null
          completion_tokens: number | null
          content_type: string
          course_id: string | null
          created_at: string
          function_name: string | null
          id: string
          latency_ms: number | null
          model_used: string | null
          prompt_tokens: number | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          completion_tokens?: number | null
          content_type?: string
          course_id?: string | null
          created_at?: string
          function_name?: string | null
          id?: string
          latency_ms?: number | null
          model_used?: string | null
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          completion_tokens?: number | null
          content_type?: string
          course_id?: string | null
          created_at?: string
          function_name?: string | null
          id?: string
          latency_ms?: number | null
          model_used?: string | null
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      chapter_resources: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          resource_type: string
          title: string
          url: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          resource_type?: string
          title: string
          url: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          resource_type?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_resources_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_transcripts: {
        Row: {
          chapter_id: string
          created_at: string | null
          error_message: string | null
          id: string
          language_code: string | null
          status: string | null
          transcript_json: Json | null
          transcript_vtt: string | null
          updated_at: string | null
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          language_code?: string | null
          status?: string | null
          transcript_json?: Json | null
          transcript_vtt?: string | null
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          language_code?: string | null
          status?: string | null
          transcript_json?: Json | null
          transcript_vtt?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_transcripts_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: true
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_free_preview: boolean | null
          mux_asset_id: string | null
          mux_playback_id: string | null
          position: number
          title: string
          transcript_language: string
          updated_at: string
          upload_status: string | null
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_free_preview?: boolean | null
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          position?: number
          title: string
          transcript_language?: string
          updated_at?: string
          upload_status?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_free_preview?: boolean | null
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          position?: number
          title?: string
          transcript_language?: string
          updated_at?: string
          upload_status?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_memberships: {
        Row: {
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          enrolled_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_memberships_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_ratings: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          rating: number
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          rating: number
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          average_rating: number | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instructor_id: string
          is_featured: boolean | null
          is_published: boolean | null
          price: number
          rating_count: number | null
          show_transcript: boolean | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          teacher_id: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["course_visibility"] | null
        }
        Insert: {
          average_rating?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id: string
          is_featured?: boolean | null
          is_published?: boolean | null
          price?: number
          rating_count?: number | null
          show_transcript?: boolean | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          teacher_id: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"] | null
        }
        Update: {
          average_rating?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          price?: number
          rating_count?: number | null
          show_transcript?: boolean | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["course_visibility"] | null
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_accepted_answer: boolean | null
          is_ai_generated: boolean | null
          parent_reply_id: string | null
          upvote_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_accepted_answer?: boolean | null
          is_ai_generated?: boolean | null
          parent_reply_id?: string | null
          upvote_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_accepted_answer?: boolean | null
          is_ai_generated?: boolean | null
          parent_reply_id?: string | null
          upvote_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_votes: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          target_type: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          target_type: string
          user_id: string
          vote: number
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
          vote?: number
        }
        Relationships: []
      }
      discussions: {
        Row: {
          chapter_id: string
          content: string
          course_id: string
          created_at: string | null
          has_ai_response: boolean | null
          id: string
          is_resolved: boolean | null
          reply_count: number | null
          title: string
          updated_at: string | null
          upvote_count: number | null
          user_id: string
          video_timestamp_seconds: number | null
        }
        Insert: {
          chapter_id: string
          content: string
          course_id: string
          created_at?: string | null
          has_ai_response?: boolean | null
          id?: string
          is_resolved?: boolean | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          upvote_count?: number | null
          user_id: string
          video_timestamp_seconds?: number | null
        }
        Update: {
          chapter_id?: string
          content?: string
          course_id?: string
          created_at?: string | null
          has_ai_response?: boolean | null
          id?: string
          is_resolved?: boolean | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          upvote_count?: number | null
          user_id?: string
          video_timestamp_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          organization: string
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          message: string
          name: string
          organization: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          organization?: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      instructor_services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_id: string
          is_active: boolean | null
          price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id: string
          is_active?: boolean | null
          price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string
          is_active?: boolean | null
          price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_services_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliation: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          credentials: string[] | null
          email: string | null
          full_name: string | null
          headline: string | null
          id: string
          linkedin_url: string | null
          onboarding_completed_at: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          affiliation?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credentials?: string[] | null
          email?: string | null
          full_name?: string | null
          headline?: string | null
          id: string
          linkedin_url?: string | null
          onboarding_completed_at?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          affiliation?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credentials?: string[] | null
          email?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          onboarding_completed_at?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          id: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          id?: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          id?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_knowledge_base: {
        Row: {
          content: string
          content_tokens: number
          context_role: Database["public"]["Enums"]["context_role"]
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          id: string
          is_active: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_tokens?: number
          context_role?: Database["public"]["Enums"]["context_role"]
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_tokens?: number
          context_role?: Database["public"]["Enums"]["context_role"]
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_knowledge_base_instructor_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          chapter_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_style_profile: {
        Row: {
          created_at: string
          custom_instructions: string | null
          id: string
          include_call_to_action: boolean | null
          include_citations: boolean | null
          language_preference:
            | Database["public"]["Enums"]["language_preference"]
            | null
          preferred_length:
            | Database["public"]["Enums"]["length_preference"]
            | null
          setup_completed: boolean | null
          target_audience: string | null
          tone: Database["public"]["Enums"]["writing_tone"] | null
          updated_at: string
          use_examples: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_instructions?: string | null
          id?: string
          include_call_to_action?: boolean | null
          include_citations?: boolean | null
          language_preference?:
            | Database["public"]["Enums"]["language_preference"]
            | null
          preferred_length?:
            | Database["public"]["Enums"]["length_preference"]
            | null
          setup_completed?: boolean | null
          target_audience?: string | null
          tone?: Database["public"]["Enums"]["writing_tone"] | null
          updated_at?: string
          use_examples?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          custom_instructions?: string | null
          id?: string
          include_call_to_action?: boolean | null
          include_citations?: boolean | null
          language_preference?:
            | Database["public"]["Enums"]["language_preference"]
            | null
          preferred_length?:
            | Database["public"]["Enums"]["length_preference"]
            | null
          setup_completed?: boolean | null
          target_audience?: string | null
          tone?: Database["public"]["Enums"]["writing_tone"] | null
          updated_at?: string
          use_examples?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_style_profile_instructor_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_ai_overview: { Args: never; Returns: Json }
      get_instructor_ai_insights: { Args: never; Returns: Json }
      get_instructor_catalog: {
        Args: never
        Returns: {
          avatar_url: string
          credentials: string[]
          full_name: string
          headline: string
          id: string
        }[]
      }
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          affiliation: string
          avatar_url: string
          bio: string
          credentials: string[]
          email: string
          full_name: string
          headline: string
          id: string
          linkedin_url: string
          twitter_url: string
          website_url: string
        }[]
      }
      has_course_access: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      ai_bundle: "marketing" | "academic" | "pro"
      app_role: "admin" | "teacher" | "student" | "instructor"
      content_type: "blog" | "newsletter"
      context_role: "style_reference" | "topic_source" | "background_context"
      course_visibility: "public" | "private" | "unlisted"
      document_type:
        | "academic_paper"
        | "cv_bio"
        | "methodology"
        | "writing_sample"
        | "syllabus"
        | "other"
      generation_status: "pending" | "completed" | "failed"
      language_preference: "es" | "en" | "bilingual"
      length_preference: "concise" | "moderate" | "detailed"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
      writing_tone: "formal" | "conversational" | "academic" | "journalistic"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      ai_bundle: ["marketing", "academic", "pro"],
      app_role: ["admin", "teacher", "student", "instructor"],
      content_type: ["blog", "newsletter"],
      context_role: ["style_reference", "topic_source", "background_context"],
      course_visibility: ["public", "private", "unlisted"],
      document_type: [
        "academic_paper",
        "cv_bio",
        "methodology",
        "writing_sample",
        "syllabus",
        "other",
      ],
      generation_status: ["pending", "completed", "failed"],
      language_preference: ["es", "en", "bilingual"],
      length_preference: ["concise", "moderate", "detailed"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
      writing_tone: ["formal", "conversational", "academic", "journalistic"],
    },
  },
} as const
