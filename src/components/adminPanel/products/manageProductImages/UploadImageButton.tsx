import { Input, InputProps } from '@mui/material';
import ContainedButton from '../../../ui/buttons/ContainedButton';
import { CloudUpload } from '@mui/icons-material';

type Props = {
  uploadInProgress: boolean;
  isSubmitting: boolean;
} & InputProps;

export default function UploadImageButton({ uploadInProgress, isSubmitting, ...InputProps }: Props) {
  return (
    <ContainedButton
      tabIndex={-1}
      color="primary"
      label={
        <>
          {!uploadInProgress ? 'upload images' : ''}
          <Input
            inputProps={{ accept: 'image/*', multiple: true }}
            type="file"
            sx={{
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
              bottom: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 1,
            }}
            {...InputProps}
          />
        </>
      }
      isLoading={uploadInProgress}
      disabled={isSubmitting}
      startIcon={<CloudUpload />}
      fullWidth
      component="label"
    />
  );
}
