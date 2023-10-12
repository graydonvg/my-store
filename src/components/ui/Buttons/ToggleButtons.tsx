'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: ReactNode;
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
  const borderColorHover = mode === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
  const labelColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  const labelColorHover = mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';

  return (
    <ToggleButtonGroup
      aria-required
      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      value={selection}
      exclusive
      {...props}>
      {buttons.map((button) => {
        return (
          <ToggleButton
            key={button.value}
            sx={{
              height: '48px',
              width: '88px',
              '&.MuiToggleButton-root.MuiToggleButtonGroup-grouped': {
                color: labelColor,
                border: `1px solid ${borderColor} !important`,
                borderRadius: '4px !important',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: labelColorHover,
                  border: `1px solid ${borderColorHover} !important`,
                },
              },
              '&.MuiToggleButton-root.Mui-selected': {
                color: color.grey.light,
                backgroundColor: color.grey.dark,
                borderColor: `${color.grey.dark} !important`,
                '&:hover': {
                  color: 'rgba(255, 255, 255, 1)',
                  backgroundColor: color.grey.dark,
                  border: `1px solid ${color.grey.dark} !important`,
                  opacity: '95%',
                },
              },
            }}
            value={button.value}
            aria-label={button.value}>
            {button.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
