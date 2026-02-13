import useSWRInfinite from "swr/infinite";
import { getListMessages } from "@/apis/messages/message.api";
import { ResList } from "@/common/interfaces/api.interface";
import { Message } from "@/common/lib/types.lib";
import { ITEMS_PER_PAGE } from "../message.constant";

export function useInfiniteChat(fundId: string | undefined) {
    const getKey = (pageIndex: number, previousPageData: ResList<Message> | null) => {
        if (!fundId) return null;
        // Nếu trang trước trả về rỗng hoặc items ít hơn request -> hết data -> return null để stop
        if (previousPageData && previousPageData.data.length < ITEMS_PER_PAGE) return null;

        // Key bao gồm fundId và page (pageIndex bắt đầu từ 0 nên API page bắt đầu từ 1)
        return ["messages", fundId, pageIndex + 1];
    };

    const { data, error, size, setSize, isValidating, isLoading, mutate } = useSWRInfinite(
        getKey,
        async ([_key, id, page]) => {
            return await getListMessages(id as string, {
                page: page as number,
                take: ITEMS_PER_PAGE,
            });
        },
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        }
    );

    // Flatten + de-dup theo id để tránh vòng lặp khi BE trả lại page cũ
    const flatMessages = data ? data.flatMap((page) => page.data) : [];
    const messages = flatMessages.reduce<Message[]>((acc, msg) => {
        if (acc.find((m) => m.id === msg.id)) return acc;
        acc.push(msg);
        return acc;
    }, []);

    const isLoadingInitial = isLoading;
    const isLoadingMore =
        isLoadingInitial ||
        (size > 0 && data && typeof data[size - 1] === "undefined");

    const isEmpty = data?.[0]?.data.length === 0;

    const isLastPageShort =
        data && data[data.length - 1]?.data.length < ITEMS_PER_PAGE;

    const isLastPageDuplicate = !!data && data.length > 1 && (() => {
        const lastPage = data[data.length - 1]?.data || [];
        const prevPages = data.slice(0, -1).flatMap((p) => p.data);
        const prevIds = new Set(prevPages.map((m) => m.id));
        return lastPage.length > 0 && lastPage.every((m) => prevIds.has(m.id));
    })();

    // Kiểm tra đã hết data chưa
    const isReachingEnd = isEmpty || !!isLastPageShort || isLastPageDuplicate;

    const loadMore = () => {
        if (!isReachingEnd && !isLoadingMore) {
            setSize(size + 1);
        }
    };

    const refresh = () => {
        mutate();
    };

    return {
        messages,
        error,
        isLoadingInitial,
        isLoadingMore,
        isReachingEnd,
        loadMore,
        setSize,
        refresh
    };
}
