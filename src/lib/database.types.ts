export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      product_image_data: {
        Row: {
          created_at: string;
          file_name: string;
          image_url: string;
          index: number;
          product_id: string;
          product_image_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          image_url: string;
          index: number;
          product_id: string;
          product_image_id?: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          image_url?: string;
          index?: number;
          product_id?: string;
          product_image_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_image_data_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['product_id'];
          }
        ];
      };
      products: {
        Row: {
          category: string;
          created_at: string;
          delivery_info: string;
          description: string;
          name: string;
          on_sale: string;
          price: number;
          product_id: string;
          sale_percentage: number;
          sizes: string[];
        };
        Insert: {
          category: string;
          created_at?: string;
          delivery_info: string;
          description: string;
          name: string;
          on_sale: string;
          price: number;
          product_id?: string;
          sale_percentage: number;
          sizes: string[];
        };
        Update: {
          category?: string;
          created_at?: string;
          delivery_info?: string;
          description?: string;
          name?: string;
          on_sale?: string;
          price?: number;
          product_id?: string;
          sale_percentage?: number;
          sizes?: string[];
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string;
          first_name: string | null;
          is_admin: boolean;
          last_name: string | null;
          user_id: string;
        };
        Insert: {
          email: string;
          first_name?: string | null;
          is_admin?: boolean;
          last_name?: string | null;
          user_id: string;
        };
        Update: {
          email?: string;
          first_name?: string | null;
          is_admin?: boolean;
          last_name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
