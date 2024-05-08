'use client';

import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { BORDER_RADIUS } from '@/data';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const searchByOptions = ['ID', 'Name'];

export default function Seachbar() {
  const [searchBy, setSearchBy] = useState(searchByOptions[0]);
  const [selectInteracted, setSelectInteracted] = useState(false);
  const [textFieldFocused, setTextFieldFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  // const debouncedSearchInput = useDebounce(searchInput, 1000);
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (textFieldRef.current && searchBy && selectInteracted) {
      textFieldRef.current.focus();
      setSelectInteracted(false);
    }
  }, [searchBy, selectInteracted]);

  function handleSelectChange(event: SelectChangeEvent<string>) {
    setSearchBy(event.target.value);
    setSelectInteracted(true);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSearchInput(event.target.value);
  }

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS,
        height: theme.spacing(5),
        border: !textFieldFocused
          ? `1px solid ${theme.palette.custom.textField.border}`
          : `1px solid ${theme.palette.custom.textField.focused}`,
      })}>
      <Select
        variant="outlined"
        value={searchBy}
        onChange={handleSelectChange}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        sx={{
          height: 1,
          borderRadius: BORDER_RADIUS,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          // backgroundColor: (theme) =>
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderRight: (theme) => `1px solid ${theme.palette.custom.border}`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderRight: (theme) => `1px solid ${theme.palette.custom.textField.focused}`,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderRight: (theme) => `1px solid ${theme.palette.custom.border}`,
          },
          '& .MuiSelect-select': {
            paddingY: 0,
            paddingX: 2,
          },
        }}>
        {searchByOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Box
        sx={{
          position: 'relative',
          width: 1,
          borderRadius: BORDER_RADIUS,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}>
        <Box
          sx={{
            position: 'absolute',
            height: 1,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingY: 0,
            paddingRight: 2,
            right: 0,
          }}>
          <SearchIcon />
        </Box>
        <InputBase
          placeholder="Search..."
          sx={{
            color: 'inherit',
            width: 1,
            '& .MuiInputBase-input': {
              paddingTop: 1,
              paddingLeft: 1,
              paddingBottom: 1,
              paddingRight: (theme) => `calc(1em + ${theme.spacing(4)})`,
            },
          }}
          inputRef={textFieldRef}
          onChange={handleInputChange}
          value={searchInput}
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
        />
      </Box>
    </Box>
  );
}
