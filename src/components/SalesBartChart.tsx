'use client';

import * as React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { Paper, darken } from '@mui/material';

export default function SalesBarChart() {
  const theme = useTheme();
  const barColors = [theme.palette.primary.dark, theme.palette.primary.main, theme.palette.primary.light];

  return (
    <Paper
      sx={{
        width: '100%',
        padding: 2,
        paddingBottom: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? darken(theme.palette.grey[900], 0.3) : theme.palette.background.paper,
      }}>
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom>
        Page views and sales
      </Typography>
      <Stack sx={{ justifyContent: 'space-between' }}>
        <Stack
          direction="row"
          sx={{
            alignContent: { xs: 'center', sm: 'flex-start' },
            alignItems: 'center',
            gap: 1,
          }}>
          <Typography
            variant="h4"
            component="p">
            1.3M
          </Typography>
          <Chip
            size="small"
            color="error"
            label="-8%"
          />
        </Stack>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary' }}>
          Page views and sales for the last year
        </Typography>
      </Stack>
      <BarChart
        borderRadius={8}
        colors={barColors}
        xAxis={
          [
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
          ] as any
        }
        series={[
          {
            id: 'page-views',
            label: 'Page views',
            data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
            stack: 'A',
          },
          {
            id: 'sales',
            label: 'Sales',
            data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
            stack: 'A',
          },
          {
            id: 'conversions',
            label: 'Conversions',
            data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
            stack: 'A',
          },
        ]}
        height={250}
        margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
    </Paper>
  );
}
