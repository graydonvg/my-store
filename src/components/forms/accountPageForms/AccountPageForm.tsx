import { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { Box } from '@mui/material';
import OutlinedButton from '@/components/ui/buttons/OutlinedButton';
import ContainedButton from '@/components/ui/buttons/ContainedButton';

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  disableSubmit: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
  children: ReactNode;
};

export default function AccountPageForm({ onSubmit, disableSubmit, onCancel, isSubmitting, children }: Props) {
  function handleOnKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter') {
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
          backgroundColor="primary"
          style={{ minWidth: '96px' }}
        />
        <OutlinedButton
          label="cancel"
          fullWidth={false}
          style={{ minWidth: '96px' }}
          onClick={onCancel}
        />
      </Box>
    </Box>
  );
}
