import React from "react";
import { Fund } from "@/apis/funds/fund.entities";
import { BriefcaseBusiness, Pencil, Trash, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FundItemProps {
    fund: Fund;
    isActive?: boolean;
    onSelect: () => void;
    // Actions
    onEdit?: (e: React.MouseEvent, fundId: string) => void;
    onDelete?: (e: React.MouseEvent, fundId: string) => void;
    onViewMembers?: (e: React.MouseEvent, fundId: string) => void;
}

export const FundItem: React.FC<FundItemProps> = ({
    fund,
    isActive = false,
    onSelect,
    onEdit,
    onDelete,
    onViewMembers,
}) => {
    return (
        <div
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
            role="button"
            tabIndex={0}
            className={`w-full group flex items-center gap-3 p-3 rounded-2xl transition-all text-left border cursor-pointer ${isActive
                    ? "bg-indigo-50 border-indigo-100"
                    : "hover:bg-gray-50 border-transparent"
                }`}
        >
            {/* ICON */}
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isActive
                        ? "bg-indigo-200 text-indigo-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
            >
                <BriefcaseBusiness size={20} />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <h4
                    className={`font-bold text-sm truncate ${isActive ? "text-indigo-900" : "text-gray-700"
                        }`}
                >
                    {fund.name}
                </h4>
                <p className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">
                    {fund.type === "shared" ? "Quỹ chung" : "Quỹ cá nhân"}
                </p>
            </div>

            {/* ACTIONS */}
            <div
                className={`flex gap-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
            >
                {fund.membershipRole === "owner" && (
                    <>
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(e, fund.id);
                                }}
                                className="cursor-pointer h-7 w-7 p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                <Pencil size={14} />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(e, fund.id);
                                }}
                                className="cursor-pointer h-7 w-7 p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-rose-500 transition-colors"
                            >
                                <Trash size={14} />
                            </Button>
                        )}
                    </>
                )}

                {onViewMembers && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMembers?.(e, fund.id);
                        }}
                        className="cursor-pointer h-7 w-7 p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-purple-500 transition-colors"
                    >
                        <LayoutList size={14} />
                    </Button>
                )}
            </div>
        </div>
    );
};
