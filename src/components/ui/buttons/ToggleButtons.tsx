'use client';

import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: string[];
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
  const colorPalette = useColorPalette();

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
                color: colorPalette.textField.label,
                border: `1px solid ${colorPalette.textField.border} !important`,
                borderRadius: `${BORDER_RADIUS} !important`,
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: colorPalette.textField.label,
                    border: `1px solid ${colorPalette.textField.hover} !important`,
                  },
                },
              },
              '&.MuiToggleButton-root.Mui-selected': {
                color: colorPalette.typographyVariants.white,
                borderColor: (theme) => `${theme.palette.background.default} !important`,
                backgroundColor: colorPalette.primary.light,
                '&:hover': {
                  backgroundColor: colorPalette.primary.light,
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: colorPalette.typographyVariants.white,
                    backgroundColor: colorPalette.primary.light,
                    border: (theme) => `1px solid ${theme.palette.background.default} !important`,
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
