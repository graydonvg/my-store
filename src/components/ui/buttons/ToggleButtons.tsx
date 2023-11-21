'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, useTheme } from '@mui/material';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: string[];
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const selectedBorderColor = mode === 'dark' ? 'black' : 'white';
  const borderColorHover = mode === 'dark' ? 'white' : 'black';
  const labelColor =
    mode === 'dark' ? customColorPalette.white.opacity.strong : customColorPalette.black.opacity.strong;

  return (
    <ToggleButtonGroup
      aria-required
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
      }}
      value={selection}
      exclusive
      {...props}>
      {buttons.map((button) => {
        return (
          <ToggleButton
            key={button.value}
            sx={{
              height: '56px',
              aspectRatio: 4 / 3,
              '&.MuiToggleButton-root.MuiToggleButtonGroup-grouped': {
                color: labelColor,
                border: `1px solid ${borderColor} !important`,
                borderRadius: '4px !important',
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: labelColor,
                    border: `1px solid ${borderColorHover} !important`,
                  },
                },
              },
              '&.MuiToggleButton-root.Mui-selected': {
                color: 'white',
                borderColor: `${selectedBorderColor} !important`,
                backgroundColor: customColorPalette.blue.light,
                '&:hover': {
                  backgroundColor: customColorPalette.blue.light,
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: 'white',
                    backgroundColor: customColorPalette.blue.light,
                    border: `1px solid ${selectedBorderColor} !important`,
                    filter: 'brightness(1.1)',
                    transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                  },
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
