/* eslint-disable @typescript-eslint/no-explicit-any */
import { SxProps, Theme, useTheme } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import React from 'react';
import { STYLE } from '@/common/constant';
import { StackLabel } from '../../styles/stack.style';
import { IconElement } from '../icon/icon.element';
import { getActionBarSx, getPickerSx, getPopperProps } from '../../styles/picker.style';

export interface TextFieldDateTimeElementProps extends DateTimePickerProps {
  name: string;
  label?: string;
  iconLabel?: string;
  error?: string | boolean;
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

export const TextFieldDateTimeElement: React.FC<TextFieldDateTimeElementProps> = ({
  name,
  label = 'Thời gian',
  iconLabel = 'edit_calendar',
  error = '',
  value = null,
  helperText,
  onChange,
  sx = {},
  required = false,
  disablePast = false,
  disableFuture = false,
  dateRangeInDays = undefined,
  onBlur,
  format = 'DD/MM/YYYY HH:mm',
  ...rest
}) => {
  const { palette } = useTheme();
  const [open, setOpen] = React.useState(false);

  if (disablePast) rest.minDate = dayjs();
  if (disableFuture) rest.maxDate = dayjs();
  if (dateRangeInDays) rest.maxDate = dayjs().add(dateRangeInDays, 'day');

  return (
    <DateTimePicker
      ampm={false}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
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
          //  ...rest
        }: any) => ({
          // ...rest,
          ...inputProps,
          error: Boolean(error),
          helperText: error || (helperText as any),
          InputLabelProps: { shrink: true, sx: { display: 'flex' } },
          fullWidth: true,
          onBlur,
          required,
          onClick: () => setOpen(true),
          inputProps: {
            ...inputProps,
            readOnly: true,
            onClick: () => setOpen(true),
          },
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
