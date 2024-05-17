import { BORDER_RADIUS } from '@/data';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  alpha,
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
                color: theme.palette.warning.light,
                borderColor: `${theme.palette.warning.light} !important`,
                backgroundColor: alpha(theme.palette.warning.light, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.warning.light, 0.1),
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: theme.palette.warning.light,
                    backgroundColor: alpha(theme.palette.warning.light, 0.1),
                    border: `1px solid ${theme.palette.warning.light} !important`,
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
