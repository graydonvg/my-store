import { Box, LinearProgress } from '@mui/material';

type ModalProgressBarProps = {
  isLoading: boolean;
};

export default function ModalProgressBar({ isLoading }: ModalProgressBarProps) {
  return <Box sx={{ height: '4px', width: 1, mb: 2 }}>{isLoading ? <LinearProgress sx={{ width: 1 }} /> : null}</Box>;
}
