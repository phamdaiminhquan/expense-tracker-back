// components/ShareFundDialog.tsx
import React, { useState } from 'react';
import { X, Copy, Link as LinkIcon, Check, Share2 } from 'lucide-react';
import { Fund } from '@/apis/funds/fund.entities';

interface ShareFundDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fund: Fund;
    baseUrl?: string;
}

const ShareFundDialog: React.FC<ShareFundDialogProps> = ({
    isOpen,
    onClose,
    fund,
    baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareLink = `${baseUrl}/chat/${fund.id}`;

    const copyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <React.Fragment>
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-all duration-300 ${isOpen
                    ? 'opacity-100 backdrop-blur-sm'
                    : 'opacity-0 pointer-events-none backdrop-blur-none'
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md transition-all duration-300 ${isOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                    }`}
            >
                <div className="bg-white rounded-2xl shadow-2xl mx-4 overflow-hidden border border-gray-100">
                    <div className="relative p-6 pb-4 bg-linear-to-r from-blue-50 to-indigo-50">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 hover:bg-white/80 rounded-full transition-all duration-200"
                            aria-label="Đóng"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4">
                                <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg">
                                    <Share2 size={32} className="text-blue-600" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Chia sẻ quỹ
                            </h2>

                            <p className="text-gray-600 text-sm">
                                Mời bạn bè tham gia
                                <span className="font-semibold text-gray-900 ml-1">"{fund.name}"</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <div className="relative group">
                                <div className="flex items-center gap-3 p-4 bg-gray-50/80 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg shrink-0">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-1 font-medium">
                                            Đường dẫn chia sẻ
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium truncate select-all">
                                            {shareLink}
                                        </p>
                                    </div>

                                    <button
                                        onClick={copyLink}
                                        className={`p-2 rounded-lg transition-all duration-200 ${copied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                            }`}
                                        title="Sao chép link"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={copyLink}
                            className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold transition-all duration-300 mb-6 ${copied
                                ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                                : 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <div className="flex items-center justify-center w-5 h-5">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <span>Đã sao chép!</span>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center w-5 h-5">
                                        <Copy className="w-5 h-5" />
                                    </div>
                                    <span>Sao chép liên kết</span>
                                </>
                            )}
                        </button>


                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Gửi đường dẫn này cho bạn bè để họ tham gia quỹ
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {copied && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-95 border border-gray-700/50">
                        <div className="w-6 h-6 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="font-medium">Đã sao chép!</p>
                            <p className="text-xs text-gray-300">Đường dẫn đã được lưu vào clipboard</p>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default ShareFundDialog;