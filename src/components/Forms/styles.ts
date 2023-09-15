export const textFieldStyles = {
  '& label.Mui-focused': {
    color: 'custom.blue.light',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'custom.blue.dark',
      color: 'custom.blue.dark',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'custom.blue.light',
    },
  },
};

export const buttonStyles = {
  backgroundColor: 'custom.blue.dark',
  '&:hover': { backgroundColor: 'custom.blue.light' },
};
