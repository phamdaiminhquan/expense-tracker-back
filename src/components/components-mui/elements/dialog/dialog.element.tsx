import {
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  useTheme,
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { ButtonElement, ButtonElementProps } from '../button/button.element';
import { IconContentElement } from '../icon/icon-content.element';
import { StackRowAlignCenterJustBetween, StackRow } from '../../styles/stack.style';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';
import { STYLE } from '@/common/constant';
import { Mode } from '@/common/enums/mode.enum';
import { Form, FormikContext } from 'formik';
import { useSystemStore } from '@/stores/system.store';

export interface DialogElementProps extends DialogProps {
  iconLabel?: string;
  label: string;
  nodeLabel?: ReactNode;
  nodeHelp?: ReactNode;
  nodeBottomLeft?: ReactNode;
  buttonRight?: ButtonElementProps;
  buttonCenter?: ButtonElementProps;
  buttonLeft?: ButtonElementProps;
  // direction?: 'column' | 'row';
  nodeContent?: ReactNode;
  isForm?: boolean;
  widthButton?: number;
  loading?: boolean;
  isContentTextField?: boolean; //  Khi content là texfield sẽ bị che label. Khi này cần padding top 1 để nó không bị che
  fixedHeaderFooter?: boolean;
}

const DialogWrapper: React.FC<{ isForm: boolean; children: ReactNode }> = ({ isForm = false, children }) => {
  // Nếu không có ngữ cảnh Formik, fallback về <form> native để tránh lỗi handleReset undefined
  const formikContext = React.useContext(FormikContext as any);
  if (!isForm) return <React.Fragment>{children}</React.Fragment>;
  return formikContext ? <Form noValidate>{children}</Form> : <form noValidate>{children}</form>;
};

export const DialogElement: React.FC<DialogElementProps> = ({
  iconLabel = 'leaderboard',
  label,
  nodeLabel,
  nodeHelp,
  nodeBottomLeft,
  buttonRight,
  buttonCenter,
  buttonLeft,
  // direction = 'column',
  nodeContent,
  sx,
  isForm = false,
  widthButton,
  loading,
  isContentTextField = false,
  fixedHeaderFooter = false,
  ...rest
}) => {
  const { palette } = useTheme();

  const mode = useSystemStore((state) => state.mode);

  const [openHelp, setOpenHelp] = useState(false);

  // STYLE
  if (widthButton)
    [buttonLeft, buttonCenter, buttonRight].forEach((btn) => btn && (btn.sx = { width: widthButton, ...btn.sx }));

  return (
    <Dialog
      disableScrollLock
      {...rest}
      PaperProps={{
        sx: { borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER, maxWidth: 1200, maxHeight: '80%', ...sx },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: mode === Mode.DARK ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <DialogTitle
        component={'div'}
        sx={{
          display: 'flex',
          padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
          paddingBottom: STYLE.PADDING_GAP_LAYOUT,
          gap: STYLE.PADDING_GAP_ITEM_SMALL,
          backgroundColor: palette.background.paper,
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(fixedHeaderFooter ? { position: 'sticky', top: 0, zIndex: 2 } : {}),
        }}
      >
        <Stack direction="row" alignItems="center" gap={1} flex={1}>
          {label && <IconContentElement icon={iconLabel} content={label} size="medium" />}
          {nodeLabel}
        </Stack>

        <IconElement icon="close" size="large" onClick={rest.onClose as any}></IconElement>
      </DialogTitle>
      <DialogWrapper isForm={isForm}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <DialogContent
            sx={{
              padding: 0,
              paddingBottom: !buttonLeft && !buttonRight ? `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)` : 0,
              px: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
              backgroundColor: palette.background.paper,
              ...(isContentTextField ? { paddingTop: 1 } : {}),
              // ...(fixedHeaderFooter ? { overflowY: 'auto' } : {}),
              overflow: 'hidden',
            }}
          >
            {nodeContent}
          </DialogContent>
        )}

        {(buttonLeft || buttonRight) && (
          <DialogActions
            sx={{
              padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
              paddingTop: STYLE.PADDING_GAP_LAYOUT,
              backgroundColor: palette.background.paper,
              ...(fixedHeaderFooter ? { position: 'sticky', bottom: 0, zIndex: 2 } : {}),
            }}
          >
            <Stack sx={{ flex: 1 }}>
              <StackRowAlignCenterJustBetween>
                <StackRow>
                  {nodeBottomLeft}
                  {nodeHelp && (
                    <ButtonElement
                      variant="outlined"
                      content="Giúp đỡ"
                      endIcon={openHelp ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                      size="medium"
                      onClick={() => setOpenHelp(!openHelp)}
                      fullWidth={false}
                    />
                  )}
                </StackRow>

                <StackRow sx={{ flex: 1, justifyContent: 'flex-end' }}>
                  {buttonLeft && <ButtonElement {...buttonLeft} fullWidth={false} />}
                  {buttonCenter && <ButtonElement {...buttonCenter} fullWidth={false} />}
                  {buttonRight && <ButtonElement {...buttonRight} fullWidth={false} />}
                </StackRow>
              </StackRowAlignCenterJustBetween>
            </Stack>
          </DialogActions>
        )}
      </DialogWrapper>

      <Collapse in={openHelp} timeout={500}>
        {
          <Stack
            sx={{
              maxHeight: 200,
              padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
              paddingTop: 0,
              overflowY: 'auto',
              backgroundColor: palette.background.paper,
            }}
          >
            {nodeHelp}
          </Stack>
        }
      </Collapse>
    </Dialog>
  );
};
