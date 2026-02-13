import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FundType } from "@/common/lib/types.lib";
import { User } from "@/common/lib/auth.lib";
import { User as UserIcon, Users, Plus, Check } from "lucide-react";

interface CreateFundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFund: (name: string, type: FundType) => void;
  currentUserId: string;
  allUsers: User[];
}



export function FundCreatePart({
  open,
  onOpenChange,
  onCreateFund,
  currentUserId,
  allUsers,
}: CreateFundDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FundType>("personal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([
    currentUserId,
  ]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreateFund(name.trim(), type);
    setName("");
    setType("personal");
    setSelectedMembers([currentUserId]);
    onOpenChange(false);
  };

  const handleMemberToggle = (userId: string) => {
    if (userId === currentUserId) return;
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 rounded-4xl gap-0 border-none shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-white">
        <div className="px-6 pt-6 pb-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              Tạo quỹ mới
            </DialogTitle>
            <p className="text-sm text-gray-400 text-center font-medium mt-1">
              Quản lý thu chi thông minh
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Fund name input */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                Tên quỹ
              </div>
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Quỹ đi chơi, Quỹ sinh nhật..."
                  className="w-full p-3.5 bg-gray-50 rounded-xl text-base font-medium text-gray-700 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
            </div>

            {/* Fund type toggle */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                Loại quỹ
              </div>
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType("personal")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${type === "personal"
                    ? "bg-white text-gray-800 shadow-sm scale-[1.02]"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <UserIcon size={16} className={type === "personal" ? "text-indigo-500" : ""} />
                  Quỹ riêng
                </button>
                <button
                  type="button"
                  onClick={() => setType("shared")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${type === "shared"
                    ? "bg-white text-gray-800 shadow-sm scale-[1.02]"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <Users size={16} className={type === "shared" ? "text-purple-500" : ""} />
                  Quỹ chung
                </button>
              </div>

              {/* Type description */}
              <p className="text-xs text-gray-400 mt-2 px-1 font-medium">
                {type === "personal"
                  ? "Chỉ bạn có thể xem và quản lý quỹ này"
                  : "Chia sẻ với bạn bè để cùng theo dõi chi tiêu"}
              </p>
            </div>

            {/* Members selector (shared only) */}
            {type === "shared" && allUsers.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                  Thành viên
                </div>
                <div className="space-y-1.5">
                  {allUsers.map((user) => {
                    const isCurrentUser = user.id === currentUserId;
                    const isChecked = selectedMembers.includes(user.id);

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleMemberToggle(user.id)}
                        disabled={isCurrentUser}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isChecked
                          ? "bg-indigo-50 border border-indigo-200"
                          : "bg-gray-50 border border-transparent hover:bg-gray-100"
                          } ${isCurrentUser ? "opacity-70" : "cursor-pointer"}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isChecked
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>

                        {/* Name */}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-semibold text-gray-700">
                            {user.name}
                            {isCurrentUser && (
                              <span className="text-xs text-gray-400 font-medium ml-1.5">
                                (Bạn)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Checkmark */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isChecked
                            ? "bg-indigo-500 text-white"
                            : "border-2 border-gray-200"
                            }`}
                        >
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-xl font-semibold text-gray-500 border-gray-200 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={`flex-1 h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${name.trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-200 hover:shadow-xl"
                  : "bg-gray-100 text-gray-400 shadow-none"
                  }`}
              >
                <Plus size={18} />
                Tạo quỹ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
