import InputBarCapy from "@/components/elements/input/input-bar-capy.element";
import { Fund } from "@/apis/funds/fund.entities";

interface ChatInputAreaProps {
    input: string;
    setInput: (val: string) => void;
    selectedWallet: any;
    isSmartMode: boolean;
    isAnalyzing: boolean;
    onSend: () => void;
    onWalletClick: () => void;
    onCategoryClick: () => void;
}

export function ChatInputArea({
    input,
    setInput,
    selectedWallet,
    isSmartMode,
    isAnalyzing,
    onSend,
    onWalletClick,
    onCategoryClick,
}: ChatInputAreaProps) {
    return (
        <div className="shrink-0 z-20 bg-white">
            <InputBarCapy
                inputValue={input}
                setInputValue={setInput}
                selectedWallet={selectedWallet}
                isSmartMode={isSmartMode}
                isAnalyzing={isAnalyzing}
                capyMood={isAnalyzing ? "excited" : "sleepy"}
                onSend={onSend}
                onFocus={() => { }}
                onBlur={() => { }}
                onWalletClick={onWalletClick}
                onCategoryClick={onCategoryClick}
            />
        </div>
    );
}
