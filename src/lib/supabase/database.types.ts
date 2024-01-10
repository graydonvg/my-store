export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          addressId: string;
          city: string;
          complexOrBuilding: string | null;
          postalCode: number;
          province: string;
          streetAddress: string;
          suburb: string;
          userId: string;
        };
        Insert: {
          addressId?: string;
          city: string;
          complexOrBuilding?: string | null;
          postalCode: number;
          province: string;
          streetAddress: string;
          suburb: string;
          userId: string;
        };
        Update: {
          addressId?: string;
          city?: string;
          complexOrBuilding?: string | null;
          postalCode?: number;
          province?: string;
          streetAddress?: string;
          suburb?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      cart: {
        Row: {
          cartItemId: string;
          createdAt: string;
          productId: string;
          quantity: number;
          size: string;
          userId: string;
        };
        Insert: {
          cartItemId?: string;
          createdAt?: string;
          productId: string;
          quantity: number;
          size: string;
          userId: string;
        };
        Update: {
          cartItemId?: string;
          createdAt?: string;
          productId?: string;
          quantity?: number;
          size?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['productId'];
          },
          {
            foreignKeyName: 'cart_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      orderItems: {
        Row: {
          orderId: string;
          orderItemId: string;
          pricePaid: number;
          productId: string;
          quantity: number;
          size: string;
          userId: string;
        };
        Insert: {
          orderId: string;
          orderItemId?: string;
          pricePaid: number;
          productId: string;
          quantity: number;
          size: string;
          userId: string;
        };
        Update: {
          orderId?: string;
          orderItemId?: string;
          pricePaid?: number;
          productId?: string;
          quantity?: number;
          size?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orderItems_orderId_fkey';
            columns: ['orderId'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['orderId'];
          },
          {
            foreignKeyName: 'orderItems_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['productId'];
          },
          {
            foreignKeyName: 'orderItems_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      orders: {
        Row: {
          cartTotal: number;
          createdAt: string;
          deliveryFee: number;
          discountTotal: number;
          isPaid: boolean;
          orderId: string;
          orderTotal: number;
          shippingDetails: string;
          userId: string;
        };
        Insert: {
          cartTotal: number;
          createdAt?: string;
          deliveryFee: number;
          discountTotal: number;
          isPaid?: boolean;
          orderId?: string;
          orderTotal: number;
          shippingDetails: string;
          userId: string;
        };
        Update: {
          cartTotal?: number;
          createdAt?: string;
          deliveryFee?: number;
          discountTotal?: number;
          isPaid?: boolean;
          orderId?: string;
          orderTotal?: number;
          shippingDetails?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      productImageData: {
        Row: {
          createdAt: string;
          fileName: string;
          imageUrl: string;
          productId: string;
          productImageId: string;
        };
        Insert: {
          createdAt?: string;
          fileName: string;
          imageUrl: string;
          productId: string;
          productImageId?: string;
        };
        Update: {
          createdAt?: string;
          fileName?: string;
          imageUrl?: string;
          productId?: string;
          productImageId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'productImageData_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['productId'];
          }
        ];
      };
      products: {
        Row: {
          brand: string;
          category: string;
          createdAt: string;
          deliveryInfo: string;
          details: string;
          isOnSale: string;
          name: string;
          price: number;
          productId: string;
          returnInfo: string;
          salePercentage: number;
          sizes: string[];
        };
        Insert: {
          brand: string;
          category: string;
          createdAt?: string;
          deliveryInfo: string;
          details: string;
          isOnSale: string;
          name: string;
          price: number;
          productId?: string;
          returnInfo: string;
          salePercentage: number;
          sizes: string[];
        };
        Update: {
          brand?: string;
          category?: string;
          createdAt?: string;
          deliveryInfo?: string;
          details?: string;
          isOnSale?: string;
          name?: string;
          price?: number;
          productId?: string;
          returnInfo?: string;
          salePercentage?: number;
          sizes?: string[];
        };
        Relationships: [];
      };
      users: {
        Row: {
          contactNumber: string | null;
          email: string;
          firstName: string | null;
          isAdmin: boolean;
          lastName: string | null;
          userId: string;
        };
        Insert: {
          contactNumber?: string | null;
          email: string;
          firstName?: string | null;
          isAdmin?: boolean;
          lastName?: string | null;
          userId: string;
        };
        Update: {
          contactNumber?: string | null;
          email?: string;
          firstName?: string | null;
          isAdmin?: boolean;
          lastName?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_userId_fkey';
            columns: ['userId'];
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
      updateCartItemQuantity: {
        Args: {
          item_id: string;
          item_quantity: number;
        };
        Returns: undefined;
      };
      verifyUserPassword: {
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
