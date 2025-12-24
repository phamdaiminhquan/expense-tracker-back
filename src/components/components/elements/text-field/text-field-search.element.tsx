import { STYLE } from '@/common/constant';
import { TextField, debounce, BaseTextFieldProps } from '@mui/material';
import React from 'react';
import { IconElement } from '../icon/icon.element';
import { StackLabel } from '../../styles/stack.style';
import { ChangeEventCustom } from '@/common/interfaces/change-event-custom.interface';

export interface TextFieldSearchElementProps extends BaseTextFieldProps {
  onChange?: (event: ChangeEventCustom<string>) => void;
}

export const TextFieldSearchElement: React.FC<TextFieldSearchElementProps> = ({
  placeholder = 'Tìm kiếm...',
  rows,
  onChange,
  sx = {},
  ...rest
}) => {
  const change = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ target: { name: 'search', value: event.target.value || undefined } });
  }, 500);

  return (
    <TextField
      InputLabelProps={{ shrink: true, sx: { display: 'flex' } }}
      label={
        <StackLabel>
          <IconElement icon="search" sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          Tìm kiếm
        </StackLabel>
      }
      {...rest}
      placeholder={placeholder}
      onChange={change}
      name="search"
      {...(rows && { rows, multiline: true })}
      sx={{ ...sx }}
    />
  );
};
