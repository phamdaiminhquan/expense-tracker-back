import { Badge, BadgeProps } from '@mui/material'
import React from 'react'

export interface BadgeComponentProps extends BadgeProps {
    children: React.ReactNode
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
    children,
    ...props
}) => {
    return (
        <Badge
            overlap="circular"
            color="error"
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{
                '& .MuiBadge-badge': {
                    top: 6,
                    right: 6,
                },
            }}
            {...props}
        >
            {children}
        </Badge>
    )
}
