import { SxProps, Theme, useTheme } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { StackLabel } from '../../styles/stack.style';
import { IconElement } from '../icon/icon.element';
import { getActionBarSx, getPickerSx, getPopperProps } from '../../styles/picker.style';

export interface TextFieldDateElementProps extends DatePickerProps {
  name: string;
  label?: string;
  iconLabel?: string;
  error?: unknown;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  helperText?: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  disablePast?: boolean;
  disableFuture?: boolean;
  dateRangeInDays?: number;
  onBlur?: (e: React.FocusEvent<any>) => void;
  minDate?: any;
  maxDate?: any;
}

export const TextFieldDateElement: React.FC<TextFieldDateElementProps> = ({
  name,
  label = 'Ngày',
  iconLabel = 'calendar_today',
  error = '',
  value = null,
  helperText,
  onChange,
  sx = {},
  format = 'DD/MM/YYYY',
  required = false,
  disablePast = false,
  disableFuture = false,
  dateRangeInDays = undefined,
  onBlur,
  ...rest
}) => {
  const { palette } = useTheme();

  if (disablePast) rest.minDate = dayjs();
  if (disableFuture) rest.maxDate = dayjs();
  if (dateRangeInDays) rest.maxDate = dayjs().add(dateRangeInDays, 'day');

  return (
    <DatePicker
      key={value ? dayjs(value).format('YYYY-MM-DD') : 'empty'}
      defaultValue={value ? dayjs(value) : null}
      onAccept={(newVal) => onChange?.({ target: { name, value: newVal } })}
      format={format}
      name={name}
      label={
        <StackLabel>
          <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
          {label}
        </StackLabel>
      }
      slots={{ openPickerIcon: () => <IconElement icon="calendar_today" /> }}
      slotProps={{
        textField: ({
          inputProps,
          // ...rest
        }: any) => ({
          // ...rest,
          ...inputProps,
          error: Boolean(error),
          helperText: error || (helperText as any),
          InputLabelProps: { shrink: true, sx: { display: 'flex' } },
          fullWidth: true,
          onBlur,
          required,
        }),
        popper: getPopperProps() as any,
        actionBar: { sx: getActionBarSx(palette) },
      }}
      sx={getPickerSx(palette, sx)}
      {...rest}
      minDate={rest.minDate}
      maxDate={rest.maxDate}
    />
  );
};
