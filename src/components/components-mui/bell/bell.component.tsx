import {
    Box,
    Divider,
    Fade,
    IconButton,
    List,
    ListItem,
    Popover,
    Typography,
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import React, { useState } from 'react'
import { STYLE } from '@/common/constant'
import { BadgeComponent } from '../badge/badge.component'
import { BadgeFundItemComponent } from '../badge/badge-fund-item.component'


export type BellItemType = 'FUND_REQUEST' | 'SYSTEM'

export interface BellItem {
    id: string
    type: BellItemType
    payload: any
}

export interface BellComponentProps {
    count: number
    title: string
    items: BellItem[]
}

/* ========= COMPONENT ========= */

export const BellComponent: React.FC<BellComponentProps> = ({
    count,
    title,
    items,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)

    const renderItem = (item: BellItem) => {
        switch (item.type) {
            case 'FUND_REQUEST':
                return <React.Fragment>
                    <BadgeFundItemComponent {...item.payload} />
                    <Divider />
                </React.Fragment>

            case 'SYSTEM':
                return (
                    <Typography variant="body2">
                        {item.payload.message}
                    </Typography>
                )

            default:
                return null
        }
    }

    return (
        <Fade in timeout={STYLE.ANIMATION_TIME}>
            <Box>
                <BadgeComponent badgeContent={count}>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <NotificationsNoneIcon />
                    </IconButton>
                </BadgeComponent>

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            width: 440,
                            maxHeight: 420,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                        },
                    }}
                >
                    <Typography fontWeight={600} mb={1}>
                        {title}
                    </Typography>

                    <List disablePadding>
                        {items.map((item) => (
                            <ListItem key={item.id} disableGutters>
                                {renderItem(item)}
                            </ListItem>
                        ))}
                    </List>
                </Popover>
            </Box>
        </Fade>
    )
}
