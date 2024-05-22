import { RootState } from '../../store';

export function selectProductFormData(state: RootState) {
  return state.productForm.productFormData;
}

export function selectIsProductFormSubmitting(state: RootState) {
  return state.productForm.isSubmitting;
}
