/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Link, LinkProps } from '@mui/material';
import React from 'react';

export interface LinkElementProps extends LinkProps {
  onClick?: () => void;
}

export const LinkElement: React.FC<LinkElementProps> = ({ onClick, sx = {}, ...rest }) => {
  return (
    <Link
      target="_blank"
      rel="noopener"
      sx={{ textDecoration: 'none', color: 'unset', ...sx }}
      onClick={(event) => {
        event.preventDefault();
        onClick && onClick();
      }}
      {...rest}
    />
  );
};
