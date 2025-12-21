/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextField, { BaseTextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { STYLE } from '@/common/constant';
import { IconElement } from '../icon/icon.element';
import { StackLabel } from '../../styles/stack.style';
import { PaperSelect } from '../../styles/paper.style';

interface TextFieldSelectSearchElementProps extends Omit<BaseTextFieldProps, 'error'> {
  openTest?: boolean;
  iconLabel?: string;
  error?: string | boolean;
  value?: any;
  multiple?: boolean;
  options: any[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
}

export const TextFieldSelectSearchElement: React.FC<TextFieldSelectSearchElementProps> = ({
  name,
  openTest = false,
  label,
  iconLabel = 'checklist',
  error = '',
  placeholder = 'Tìm kiếm...',
  value,
  multiple = false,
  autoFocus = false,
  disabled = false,
  fullWidth = true,
  helperText,
  options,
  onChange,
  sx = {},
  ...restInput
}) => {
  const change = (_: any, newValue: any) => {
    if (value !== newValue) onChange?.({ target: { name, value: newValue } });
  };

  return (
    <Autocomplete
      openOnFocus
      options={options || []}
      {...(openTest && { open: openTest })}
      sx={{ ...sx }}
      value={value || (multiple ? [] : null)}
      disabled={disabled}
      onChange={change}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      fullWidth={fullWidth}
      clearIcon={<IconElement icon="close_small" />}
      popupIcon={<IconElement icon="arrow_drop_down" />}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true, sx: { display: 'flex' } }}
          label={
            <StackLabel>
              <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
              {label}
            </StackLabel>
          }
          error={Boolean(error)}
          name={name}
          placeholder={placeholder}
          autoFocus={autoFocus}
          variant="outlined"
          helperText={error || helperText}
          {...restInput}
        />
      )}
      PaperComponent={({ children }) => <PaperSelect>{children}</PaperSelect>}
    />
  );
};
