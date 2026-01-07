import React, { useState } from 'react';
import { X, Share2, Copy, Link as LinkIcon, Check } from 'lucide-react';
import { Fund } from '@/apis/funds/fund.entities';

interface InviteFundDialogProps {
    open: boolean;
    onClose: () => void;
    fund: Fund;
    baseUrl?: string;
}

const InviteFundDialog: React.FC<InviteFundDialogProps> = ({
    open,
    onClose,
    fund,
    baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
}) => {
    const [copied, setCopied] = useState<'code' | 'link' | null>(null);

    if (!open) return null;

    const shareLink = `${baseUrl}/fund/${fund.id}?share=true`;

    const formattedCode = fund.numberId
        ? `${fund.numberId.slice(0, 3)}-${fund.numberId.slice(3)}`
        : 9999999;

    const copyCode = () => {
        if (navigator.clipboard && fund.numberId) {
            navigator.clipboard.writeText(fund.numberId);
            setCopied('code');
            setTimeout(() => setCopied(null), 3000);
        }
    };

    const copyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink);
            setCopied('link');
            setTimeout(() => setCopied(null), 2000);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md transition-all duration-300 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
            >
                <div className="bg-white rounded-2xl shadow-2xl mx-4 sm:mx-0 overflow-hidden">
                    <div className="relative p-6 pb-4 flex flex-col items-center text-center">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Đóng"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="mt-4">
                            <div className="inline-flex items-center justify-center p-5 bg-blue-50 rounded-full mb-3">
                                <Share2 size={60} className="text-blue-500" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Mời bạn bè vào hũ
                        </h2>

                        <p className="text-gray-600 text-sm max-w-md">
                            Chia sẻ quỹ <span className="font-semibold text-gray-900">"{fund.name}"</span> để cùng nhau quản lý chi tiêu
                        </p>
                    </div>

                    <div className="px-6 pb-6 mt-2">
                        <div className="mb-8">
                            <span className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                                Cách 1: Gửi mã 6 số
                            </span>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
                                <p className="text-gray-600 text-sm mb-2">Mã tham gia</p>

                                <div className="mb-4">
                                    <div className="text-4xl font-bold text-gray-900 tracking-widest font-mono">
                                        {formattedCode}
                                    </div>
                                </div>

                                <button
                                    onClick={copyCode}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${copied === 'code'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {copied === 'code' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Đã sao chép
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 cursor-pointer" />
                                            Sao chép mã
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                                Cách 2: Gửi đường dẫn
                            </span>

                            {/* Link input */}
                            <div className="relative mb-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                    <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 truncate"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                                        title="Sao chép link"
                                    >
                                        {copied === 'link' ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div >
            {
                copied && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>Đã sao chép </span>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default InviteFundDialog;

