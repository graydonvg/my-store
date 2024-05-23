import { constants } from '@/constants';
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
              minHeight: '56px',
              aspectRatio: 4 / 3,
              [`&.${toggleButtonGroupClasses.grouped}`]: {
                color: theme.palette.custom.textField.label,
                border: `2px solid ${theme.palette.custom.textField.border} !important`,
                borderRadius: `${constants.borderRadius} !important`,
                margin: 0,
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.custom.textField.label,
                    border: `2px solid ${theme.palette.custom.textField.hover} !important`,
                  },
                },
              },
              [`&.${toggleButtonClasses.selected}`]: {
                color: theme.palette.text.primary,
                border: `2px solid ${theme.palette.text.primary} !important`,
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '@media (hover: hover)': {
                  '&:hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: 'transparent',
                    border: `2px solid ${theme.palette.text.primary} !important`,
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
