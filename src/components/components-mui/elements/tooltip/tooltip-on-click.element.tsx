import { ClickAwayListener, Tooltip, TooltipProps } from '@mui/material';
import React, { ReactElement } from 'react';

export interface TooltipOnClickElementProps extends Partial<Omit<TooltipProps, 'content'>> {
  content: ReactElement | string;
  onClickAway: () => void;
}

export const TooltipOnClickElement: React.FC<TooltipOnClickElementProps> = ({
  open,
  placement = 'top',
  content,
  children,
  onOpen,
  onClose,
  onClickAway,
  ...rest
}) => {
  return (
    // Chỗ này có thể là bug, onClickAway apply ngay cả khi component chưa được render
    <ClickAwayListener onClickAway={onClickAway}>
      <Tooltip
        PopperProps={{ disablePortal: true }}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        placement={placement}
        title={content}
        {...rest}
      >
        <span>{children}</span>
      </Tooltip>
    </ClickAwayListener>
  );
};
