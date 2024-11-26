import { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { Box } from '@mui/material';
import OutlinedButton from '@/components/ui/buttons/OutlinedButton';
import ContainedButton from '@/components/ui/buttons/ContainedButton';

type Props = {
  onSubmit: (e: FormEvent<Element>) => void;
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
      noValidate
      onSubmit={onSubmit}
      onKeyDown={handleOnKeyDown}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, flexWrap: 'wrap', paddingBottom: 4 }}>
        <OutlinedButton
          label="cancel"
          fullWidth={true}
          onClick={onCancel}
          sxStyles={{ minWidth: 'fit-content', flex: 1 }}
        />
        <ContainedButton
          type="submit"
          label={!isSubmitting ? 'save' : ''}
          disabled={disableSubmit}
          isLoading={isSubmitting}
          fullWidth={true}
          color="secondary"
          sxStyles={{ minWidth: 'fit-content', flex: 1 }}
        />
      </Box>
    </Box>
  );
}
