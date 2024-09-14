import { RootState } from '../../store';

export function selectProductsData(state: RootState) {
  return state.products.data;
}
