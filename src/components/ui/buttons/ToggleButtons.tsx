'use client';

import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: string[];
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
  const customColorPalette = useCustomColorPalette();

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
                color: customColorPalette.textField.label,
                border: `1px solid ${customColorPalette.border} !important`,
                borderRadius: `${borderRadius} !important`,
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: customColorPalette.textField.label,
                    border: `1px solid ${customColorPalette.textField.hover} !important`,
                  },
                },
              },
              '&.MuiToggleButton-root.Mui-selected': {
                color: customColorPalette.typographyVariants.white,
                borderColor: (theme) => `${theme.palette.background.default} !important`,
                backgroundColor: customColorPalette.primary.light,
                '&:hover': {
                  backgroundColor: customColorPalette.primary.light,
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: customColorPalette.typographyVariants.white,
                    backgroundColor: customColorPalette.primary.light,
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
