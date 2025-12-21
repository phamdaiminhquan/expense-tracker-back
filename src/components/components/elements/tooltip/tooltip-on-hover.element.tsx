import { Box, Tooltip, TooltipProps } from '@mui/material';
import React, { ReactElement } from 'react';
import { IconElement } from '../icon/icon.element';

export interface TooltipOnHoverElementProps extends Partial<Omit<TooltipProps, 'content'>> {
  openTest?: boolean;
  content: ReactElement | string;
  showCloseIcon?: boolean;
  onCloseClick?: () => void;
  disabled?: boolean;
}

export const TooltipOnHoverElement: React.FC<TooltipOnHoverElementProps> = ({
  openTest = false,
  placement = 'top',
  content,
  showCloseIcon = false,
  onCloseClick,
  children,
  onOpen,
  onClose,
  disabled = false,
  ...rest
}) => {
  if (disabled) {
    return <span>{children}</span>;
  }
  return (
    <Tooltip
      leaveDelay={400} // ms
      PopperProps={{ disablePortal: false }}
      placement={placement}
      onClose={onClose}
      onOpen={onOpen}
      title={
        <Box sx={{ position: 'relative' }}>
          {showCloseIcon && (
            <IconElement
              onClick={onCloseClick}
              sx={{
                position: 'absolute',
                top: 2,
                right: 0,
              }}
              content=""
              size="small"
              icon="close"
            />
          )}
          <Box sx={{ pr: showCloseIcon ? 2 : 0 }}>{content}</Box>
        </Box>
      }
      disableFocusListener
      // disableTouchListener
      {...(openTest && {
        disableHoverListener: openTest,
        open: openTest,
      })}
      sx={{
        zIndex: 100,
        maxWidth: 200,
      }}
      {...rest}
    >
      <span>{children}</span>
    </Tooltip>
  );
};
