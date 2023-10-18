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
                backgroundColor: color.grey.dark,
                borderColor: `${color.grey.dark} !important`,
                '&:hover': {
                  color: color.grey.light,
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
