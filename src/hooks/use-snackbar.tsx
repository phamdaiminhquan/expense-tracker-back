/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, ReactNode, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { STYLE } from '../common/constant';
import { Alert } from '@mui/material';

export enum SnackbarType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface SnackbarContext {
  message: string;
  type: SnackbarType;
}

export interface SnackbarContextType {
  showSnackbar: (params: SnackbarContext) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export interface SnackbarProviderProps {
  children?: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarContext & { open: boolean }>({
    open: false,
    message: '',
    type: SnackbarType.INFO,
  });

  const showSnackbar = (params: SnackbarContext) => {
    setSnackbar({
      open: true,
      ...params,
    });
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '&.MuiSnackbar-root': {
            bottom: STYLE.PADDING_GAP_LAYOUT,
            right: STYLE.PADDING_GAP_LAYOUT,
          },
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          sx={{ borderRadius: STYLE.BORDER_RADIUS_ELEMENT, boxShadow: 1 }}
          onClose={handleClose}
          severity={snackbar.type}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use SnackbarContext
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) throw new Error('useSnackbar must be used within a SnackbarProvider');

  return context;
};
