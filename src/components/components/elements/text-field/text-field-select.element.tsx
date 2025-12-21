/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import TextField, { BaseTextFieldProps } from '@mui/material/TextField';
import { MenuItem, useTheme } from '@mui/material';
import { STYLE } from '../../../common/constant';
import { IconElement } from '../icon/icon.element';
import { StackLabel } from '../../styles/stack.style';

interface TextFieldSelectElementProps extends Omit<BaseTextFieldProps, 'error'> {
  openTest?: boolean;
  iconLabel?: string;
  options: any[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean | string;
  multiple?: boolean;
  renderValue?: (selected: any) => React.ReactNode;
  MenuProps?: {
    PaperProps?: {
      style?: {
        maxHeight?: number;
      };
    };
  };
}

export const TextFieldSelectElement: React.FC<TextFieldSelectElementProps> = ({
  openTest = false,
  label,
  iconLabel = 'checklist',
  options,
  onChange,
  error,
  multiple,
  renderValue,
  MenuProps,
  ...rest
}) => {
  const { palette } = useTheme();
  const [open, setOpen] = useState(openTest || false);

  return (
    <TextField
      select
      {...rest}
      error={Boolean(error)}
      helperText={error}
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
      onChange={onChange}
      SelectProps={{
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
        multiple,
        renderValue:
          renderValue ||
          ((selected) => {
            if (multiple) {
              return (selected as any[])
                .map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return option?.label || value;
                })
                .join(', ');
            }
            const option = options.find((opt) => opt.value === selected);
            return option?.label || selected;
          }),
        IconComponent: () => (
          <IconElement
            icon="arrow_drop_down"
            sx={{
              marginRight: '8px',
              transition: 'transform 0.3s',
              color: palette.action.active,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        ),
        MenuProps: {
          ...MenuProps,
          sx: {
            '& .MuiPaper-root': {
              backgroundImage: 'none',
              backgroundColor: palette.background.paper,
              borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
              padding: STYLE.PADDING_GAP_ITEM,
              boxShadow: 1,
              '& > .MuiList-root': {
                padding: 0,
                '& > .MuiMenuItem-root': {
                  padding: STYLE.PADDING_GAP_ITEM,
                  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
                  transition: STYLE.TRANSITION_TIME,
                  '&:hover': {
                    backgroundColor: palette.action.hover,
                  },
                  "&[aria-selected='true']": {
                    backgroundColor: palette.primary.main,
                    color: palette.primary.contrastText,
                  },
                },
              },
            },
          },
          disableScrollLock: true,
        } as any,
      }}
    >
      {options.map((option) => {
        if (typeof option === 'object') {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        }
        return (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
