import { useRef, useEffect, useLayoutEffect } from "react";
import { Message } from "@/common/lib/types.lib";
import { OptimisticMessage } from "./use-optimistic-chat";

interface UseScrollToBottomProps {
    messages: Message[];
    optimisticMessages: OptimisticMessage[];
    loadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

export function useScrollToBottom({
    messages,
    optimisticMessages,
    loadMore,
    hasMore,
    isLoadingMore,
}: UseScrollToBottomProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const isNearBottomRef = useRef(true);
    const pendingOptimisticScrollRef = useRef(false);
    const prevOptimisticCountRef = useRef(0);

    const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
        if (!scrollContainerRef.current) return;
        bottomRef.current?.scrollIntoView({ behavior, block: "end" });
        const container = scrollContainerRef.current;
        container.scrollTop = container.scrollHeight;
        requestAnimationFrame(() => {
            if (!scrollContainerRef.current) return;
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        });
    };

    // Ref để lưu trạng thái scroll cũ trước khi load more
    const preLoadHeight = useRef<number>(0);
    const isFetchingMore = useRef(false);

    // Logic tự động scroll xuống đáy khi có tin nhắn MỚI (không phải tin cũ load thêm)
    // Ta so sánh timestamp của tin nhắn cuối cùng để biết có phải tin mới không
    const lastMessageId = useRef<string | null>(null);

    useEffect(() => {
        // Nếu vừa gửi optimistic -> ưu tiên scroll xuống
        if (pendingOptimisticScrollRef.current) {
            scrollToBottom("smooth");
            pendingOptimisticScrollRef.current = false;
            return;
        }

        // Chỉ auto-scroll khi user đang ở gần đáy
        if (!isFetchingMore.current && isNearBottomRef.current && messages.length > 0) {
            scrollToBottom("smooth");
        }
    }, [messages.length, optimisticMessages.length]);


    // Handle Scroll logic để trigger loadMore
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container || !loadMore || !hasMore || isLoadingMore) return;

        // Update trạng thái user đang ở gần đáy hay không
        const distanceToBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;
        isNearBottomRef.current = distanceToBottom < 80;

        // Nếu scroll lên gần đỉnh (còn 50px)
        if (container.scrollTop < 50 && !isFetchingMore.current) {
            isFetchingMore.current = true;
            preLoadHeight.current = container.scrollHeight;
            loadMore();
        }
    };

    // Restore Scroll Position sau khi load more xong
    useLayoutEffect(() => {
        if (isFetchingMore.current && !isLoadingMore && scrollContainerRef.current) {
            // Data mới đã về
            const container = scrollContainerRef.current;
            const newHeight = container.scrollHeight;
            const diff = newHeight - preLoadHeight.current;

            // Nhảy xuống vị trí cũ
            container.scrollTop = diff + container.scrollTop; // cộng thêm scrollTop hiện tại (thường là ~0)

            isFetchingMore.current = false;
        }
    }, [messages.length, isLoadingMore]); // Trigger khi data thay đổi sau khi fetching

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !("ResizeObserver" in window)) return;

        const observer = new ResizeObserver(() => {
            if (!isFetchingMore.current && isNearBottomRef.current) {
                scrollToBottom("auto");
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (optimisticMessages.length > prevOptimisticCountRef.current) {
            pendingOptimisticScrollRef.current = true;
        }
        prevOptimisticCountRef.current = optimisticMessages.length;
    }, [optimisticMessages.length]);

    return {
        scrollContainerRef,
        bottomRef,
        handleScroll,
    };
}
