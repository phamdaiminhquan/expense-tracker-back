import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ChatEmptyStateProps {
    onCreateFund: () => void;
}

export function ChatEmptyState({ onCreateFund }: ChatEmptyStateProps) {
    return (
        <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-4xl bg-gray-50 mb-6 shadow-inner">
                <Search size={40} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">Chưa chọn quỹ</p>
            <p className="text-sm text-gray-400 mb-6">
                Vui lòng chọn một quỹ hoặc tạo quỹ mới để bắt đầu.
            </p>
            <Button
                onClick={onCreateFund}
                variant="default"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
            >
                Tạo quỹ mới ngay
            </Button>
        </div>
    );
}
