import { Box, Chip, Typography } from '@mui/material'
import React from 'react'
import { ButtonElement } from '../elements/button/button.element'
import { TimeAgoComponent } from '../time-ago/time-ago.component'

export type FundRequestType = 'MEMBER' | 'FOLLOW'

export interface FundRequestItem {
    id: string
    name: string
    message: string
    time: string
    fundType: FundRequestType
    onApprove?: (id: string) => void
    onReject?: (id: string) => void
}

export const BadgeFundItemComponent: React.FC<FundRequestItem> = ({
    id,
    name,
    message,
    time,
    fundType,
    onApprove,
    onReject,
}) => {
    const map: Record<
        FundRequestType,
        { label: string; color: 'primary' | 'success' }
    > = {
        MEMBER: { label: 'Xin làm thành viên', color: 'primary' },
        FOLLOW: { label: 'Xin theo dõi', color: 'success' },
    }

    const config = map[fundType]

    return (
        <Box width="100%">
            <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight={600}>{name || "User"}</Typography>

                {
                    config?.label && <Chip
                        size="small"
                        label={config.label}
                        color={config?.color}
                    />
                }

                <Box ml="auto">
                    <TimeAgoComponent time={time} />
                </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
                {message}
            </Typography>

            <Box display="flex" gap={1} mt={1}>
                <ButtonElement
                    size="small"
                    variant="contained"
                    onClick={() => onApprove?.(id)}
                    content='Xác nhận'
                />

                <ButtonElement
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onReject?.(id)}
                    content='Từ chối'
                />
            </Box>
        </Box>
    )
}
