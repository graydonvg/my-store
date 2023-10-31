import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { LinearProgress } from '@mui/material';

type LoadingBarProps = {
  style?: Record<string, string | number>;
  isLoading: boolean;
};

export default function LoadingBar({ style, isLoading }: LoadingBarProps) {
  const color = useCustomColorPalette();
  return (
    <>
      {isLoading ? (
        <LinearProgress
          sx={{
            ...style,
          }}
        />
      ) : null}
    </>
  );
}
