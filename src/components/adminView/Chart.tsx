import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import CardTitleAdminView from './CardTitleAdminView';
import { Box } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';

// Generate Sales Data
function createData(time: string, amount?: number): { time: string; amount: number | null } {
  return { time, amount: amount ?? null };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 6000),
  createData('06:00', 12000),
  createData('09:00', 24000),
  createData('12:00', 60000),
  createData('15:00', 82000),
  createData('18:00', 96000),
  createData('21:00', 96000),
  createData('24:00'),
];

export default function Chart() {
  const theme = useTheme();
  const colorPalette = useColorPalette();

  return (
    <>
      <CardTitleAdminView>Today</CardTitleAdminView>
      <Box sx={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 80,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
            },
          ]}
          yAxis={[
            {
              label: 'Sales (R)',
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              max: 100000,
              tickNumber: 4,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: colorPalette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: colorPalette.typographyVariants.grey },
            [`.${axisClasses.root} text`]: { fill: colorPalette.typographyVariants.grey },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-35px)',
            },
          }}
        />
      </Box>
    </>
  );
}