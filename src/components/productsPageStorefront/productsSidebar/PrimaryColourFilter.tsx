'use client';

import { Box, FormControlLabel, FormGroup, Tooltip, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  colors: string[];
};

const PARAM_NAME = 'colour';

export default function PrimaryColourFilter({ colors }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedColors = searchParams.getAll(PARAM_NAME);

  function applyColorFilterToUrl(color: string) {
    const updatedParams = new URLSearchParams(searchParams);

    if (!selectedColors.includes(color)) {
      updatedParams.append(PARAM_NAME, color);
    } else {
      updatedParams.delete(PARAM_NAME, color);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Primary colour"
      defaultExpanded={true}>
      <FormGroup>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {colors.map((color) => (
            <Box
              key={color}
              sx={{ position: 'relative', width: 18, height: 18 }}>
              <FormControlLabel
                control={<span />}
                label={
                  <Tooltip
                    title={<Typography>{color}</Typography>}
                    placement="top"
                    arrow>
                    <Box
                      onClick={() => applyColorFilterToUrl(color)}
                      sx={{
                        backgroundColor: color,
                        border: '1px solid grey',
                        width: 1,
                        height: 1,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        ...(color === 'Multi' && {
                          background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                        }),
                        ...(selectedColors.includes(color) && {
                          outline: '2px solid',
                          outlineColor: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
                          outlineOffset: 3,
                        }),
                      }}
                    />
                  </Tooltip>
                }
              />
            </Box>
          ))}
        </Box>
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
