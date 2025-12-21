/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseTextFieldProps, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { StackLabel } from '../../styles/stack.style';
import { IconElement } from '../icon/icon.element';
import { ChangeEventCustom } from '../../../common/interfaces/change-event-custom.interface';

export interface TextFieldElementProps extends BaseTextFieldProps {
  iconLabel?: string;
  error?: any;
  onChange?: (event: ChangeEventCustom<string>) => void;
  InputProps?: TextFieldProps['InputProps'];
}

export const TextFieldElement: React.FC<TextFieldElementProps> = ({
  name,
  label,
  iconLabel = 'edit_note',
  error = '',
  placeholder = 'Nhập dữ liệu...',
  value,
  helperText,
  rows,
  onChange,
  sx = {},
  InputProps,
  ...rest
}) => {
  if (rest.type === 'number') throw 'Please use component TextFieldNumberElement!';

  const change = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.({ target: { name, value: event.target.value || undefined } });

  return (
    <TextField
      InputLabelProps={{
        shrink: true,
        sx: {
          display: 'flex',
          '& .MuiFormLabel-asterisk': {
            color: 'red',
          },
        },
      }}
      label={
        <StackLabel>
          <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          {label}
        </StackLabel>
      }
      error={Boolean(error)}
      helperText={error || helperText}
      placeholder={placeholder}
      value={value || ''}
      onChange={change}
      name={name}
      InputProps={InputProps}
      {...(rows && { rows, multiline: true })}
      sx={{ ...sx }}
      {...rest}
    />
  );
};
