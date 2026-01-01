import { SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { SwitchElement } from './switch.element';
import { StackRowAlignCenterJustEnd } from '../../styles/stack.style';

export interface SwitchContentElementProps {
  name?: string;
  content: string;
  value?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  sx?: SxProps<Theme>;
}

export const SwitchContentElement: React.FC<SwitchContentElementProps> = ({
  name,
  content,
  value = false,
  onChange,
  sx = {},
}) => {
  return (
    <StackRowAlignCenterJustEnd sx={{ ...sx }}>
      <Typography>{content}</Typography>
      <SwitchElement name={name} value={value} onChange={onChange} />
    </StackRowAlignCenterJustEnd>
  );
};
