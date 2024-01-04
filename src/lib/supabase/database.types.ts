export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_id: string;
          city: string;
          complex_or_building: string | null;
          postal_code: number;
          province: string;
          street_address: string;
          suburb: string;
          user_id: string;
        };
        Insert: {
          address_id?: string;
          city: string;
          complex_or_building?: string | null;
          postal_code: number;
          province: string;
          street_address: string;
          suburb: string;
          user_id: string;
        };
        Update: {
          address_id?: string;
          city?: string;
          complex_or_building?: string | null;
          postal_code?: number;
          province?: string;
          street_address?: string;
          suburb?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      cart: {
        Row: {
          cart_item_id: string;
          created_at: string;
          product_id: string;
          quantity: number;
          size: string;
          user_id: string;
        };
        Insert: {
          cart_item_id?: string;
          created_at?: string;
          product_id: string;
          quantity: number;
          size: string;
          user_id: string;
        };
        Update: {
          cart_item_id?: string;
          created_at?: string;
          product_id?: string;
          quantity?: number;
          size?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'cart_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      order_items: {
        Row: {
          order_id: string;
          order_item_id: string;
          price_paid: number;
          product_id: string;
          product_image_url: string;
          product_name: string;
          quantity: number;
          return_details: string;
          size: string;
          user_id: string;
        };
        Insert: {
          order_id: string;
          order_item_id?: string;
          price_paid: number;
          product_id: string;
          product_image_url: string;
          product_name: string;
          quantity: number;
          return_details: string;
          size: string;
          user_id: string;
        };
        Update: {
          order_id?: string;
          order_item_id?: string;
          price_paid?: number;
          product_id?: string;
          product_image_url?: string;
          product_name?: string;
          quantity?: number;
          return_details?: string;
          size?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['order_id'];
          },
          {
            foreignKeyName: 'order_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      orders: {
        Row: {
          cart_total: number;
          created_at: string;
          delivery_fee: number;
          discount_total: number;
          is_paid: boolean;
          order_id: string;
          order_total: number;
          user_id: string;
        };
        Insert: {
          cart_total: number;
          created_at?: string;
          delivery_fee: number;
          discount_total: number;
          is_paid?: boolean;
          order_id?: string;
          order_total: number;
          user_id: string;
        };
        Update: {
          cart_total?: number;
          created_at?: string;
          delivery_fee?: number;
          discount_total?: number;
          is_paid?: boolean;
          order_id?: string;
          order_total?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      product_image_data: {
        Row: {
          created_at: string;
          file_name: string;
          image_url: string;
          product_id: string;
          product_image_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          image_url: string;
          product_id: string;
          product_image_id?: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          image_url?: string;
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
          brand: string;
          category: string;
          created_at: string;
          delivery_info: string;
          details: string;
          name: string;
          on_sale: string;
          price: number;
          product_id: string;
          return_info: string;
          sale_percentage: number;
          sizes: string[];
        };
        Insert: {
          brand: string;
          category: string;
          created_at?: string;
          delivery_info: string;
          details: string;
          name: string;
          on_sale: string;
          price: number;
          product_id?: string;
          return_info: string;
          sale_percentage: number;
          sizes: string[];
        };
        Update: {
          brand?: string;
          category?: string;
          created_at?: string;
          delivery_info?: string;
          details?: string;
          name?: string;
          on_sale?: string;
          price?: number;
          product_id?: string;
          return_info?: string;
          sale_percentage?: number;
          sizes?: string[];
        };
        Relationships: [];
      };
      shipping_details: {
        Row: {
          city: string;
          complex_or_building: string | null;
          contact_number: string;
          full_name: string;
          order_id: string;
          postal_code: number;
          province: string;
          shipping_details_id: string;
          street_address: string;
          suburb: string;
          user_id: string;
        };
        Insert: {
          city: string;
          complex_or_building?: string | null;
          contact_number: string;
          full_name: string;
          order_id: string;
          postal_code: number;
          province: string;
          shipping_details_id?: string;
          street_address: string;
          suburb: string;
          user_id: string;
        };
        Update: {
          city?: string;
          complex_or_building?: string | null;
          contact_number?: string;
          full_name?: string;
          order_id?: string;
          postal_code?: number;
          province?: string;
          shipping_details_id?: string;
          street_address?: string;
          suburb?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shipping_details_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['order_id'];
          },
          {
            foreignKeyName: 'shipping_details_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      users: {
        Row: {
          contact_number: string | null;
          email: string;
          first_name: string | null;
          is_admin: boolean;
          last_name: string | null;
          user_id: string;
        };
        Insert: {
          contact_number?: string | null;
          email: string;
          first_name?: string | null;
          is_admin?: boolean;
          last_name?: string | null;
          user_id: string;
        };
        Update: {
          contact_number?: string | null;
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
      update_cart_item_quantity: {
        Args: {
          item_id: string;
          item_quantity: number;
        };
        Returns: undefined;
      };
      verify_user_password: {
        Args: {
          password: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
  ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never;
