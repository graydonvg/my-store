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
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          gap: 1,
        }}>
        {children}
        <Box sx={{ marginLeft: 'auto', height: 1, width: 'fit-content' }}>
          <Edit
            fontSize="small"
            color="info"
          />
        </Box>
      </Box>
    </CustomTooltip>
  );
}
