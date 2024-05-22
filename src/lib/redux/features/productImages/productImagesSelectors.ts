import { RootState } from '../../store';

export function selectIsEditImagesDrawerOpen(state: RootState) {
  return state.productImages.isEditImagesDrawerOpen;
}

export function selectIsDeletingImage(state: RootState) {
  return state.productImages.isDeletingImage;
}

export function selectImageUploadProgress(state: RootState) {
  return state.productImages.imageUploadProgress;
}

export function selectImageData(state: RootState) {
  return state.productImages.imageData;
}
