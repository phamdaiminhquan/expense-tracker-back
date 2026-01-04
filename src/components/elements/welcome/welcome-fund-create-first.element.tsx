import React, { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Capybara } from "../capybara/CapyFace";
import { useCapyEyeTracking } from "@/hooks/use-capy-eyes-tracking.hook";
import { User } from "@/lib/auth.lib";
import { FundType } from "@/lib/types.lib";
import { FundCreatePart } from "@/pages/fund/parts/fund-create/fund-create.part";

interface WelcomeFundCreateFirstProps {
  onCreateFund?: (name: string, type: FundType) => Promise<void>;
  currentUserId?: string;
  allUsers?: User[];
  onComplete: () => void;
  onLogout?: () => void;
}

export const WelcomeFundCreateFirst: React.FC<WelcomeFundCreateFirstProps> = ({
  onCreateFund,
  currentUserId,
  allUsers,
  onComplete,
  onLogout,
}) => {
  const capybaraRef = useRef<HTMLDivElement>(null);
  const { eyePosition } = useCapyEyeTracking(capybaraRef);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  const handleFundCreated = async (name: string, type: FundType) => {
    if (onCreateFund) await onCreateFund(name, type);
    setIsFundModalOpen(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Logout Button */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-6 right-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Đăng xuất
        </button>
      )}

      {/* Decorative elements */}
      <div className="absolute top-20 right-[-20px] w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-[-20px] w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg">
        <div
          ref={capybaraRef}
          className="w-48 h-60 flex items-center justify-center pb-8 transform hover:scale-105 transition-transform duration-300 overflow-hidden"
        >
          <Capybara mood="simp" eyePos={eyePosition} scale={1.2} />
        </div>

        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold mb-3">Tuyệt vời!</h1>
          <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
            Giờ hãy tạo một quỹ chi tiêu để quản lý tiền nong nhé.
          </p>
          <button
            onClick={() => setIsFundModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/20 overflow-hidden transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Tạo quỹ chi tiêu{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        <FundCreatePart
          open={isFundModalOpen}
          onOpenChange={setIsFundModalOpen}
          onCreateFund={handleFundCreated}
          currentUserId={currentUserId || ""}
          allUsers={allUsers || []}
        />
      </div>
    </div>
  );
};
