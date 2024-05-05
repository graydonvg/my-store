export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          addressId: string;
          city: string;
          complexOrBuilding: string | null;
          createdAt: string;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          streetAddress: string;
          suburb: string;
          userId: string;
        };
        Insert: {
          addressId?: string;
          city: string;
          complexOrBuilding?: string | null;
          createdAt?: string;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          streetAddress: string;
          suburb: string;
          userId?: string;
        };
        Update: {
          addressId?: string;
          city?: string;
          complexOrBuilding?: string | null;
          createdAt?: string;
          postalCode?: number;
          province?: string;
          recipientContactNumber?: string;
          recipientFirstName?: string;
          recipientLastName?: string;
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
      admins: {
        Row: {
          adminId: string;
          createdAt: string;
          userId: string;
        };
        Insert: {
          adminId?: string;
          createdAt?: string;
          userId?: string;
        };
        Update: {
          adminId?: string;
          createdAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_admins_userId_fkey';
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
          userId?: string;
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
      managers: {
        Row: {
          createdAt: string;
          managerId: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          managerId?: string;
          userId?: string;
        };
        Update: {
          createdAt?: string;
          managerId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'owners_userId_fkey';
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
          userId?: string;
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
          userId?: string;
        };
        Update: {
          cartTotal?: number;
          createdAt?: string;
          deliveryFee?: number;
          discountTotal?: number;
          isPaid?: boolean;
          orderId?: string;
          orderTotal?: number;
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
          index: number;
          productId: string;
          productImageId: string;
        };
        Insert: {
          createdAt?: string;
          fileName: string;
          imageUrl: string;
          index: number;
          productId: string;
          productImageId?: string;
        };
        Update: {
          createdAt?: string;
          fileName?: string;
          imageUrl?: string;
          index?: number;
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
      rolePermissions: {
        Row: {
          permission: Database['public']['Enums']['appPermission'];
          permissionId: number;
          role: Database['public']['Enums']['appRole'];
        };
        Insert: {
          permission: Database['public']['Enums']['appPermission'];
          permissionId?: number;
          role: Database['public']['Enums']['appRole'];
        };
        Update: {
          permission?: Database['public']['Enums']['appPermission'];
          permissionId?: number;
          role?: Database['public']['Enums']['appRole'];
        };
        Relationships: [];
      };
      shippingDetails: {
        Row: {
          city: string;
          complexOrBuilding: string | null;
          orderId: string;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          shippingDetailsId: string;
          streetAddress: string;
          suburb: string;
          userId: string;
        };
        Insert: {
          city: string;
          complexOrBuilding?: string | null;
          orderId: string;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          shippingDetailsId?: string;
          streetAddress: string;
          suburb: string;
          userId?: string;
        };
        Update: {
          city?: string;
          complexOrBuilding?: string | null;
          orderId?: string;
          postalCode?: number;
          province?: string;
          recipientContactNumber?: string;
          recipientFirstName?: string;
          recipientLastName?: string;
          shippingDetailsId?: string;
          streetAddress?: string;
          suburb?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shippingDetails_orderId_fkey';
            columns: ['orderId'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['orderId'];
          },
          {
            foreignKeyName: 'shippingDetails_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      userRoles: {
        Row: {
          role: Database['public']['Enums']['appRole'];
          roleId: number;
          userId: string;
        };
        Insert: {
          role: Database['public']['Enums']['appRole'];
          roleId?: number;
          userId: string;
        };
        Update: {
          role?: Database['public']['Enums']['appRole'];
          roleId?: number;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'userRoles_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      users: {
        Row: {
          contactNumber: string | null;
          createdAt: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          userId: string;
        };
        Insert: {
          contactNumber?: string | null;
          createdAt?: string;
          email: string;
          firstName?: string | null;
          lastName?: string | null;
          userId: string;
        };
        Update: {
          contactNumber?: string | null;
          createdAt?: string;
          email?: string;
          firstName?: string | null;
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
      wishlist: {
        Row: {
          createdAt: string;
          productId: string;
          size: string;
          userId: string;
          wishlistItemId: string;
        };
        Insert: {
          createdAt?: string;
          productId?: string;
          size: string;
          userId?: string;
          wishlistItemId?: string;
        };
        Update: {
          createdAt?: string;
          productId?: string;
          size?: string;
          userId?: string;
          wishlistItemId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_wishlist_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['productId'];
          },
          {
            foreignKeyName: 'public_wishlist_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database['public']['Enums']['appPermission'];
        };
        Returns: boolean;
      };
      custom_access_token_hook: {
        Args: {
          event: Json;
        };
        Returns: Json;
      };
      verifyUserPassword: {
        Args: {
          password: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      appPermission:
        | 'addresses.all'
        | 'addresses.insert'
        | 'addresses.select'
        | 'addresses.update'
        | 'addresses.delete'
        | 'cart.all'
        | 'cart.insert'
        | 'cart.select'
        | 'cart.update'
        | 'cart.delete'
        | 'orderItems.all'
        | 'orderItems.insert'
        | 'orderItems.select'
        | 'orderItems.update'
        | 'orderItems.delete'
        | 'orders.all'
        | 'orders.insert'
        | 'orders.select'
        | 'orders.update'
        | 'orders.delete'
        | 'productImageData.all'
        | 'productImageData.insert'
        | 'productImageData.select'
        | 'productImageData.update'
        | 'productImageData.delete'
        | 'products.all'
        | 'products.insert'
        | 'products.select'
        | 'products.update'
        | 'products.delete'
        | 'shippingDetails.all'
        | 'shippingDetails.insert'
        | 'shippingDetails.select'
        | 'shippingDetails.update'
        | 'shippingDetails.delete'
        | 'users.all'
        | 'users.insert'
        | 'users.select'
        | 'users.update'
        | 'users.delete'
        | 'wishlist.all'
        | 'wishlist.insert'
        | 'wishlist.select'
        | 'wishlist.update'
        | 'wishlist.delete';
      appRole: 'owner' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
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
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
