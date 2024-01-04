import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type AccordionProps = {
  title: string;
  defaultExpanded: boolean;
  children: ReactNode;
};

export default function AccordionComponent({ title, defaultExpanded, children }: AccordionProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  return (
    <Accordion
      elevation={0}
      disableGutters
      defaultExpanded={defaultExpanded}
      sx={{
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: '0 !important',
        '&:before': {
          display: 'none',
        },
      }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography
          component="h2"
          fontSize={24}
          fontWeight={400}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
