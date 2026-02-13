import { useState, useRef, useEffect } from "react";

export function useMessagePageState(isLoadingFunds: boolean) {
    // Dialog States
    const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateFundDialogOpen, setIsCreateFundDialogOpen] = useState(false);
    const [isUpdateFundDialogOpen, setIsUpdateFundDialogOpen] = useState(false);
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
    const [isOpenShareFundDialog, setIsOpenShareFundDialog] = useState(false);

    // Loading Screen Logic
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);
    const hasShownInitialBanner = useRef(false);

    // Selected Fund for Member Dialog
    const [selectedFundIdForMembers, setSelectedFundIdForMembers] = useState<string | null>(null);

    // Logic hiển thị banner khi đang load funds (lần đầu vào app)
    useEffect(() => {
        if (hasShownInitialBanner.current) return;

        // Chỉ hiển thị lần đầu khi vào app và đang load funds
        const hasSeenBanner = sessionStorage.getItem("hasSeenChatBanner");
        if (!hasSeenBanner && isLoadingFunds) {
            hasShownInitialBanner.current = true;
            setShowLoadingScreen(true);
            sessionStorage.setItem("hasSeenChatBanner", "true");
        }
    }, [isLoadingFunds]);

    // Tự động ẩn banner khi load xong
    useEffect(() => {
        if (showLoadingScreen && !isLoadingFunds) {
            setShowLoadingScreen(false);
        }
    }, [showLoadingScreen, isLoadingFunds]);

    return {
        dialogs: {
            statistics: {
                isOpen: isStatisticsDialogOpen,
                open: () => setIsStatisticsDialogOpen(true),
                close: () => setIsStatisticsDialogOpen(false),
            },
            drawer: {
                isOpen: isDrawerOpen,
                open: () => setIsDrawerOpen(true),
                close: () => setIsDrawerOpen(false),
                setOpen: setIsDrawerOpen,
            },
            createFund: {
                isOpen: isCreateFundDialogOpen,
                open: () => {
                    setIsCreateFundDialogOpen(true);
                    setIsDrawerOpen(false);
                },
                close: () => setIsCreateFundDialogOpen(false),
                setOpen: setIsCreateFundDialogOpen
            },
            updateFund: {
                isOpen: isUpdateFundDialogOpen,
                open: () => {
                    setIsUpdateFundDialogOpen(true);
                    setIsDrawerOpen(false);
                },
                close: () => setIsUpdateFundDialogOpen(false),
                setOpen: setIsUpdateFundDialogOpen
            },
            member: {
                isOpen: isMemberDialogOpen,
                open: (fundId: string) => {
                    setSelectedFundIdForMembers(fundId);
                    setIsMemberDialogOpen(true);
                },
                close: () => {
                    setIsMemberDialogOpen(false);
                    setSelectedFundIdForMembers(null);
                },
                selectedFundId: selectedFundIdForMembers
            },
            share: {
                isOpen: isOpenShareFundDialog,
                open: () => setIsOpenShareFundDialog(true),
                close: () => setIsOpenShareFundDialog(false),
                toggle: () => setIsOpenShareFundDialog(prev => !prev),
                setOpen: setIsOpenShareFundDialog
            }
        },
        ui: {
            showLoadingScreen
        }
    };
}
