/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FormControl, RadioGroup } from '@mui/material';
import React, { ReactNode } from 'react';
import { STYLE } from '@/common/constant';
import { InputLabel } from '@mui/material';
import { IconElement } from '../icon/icon.element';
import { StackLabel } from '../../styles/stack.style';

export interface RadioGroupElementProps {
  name?: string;
  direction?: 'row' | 'column';
  label?: string;
  iconLabel?: string;
  disabled?: boolean;
  defaultValue?: any;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  children: ReactNode;
  required?: boolean;
}

export const RadioGroupElement: React.FC<RadioGroupElementProps> = ({
  name,
  direction = 'row',
  label,
  disabled,
  iconLabel = 'event_list',
  defaultValue,
  value,
  onChange,
  children,
  required = false,
}) => {
  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange({ target: { name, value: event.target.value || undefined } });
  };

  return (
    <FormControl disabled={disabled} sx={{ gap: STYLE.PADDING_GAP_ITEM }} onChange={change}>
      {label && (
        <InputLabel
          shrink
          required={required}
          sx={{
            transform: 'translate(0px , -9px) scale(0.75)',
            zIndex: 2,
            display: 'flex',
          }} // Số này lấy từ default theme
        >
          <StackLabel>
            <IconElement icon={iconLabel} sx={{ fontSize: STYLE.TEXT_FIELD.FONT_SIZE_LABEL }} />
            {label}
          </StackLabel>
        </InputLabel>
      )}
      <RadioGroup
        name={name}
        defaultValue={defaultValue}
        value={value}
        sx={{
          flexDirection: direction,
          paddingTop: label ? 'calc(8.5px + 1.5px)' : 0, // 8.5 lấy từ default theme không phải tự nhiên mà có
          gap: STYLE.PADDING_GAP_LAYOUT,
        }}
      >
        {children}
      </RadioGroup>
    </FormControl>
  );
};
