'use client';

import { ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';
import { MouseEvent, useState } from 'react';

type ToggleButtonsProps = {
  buttons: { label: string; value: string }[];
  labelAndBorderColor: string;
  selectedLabelColor: string;
  selectedBackgroundColor: string;
  selectedBorderColor: string;
  hoverBackgroundColor: string;
  groupAriaLabel: string;
};

export default function ToggleButtons({
  groupAriaLabel,
  buttons,
  labelAndBorderColor,
  selectedLabelColor,
  selectedBackgroundColor,
  selectedBorderColor,
  hoverBackgroundColor,
}: ToggleButtonsProps) {
  const [selection, setSelection] = useState<string | null>('');

  function handleSelection(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, newSelection: string | null) {
    setSelection(newSelection);
  }

  return (
    <ToggleButtonGroup
      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      value={selection}
      exclusive
      onChange={handleSelection}
      aria-label={groupAriaLabel}>
      {buttons.map((button) => {
        return (
          <ToggleButton
            key={button.value}
            sx={{
              padding: '8px 24px',
              '&:hover': {
                borderColor: 'blue',
              },
              '&.MuiToggleButtonGroup-grouped': {
                color: labelAndBorderColor,
                border: `1px solid ${labelAndBorderColor} !important`,
                borderRadius: '4px !important',
              },
              '&.Mui-selected': {
                color: selectedLabelColor,
                backgroundColor: selectedBackgroundColor,
                borderColor: `${selectedBorderColor} !important`,
                '&:hover': {
                  backgroundColor: hoverBackgroundColor,
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
