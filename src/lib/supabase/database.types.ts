export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          addressId: number;
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
          addressId?: number;
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
          addressId?: number;
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
      cart: {
        Row: {
          cartItemId: number;
          createdAt: string;
          productId: number;
          quantity: number;
          size: string;
          userId: string;
        };
        Insert: {
          cartItemId?: number;
          createdAt?: string;
          productId: number;
          quantity: number;
          size: string;
          userId?: string;
        };
        Update: {
          cartItemId?: number;
          createdAt?: string;
          productId?: number;
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
          orderId: number;
          orderItemId: number;
          pricePaid: number;
          productId: number;
          quantity: number;
          size: string;
          userId: string;
        };
        Insert: {
          orderId: number;
          orderItemId?: number;
          pricePaid: number;
          productId: number;
          quantity: number;
          size: string;
          userId?: string;
        };
        Update: {
          orderId?: number;
          orderItemId?: number;
          pricePaid?: number;
          productId?: number;
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
          orderId: number;
          orderStatus: Database['public']['Enums']['orderStatus'];
          orderTotal: number;
          userId: string;
        };
        Insert: {
          cartTotal: number;
          createdAt?: string;
          deliveryFee: number;
          discountTotal: number;
          orderId?: number;
          orderStatus: Database['public']['Enums']['orderStatus'];
          orderTotal: number;
          userId?: string;
        };
        Update: {
          cartTotal?: number;
          createdAt?: string;
          deliveryFee?: number;
          discountTotal?: number;
          orderId?: number;
          orderStatus?: Database['public']['Enums']['orderStatus'];
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
      pendingCheckoutSessions: {
        Row: {
          orderId: number;
          rowId: number;
          sessionId: string;
          userId: string;
        };
        Insert: {
          orderId: number;
          rowId?: number;
          sessionId: string;
          userId?: string;
        };
        Update: {
          orderId?: number;
          rowId?: number;
          sessionId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pendingCheckoutSessions_orderId_fkey';
            columns: ['orderId'];
            isOneToOne: true;
            referencedRelation: 'orders';
            referencedColumns: ['orderId'];
          },
          {
            foreignKeyName: 'pendingCheckoutSessions_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['userId'];
          }
        ];
      };
      productImageData: {
        Row: {
          fileName: string;
          imageIndex: number;
          imageUrl: string;
          productId: number;
          productImageId: number;
        };
        Insert: {
          fileName: string;
          imageIndex: number;
          imageUrl: string;
          productId: number;
          productImageId?: number;
        };
        Update: {
          fileName?: string;
          imageIndex?: number;
          imageUrl?: string;
          productId?: number;
          productImageId?: number;
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
          category: Database['public']['Enums']['productCategory'];
          createdAt: string;
          deliveryInfo: string;
          details: string;
          isOnSale: boolean;
          name: string;
          price: number;
          productId: number;
          returnInfo: string;
          salePercentage: number;
          sizes: string[];
        };
        Insert: {
          brand: string;
          category: Database['public']['Enums']['productCategory'];
          createdAt?: string;
          deliveryInfo: string;
          details: string;
          isOnSale?: boolean;
          name: string;
          price: number;
          productId?: number;
          returnInfo: string;
          salePercentage: number;
          sizes: string[];
        };
        Update: {
          brand?: string;
          category?: Database['public']['Enums']['productCategory'];
          createdAt?: string;
          deliveryInfo?: string;
          details?: string;
          isOnSale?: boolean;
          name?: string;
          price?: number;
          productId?: number;
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
          orderId: number;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          shippingDetailId: number;
          streetAddress: string;
          suburb: string;
          userId: string;
        };
        Insert: {
          city: string;
          complexOrBuilding?: string | null;
          orderId: number;
          postalCode: number;
          province: string;
          recipientContactNumber: string;
          recipientFirstName: string;
          recipientLastName: string;
          shippingDetailId?: number;
          streetAddress: string;
          suburb: string;
          userId?: string;
        };
        Update: {
          city?: string;
          complexOrBuilding?: string | null;
          orderId?: number;
          postalCode?: number;
          province?: string;
          recipientContactNumber?: string;
          recipientFirstName?: string;
          recipientLastName?: string;
          shippingDetailId?: number;
          streetAddress?: string;
          suburb?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shippingDetails_orderId_fkey';
            columns: ['orderId'];
            isOneToOne: true;
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
            isOneToOne: true;
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
          productId: number;
          size: string;
          userId: string;
          wishlistItemId: number;
        };
        Insert: {
          createdAt?: string;
          productId: number;
          size: string;
          userId?: string;
          wishlistItemId?: number;
        };
        Update: {
          createdAt?: string;
          productId?: number;
          size?: string;
          userId?: string;
          wishlistItemId?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'wishlist_productId_fkey';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['productId'];
          },
          {
            foreignKeyName: 'wishlist_userId_fkey';
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
      addOrder: {
        Args: {
          order_details: Json;
          order_items: Json;
          shipping_details: Json;
        };
        Returns: number;
      };
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
      filterProducts:
        | {
            Args: {
              p_category?: string;
              p_brands?: string[];
              p_sizes?: string[];
              p_min_price?: number;
              p_max_price?: number;
            };
            Returns: {
              productId: number;
              createdAt: string;
              category: Database['public']['Enums']['productCategory'];
              name: string;
              brand: string;
              details: string;
              price: number;
              isOnSale: boolean;
              salePercentage: number;
              sizes: string[];
              deliveryInfo: string;
              returnInfo: string;
              productImageData: Json;
            }[];
          }
        | {
            Args: {
              p_category?: string;
              p_brands?: string[];
              p_sizes?: string[];
              p_min_price?: number;
              p_max_price?: number;
              p_on_sale?: boolean;
            };
            Returns: {
              productId: number;
              createdAt: string;
              category: Database['public']['Enums']['productCategory'];
              name: string;
              brand: string;
              details: string;
              price: number;
              isOnSale: boolean;
              salePercentage: number;
              sizes: string[];
              deliveryInfo: string;
              returnInfo: string;
              productImageData: Json;
            }[];
          };
      getBestSellers: {
        Args: Record<PropertyKey, never>;
        Returns: {
          productId: number;
          totalQuantitySold: number;
        }[];
      };
      getProductFilterOptions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          distinctBrands: string[];
          distinctSizes: string[];
          highestPrices: Json;
        }[];
      };
      updateProductWithImages: {
        Args: {
          product_data: Json;
          image_data: Json[];
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
        | 'wishlist.delete'
        | 'userRoles.insert'
        | 'userRoles.select'
        | 'userRoles.update'
        | 'userRoles.delete';
      appRole: 'owner' | 'admin' | 'manager';
      orderStatus:
        | 'awaiting payment'
        | 'paid'
        | 'processing'
        | 'shipped'
        | 'delivered'
        | 'cancelled'
        | 'returned'
        | 'refunded';
      productCategory: 'Men' | 'Women' | 'Kids';
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
