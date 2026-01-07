import {
    Avatar,
    Box,
    Button,
    Chip,
    ListItem,
    Typography,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { JoinFundRequest } from "@/apis/funds/fund.interface";
import { TimeAgoComponent } from "./components-mui/time-ago/time-ago.component";
import { X } from "lucide-react";

export const RequestFundItem: React.FC<{
    request: JoinFundRequest
    onApprove?: () => void;
    onReject?: () => void;
}> = ({ onApprove, onReject, request }) => {
    const isMember = request.tag === 'XIN LÀM MEMBER'

    return (
        <ListItem
            sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 3,
                bgcolor: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                display: "block",
            }}
        >
            <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                    sx={{
                        width: 44,
                        height: 44,
                        fontWeight: 700,
                        bgcolor: isMember ? "#6366F1" : "#10B981",
                        color: "#fff",
                    }}
                >
                    {request.user?.name.charAt(0) ?? 'U'}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography fontWeight={600}>{request.user?.name ?? 'User'}</Typography>
                            <Chip
                                label={request.tag}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    bgcolor: isMember ? "#EEF2FF" : "#ECFDF5",
                                    color: isMember ? "#4F46E5" : "#059669",
                                }}
                            />
                        </Box>

                        <TimeAgoComponent time={request.createdAt} />
                    </Box>

                    <Box
                        sx={{
                            mt: 1.2,
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            border: "1px solid #F1F5F9",
                            bgcolor: "#FAFAFA",
                            maxWidth: "90%",
                        }}
                    >
                        <Typography variant="body2" color="text.primary">
                            “{request.message}”
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    gap: 1.5,
                    ml: 'auto'
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onReject}
                    startIcon={<X />}
                    sx={{
                        borderRadius: 999,
                        px: 3,
                        color: "#475569",
                        borderColor: "#E2E8F0",
                        textTransform: "none",
                    }}
                >
                    Từ chối
                </Button>

                <Button
                    variant="contained"
                    onClick={onApprove}
                    startIcon={<PersonAddOutlinedIcon />}
                    sx={{
                        borderRadius: 999,
                        px: 3.5,
                        bgcolor: "#0F172A",
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: "#020617",
                        },
                    }}
                >
                    Duyệt ngay
                </Button>
            </Box>
        </ListItem>
    );
};
