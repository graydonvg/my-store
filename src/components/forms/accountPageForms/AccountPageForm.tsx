import { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { Box } from '@mui/material';
import OutlinedButton from '@/components/ui/buttons/OutlinedButton';
import ContainedButton from '@/components/ui/buttons/ContainedButton';

type Props = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  disableSubmit: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
  children: ReactNode;
};

export default function AccountPageForm({ onSubmit, disableSubmit, onCancel, isSubmitting, children }: Props) {
  function handleOnKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter') {
      onSubmit;
    }
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      onKeyDown={handleOnKeyDown}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, paddingBottom: 4 }}>
        <ContainedButton
          type="submit"
          label={!isSubmitting ? 'save' : ''}
          disabled={disableSubmit}
          isLoading={isSubmitting}
          fullWidth={false}
          color="primary"
          sxStyles={{ minWidth: '96px' }}
        />
        <OutlinedButton
          label="cancel"
          fullWidth={false}
          onClick={onCancel}
          sxStyles={{ minWidth: '96px' }}
        />
      </Box>
    </Box>
  );
}
