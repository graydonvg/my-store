'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, useTheme } from '@mui/material';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: string[];
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;
  const selectedBorderColor = mode === 'dark' ? 'black' : 'white';
  const borderColorHover = mode === 'dark' ? 'white' : 'black';
  const labelColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;

  return (
    <ToggleButtonGroup
      aria-required
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        width: 'fit-content',
      }}
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
                  color: labelColor,
                  border: `1px solid ${borderColorHover} !important`,
                },
              },
              '&.MuiToggleButton-root.Mui-selected': {
                color: color.grey.light,
                backgroundColor: color.blue.light,
                borderColor: `${selectedBorderColor} !important`,
                '&:hover': {
                  color: color.grey.light,
                  backgroundColor: color.blue.light,
                  border: `1px solid ${selectedBorderColor} !important`,
                  filter: 'brightness(1.1)',
                  transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
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
