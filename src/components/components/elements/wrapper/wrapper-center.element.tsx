import React from 'react';
import { BoxProps } from '@mui/material';
import { StackRowAlignJustCenter } from '../../styles/stack.style';

export interface WrapperCenterElementProps extends BoxProps {
  isWrap?: boolean;
}

export const WrapperCenterElement: React.FC<WrapperCenterElementProps> = ({ isWrap = false, children }) => {
  return isWrap ? <StackRowAlignJustCenter>{children}</StackRowAlignJustCenter> : <>{children}</>;
};
