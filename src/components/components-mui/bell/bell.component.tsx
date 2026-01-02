import React, { ReactNode, useState } from 'react';
import {
    Badge,
    IconButton,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    Box,
    Typography,
    Divider,
    IconButton as MuiIconButton,
    DialogContent
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

interface BellNotificationProps {
    unreadCount: number;
    requests: Array<ReactNode>;
    title?: string;
    onOpen?: () => Promise<void>;
    isLoading?: boolean
}

export const BellNotification: React.FC<BellNotificationProps> = ({
    unreadCount,
    requests,
    title = "Yêu cầu tham gia quỹ",
    onOpen,
    isLoading = false
}) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [isFetching, setIsFetching] = useState(false);

    const handleOpen = async () => {
        setOpen(true);

        if (onOpen) {
            try {
                setIsFetching(true);
                await onOpen();
            } finally {
                setIsFetching(false);
            }
        }
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={() => setOpen(true)}
                sx={{
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            top: 4,
                            right: 4,
                            border: '2px solid white',
                        },
                    }}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxHeight: '80vh',
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    <MuiIconButton
                        onClick={handleClose}
                        size="small"
                        edge="end"
                    >
                        <CloseIcon />
                    </MuiIconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 0 }}>
                    <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                        {requests.length === 0 ? (
                            <ListItem>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    py: 4,
                                    color: 'text.secondary'
                                }}>
                                    <NotificationsIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
                                    <Typography>Không có yêu cầu nào</Typography>
                                </Box>
                            </ListItem>
                        ) : (
                            requests.map((req, index) => (
                                <React.Fragment key={index}>
                                    {req}
                                    {index < requests.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};