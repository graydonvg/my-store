import { Box } from '@mui/material';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import ContainedButton from '../ui/buttons/ContainedButton';
import { MouseEvent } from 'react';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { AccountTextFieldDataType } from '@/types';

type Props = {
  textFieldData: AccountTextFieldDataType[];
  isUpdating: boolean;
  disableSave: boolean;
  onSave: (event: MouseEvent<HTMLButtonElement> | undefined) => void;
  onCancel: (event: MouseEvent<HTMLButtonElement> | undefined) => void;
};

export default function AccountPageInfoInput({ textFieldData, isUpdating, disableSave, onSave, onCancel }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
      {textFieldData.map((data) => (
        <CustomTextField
          key={data.id}
          fullWidth={true}
          label={data.label}
          name={data.name}
          type={data.type}
          value={data.value}
          onChange={data.onChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              data.onKeyDownFunction();
            }
          }}
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, paddingBottom: 6 }}>
        <ContainedButton
          label={isUpdating ? '' : 'save'}
          disabled={disableSave || isUpdating}
          isLoading={isUpdating}
          fullWidth={false}
          backgroundColor="blue"
          style={{ minWidth: '96px' }}
          onClick={onSave}
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
