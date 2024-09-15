import { Box, FormControlLabel, FormGroup, Tooltip, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useState } from 'react';
// import { useAppSelector } from '@/lib/redux/hooks';
// import { selectProductsData } from '@/lib/redux/features/products/productsSelector';

export default function PrimaryColourFilter() {
  const [selectedColors, setSelectedColors] = useState(['']);
  // const productsData = useAppSelector(selectProductsData);

  function toggleColor(color: string) {
    setSelectedColors((prevColors) =>
      prevColors.includes(color) ? prevColors.filter((prevColor) => prevColor !== color) : [...prevColors, color]
    );
  }

  return (
    <ProductsSidebarAccordion
      label="Primary colour"
      defaultExpanded={true}>
      <FormGroup>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Grey', 'Multi'].map((color) => (
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
                      onClick={() => toggleColor(color)}
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
                          outline: '2px solid grey',
                          outlineOffset: 2,
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
