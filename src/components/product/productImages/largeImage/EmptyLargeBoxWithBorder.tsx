import LargeProductImageContainer from './LargeProductImageContainer';
import { Box, Typography } from '@mui/material';
import { CONSTANTS } from '@/constants';

type Props = {
  boxBorderColor: string;
};

export default function EmptyLargeBoxWithBorder({ boxBorderColor }: Props) {
  return (
    <LargeProductImageContainer boxBorderColor={boxBorderColor}>
      <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ color: (theme) => theme.palette.custom.textField.label }}>Upload an image</Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.custom.textField.label }}>
          {`(Max. ${CONSTANTS.MAXIMUM_PRODUCT_IMAGES} images)`}
        </Typography>
      </Box>
    </LargeProductImageContainer>
  );
}
