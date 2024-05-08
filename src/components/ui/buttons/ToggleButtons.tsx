import { BORDER_RADIUS } from '@/data';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  toggleButtonClasses,
  toggleButtonGroupClasses,
} from '@mui/material';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  selection: string[];
};

export default function ToggleButtons({ buttons, selection, ...props }: ToggleButtonsProps) {
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
            sx={(theme) => ({
              height: '56px',
              aspectRatio: 4 / 3,
              [`&.${toggleButtonGroupClasses.grouped}`]: {
                color: theme.palette.custom.textField.label,
                border: `1px solid ${theme.palette.custom.textField.border} !important`,
                borderRadius: `${BORDER_RADIUS} !important`,
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.custom.textField.label,
                    border: `1px solid ${theme.palette.custom.textField.hover} !important`,
                  },
                },
              },
              [`&.${toggleButtonClasses.selected}`]: {
                color: theme.palette.primary.contrastText,
                borderColor: `${theme.palette.background.default} !important`,
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.light,
                    border: `1px solid ${theme.palette.background.default} !important`,
                    filter: 'brightness(1.1)',
                    transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                  },
                },
              },
            })}
            value={button.value}
            aria-label={button.value}>
            {button.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
