import { CartItemType, CurrentUserType } from '@/types';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';

export default async function StateSetters() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: user } = await supabase.from('users').select('*, addresses(*)');

  const userData = user ? user[0] : ({} as CurrentUserType);
  let cartItems = [] as CartItemType[];

  if (user) {
    const { data: cart } = await supabase
      .from('cart')
      .select(
        'created_at, cart_item_id, quantity, size, product: products!inner(name, on_sale, price, sale_percentage, delivery_info, return_info, product_id, sizes,product_image_data!inner(image_url))'
      )
      .order('created_at', { ascending: false });

    cartItems = cart ? cart : ([] as CartItemType[]);
  }

  return (
    <>
      <UserStateSetter
        userData={userData}
        session={session}
      />
      <CartItemsStateSetter cartItems={cartItems} />
    </>
  );
}
