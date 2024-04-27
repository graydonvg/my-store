import { Box } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { Dayjs } from 'dayjs';

export default function DatePickerForDataGridFilter(props: GridFilterInputValueProps) {
  const { item, applyValue } = props;

  const handleFilterChange = (event: Dayjs | null) => {
    applyValue({ ...item, value: event?.format('YYYY/MM/DD') });
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          name="custom-date-filter-operator"
          onChange={handleFilterChange}
          format="YYYY/MM/DD"
        />
      </LocalizationProvider>
    </Box>
  );
}
