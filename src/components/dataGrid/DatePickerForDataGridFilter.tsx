import { InputLabel, buttonBaseClasses } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

export default function DatePickerForDataGridFilter({ item, applyValue }: GridFilterInputValueProps) {
  const [isFocused, setIsFocused] = useState(false);

  function handleFilterChange(event: Dayjs | null) {
    applyValue({ ...item, value: event?.format('YYYY/MM/DD') });
  }

  return (
    <>
      <InputLabel
        shrink={true}
        focused={isFocused}>
        Value
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          name="custom-date-filter-operator"
          onChange={handleFilterChange}
          format="YYYY/MM/DD"
          slotProps={{
            textField: { variant: 'standard', onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false) },
            inputAdornment: {
              sx: {
                [`& .${buttonBaseClasses.root}`]: {
                  marginRight: -1,
                },
              },
            },
          }}
          sx={{ marginTop: 2 }}
        />
      </LocalizationProvider>
    </>
  );
}
