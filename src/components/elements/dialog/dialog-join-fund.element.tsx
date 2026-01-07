import React, { useState } from "react";
import { X, Users, Bell, UserPlus, Crown } from "lucide-react";
import { Fund } from "@/apis/funds/fund.entities";

interface JoinFundDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fund: Fund;
    onJoin: (fundId: string) => Promise<void>;
}

const JoinFundDialog: React.FC<JoinFundDialogProps> = ({
    isOpen,
    onClose,
    fund,
    onJoin,
}) => {
    const [isJoining, setIsJoining] = useState(false);

    if (!isOpen) return null;

    const handleJoin = async () => {
        try {
            setIsJoining(true);
            await onJoin(fund.id);
        } finally {
            setIsJoining(false);
        }
    };


    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Users className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">{fund?.name || "test"}</h1>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Crown className="w-4 h-4 text-amber-500" />
                                        Quỹ chia sẻ
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Thành viên</p>
                                <p className="text-lg font-bold">4 tvien</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Tổng quỹ</p>
                                <p className="text-lg font-bold text-green-700">
                                    5.500.000đ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-b">
                        <div className="bg-gray-50 rounded-xl p-4 italic text-gray-700">
                            “{fund?.description ||
                                "Quỹ này dùng để đi nhậu, đi cafe và xem phim cuối tuần."}”
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <UserPlus className="text-blue-600" />
                            Tham gia quỹ
                        </h2>

                        <div className="opacity-50 pointer-events-none mb-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Chỉ theo dõi (Follow)</p>
                                        <p className="text-sm text-gray-500">
                                            Chức năng này sẽ sớm ra mắt
                                        </p>
                                    </div>
                                </div>

                                <div className="w-12 h-6 bg-gray-300 rounded-full" />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                            💡 Khi tham gia, bạn có thể xem và thảo luận tất cả giao dịch trong quỹ.
                        </div>

                        <button
                            onClick={handleJoin}
                            disabled={isJoining}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-70"
                        >
                            {isJoining ? "Đang xử lý..." : "Tham gia ngay"}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-3 border rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Để sau
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JoinFundDialog;
