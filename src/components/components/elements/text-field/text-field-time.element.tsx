/* eslint-disable @typescript-eslint/no-explicit-any */
import { SxProps, Theme, useTheme } from '@mui/material';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { StackLabel } from '../../styles/stack.style';
import { IconElement } from '../icon/icon.element';
import { getActionBarSx, getPickerSx, getPopperProps } from '../../styles/picker.style';

export interface TextFieldTimeElementProps extends TimePickerProps {
  name: string;
  label?: string;
  iconLabel?: string;
  error?: string | boolean;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  helperText?: string;
  required?: boolean;
  sx?: SxProps<Theme>;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

export const TextFieldTimeElement: React.FC<TextFieldTimeElementProps> = ({
  name,
  label = 'Thời gian',
  iconLabel = 'schedule',
  error = '',
  value = null,
  helperText,
  onChange,
  sx = {},
  required = false,
  onBlur,
  format = 'HH:mm',
  ...rest
}) => {
  const { palette } = useTheme();

  const onAccept = (newValue: Dayjs | null) => onChange?.({ target: { name, value: newValue } });

  return (
    <TimePicker
      defaultValue={value ? dayjs(value) : null}
      onAccept={onAccept}
      format={format}
      name={name}
      {...rest}
      slots={{ openPickerIcon: () => <IconElement icon="schedule" /> }}
      slotProps={{
        textField: {
          fullWidth: true,
          onBlur,
          error: Boolean(error),
          helperText,
          InputLabelProps: { shrink: true, sx: { display: 'flex' } },
          required,
          label: (
            <StackLabel>
              <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
              {label}
            </StackLabel>
          ),
        },
        popper: getPopperProps() as any,
        actionBar: { sx: getActionBarSx(palette) },
      }}
      sx={getPickerSx(palette, sx)}
    />
  );
};
