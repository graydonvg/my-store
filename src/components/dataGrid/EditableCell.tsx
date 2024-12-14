import { Box } from '@mui/material';
import CustomTooltip from '../ui/CustomTooltip';
import { Edit } from '@mui/icons-material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function EditableCell({ children }: Props) {
  return (
    <CustomTooltip title="Double-click to edit">
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        {children}
        <Edit
          fontSize="small"
          color="primary"
        />
      </Box>
    </CustomTooltip>
  );
}
