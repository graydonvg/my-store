import { Box, Typography } from '@mui/material';

type Props = {
  text: string;
  headerComponent: 'h1' | 'h2';
};

export default function FormHeader({ text, headerComponent }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingY: 2,
        paddingLeft: 3,
        paddingRight: 5,
        width: 1,
        minHeight: '64px',
        backgroundColor: (theme) => theme.palette.custom.dialog.background.accent,
      }}>
      <Typography
        component={headerComponent}
        variant="h5">
        {text}
      </Typography>
    </Box>
  );
}
