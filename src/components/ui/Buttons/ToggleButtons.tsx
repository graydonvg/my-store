'use client';

import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { ReactNode } from 'react';

type ToggleButtonsProps = ToggleButtonGroupProps & {
  buttons: { label: string; value: string }[];
  labelAndBorderColor: string;
  hoverBorderColor: string;
  selectedLabelColor: string;
  selectedBackgroundColor: string;
  selectedHoverBackgroundColor: string;
  selectedBorderColor: string;
  selection: ReactNode;
};

export default function ToggleButtons({
  buttons,
  labelAndBorderColor,
  hoverBorderColor,
  selectedLabelColor,
  selectedBackgroundColor,
  selectedHoverBackgroundColor,
  selectedBorderColor,
  selection,
  ...props
}: ToggleButtonsProps) {
  return (
    <ToggleButtonGroup
      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      value={selection}
      exclusive
      {...props}>
      {buttons.map((button) => {
        return (
          <ToggleButton
            key={button.value}
            sx={{
              padding: '8px 24px',
              '&.MuiToggleButtonGroup-grouped': {
                color: labelAndBorderColor,
                border: `1px solid ${labelAndBorderColor} !important`,
                borderRadius: '4px !important',
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderColor: `${hoverBorderColor} !important`,
                },
              },
              '&.Mui-selected': {
                color: selectedLabelColor,
                backgroundColor: selectedBackgroundColor,
                borderColor: `${selectedBorderColor} !important`,
                '&:hover': {
                  backgroundColor: selectedHoverBackgroundColor,
                  opacity: '90%',
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
