'use client';

import Typography from '@mui/material/Typography';
import CardTitleAdminView from './CardTitleAdminView';
import { formatCurrency } from '@/utils/formatCurrency';
import useColorPalette from '@/hooks/useColorPalette';

function getFirstDayOfWeek() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const diff = currentDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1);
  const firstDay = new Date(currentDate.setDate(diff));
  return firstDay;
}

function getLastDayOfWeek() {
  const firstDay = getFirstDayOfWeek();
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  return lastDay;
}

function formatDay(date: Date) {
  let day = date.getDate();
  const monthIndex = date.getMonth();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[monthIndex];
  if (day < 10) {
    day = Number('0' + day);
  }
  return `${day} ${month}`;
}

export default function TotalSales() {
  const colorPalette = useColorPalette();
  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = getLastDayOfWeek();
  const formattedFirstDay = formatDay(firstDayOfWeek);
  const formattedLastDay = formatDay(lastDayOfWeek);

  return (
    <>
      <CardTitleAdminView>Weekly Sales</CardTitleAdminView>
      <Typography
        component="p"
        variant="h4">
        {formatCurrency(895479)}
      </Typography>
      <Typography
        color={colorPalette.typographyVariants.grey}
        sx={{ flex: 1 }}>
        {`${formattedFirstDay} - ${formattedLastDay}`}
      </Typography>
    </>
  );
}
