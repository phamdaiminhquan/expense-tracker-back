/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseTextFieldProps, TextField } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { STYLE } from '../../../common/constant';
import { StackLabel } from '../../styles/stack.style';
import { IconElement } from '../icon/icon.element';

export interface TextFieldNumberElementProps extends Omit<BaseTextFieldProps, 'error'> {
  iconLabel?: string;
  error?: string | boolean;
  placeholder?: string;
  value?: any;
  onChange?: (event: { target: { name?: string; value: any } }) => void;
  decimalScale?: number;
  max?: number;
}

export const TextFieldNumberElement: React.FC<TextFieldNumberElementProps> = ({
  name,
  label,
  iconLabel = 'edit_note',
  error = '',
  placeholder = 'Nhập số...',
  value,
  helperText,
  onChange,
  sx = {},
  decimalScale = 0,
  max,
  ...rest
}) => {
  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator=","
      decimalSeparator="."
      max={max}
      decimalScale={decimalScale} // Giữ tối đa decimalScale số sau dấu thập phân
      fixedDecimalScale
      allowNegative={false}
      value={value}
      onValueChange={(values: any) => onChange?.({ target: { name, value: values.floatValue || 0 } })}
      InputLabelProps={{ shrink: true, sx: { display: 'flex' } }}
      label={
        <StackLabel>
          <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          {label}
        </StackLabel>
      }
      error={Boolean(error)}
      helperText={error || helperText}
      placeholder={placeholder}
      sx={{ ...sx }}
      {...(rest as any)}
    />
  );
};
