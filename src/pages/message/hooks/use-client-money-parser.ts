// Constants for units
const BILLION = 1000000000;
const MILLION = 1000000;
const THOUSAND = 1000;

export interface ParsedItem {
    original: string;
    description: string;
    raw_money: number;
}

// Logic Regex bóc tách chuẩn từ User Example
const extractMoneyFromSegment = (segment: string): ParsedItem | null => {
    let finalValue = 0;
    let description = segment;
    let matchedString = "";

    // Normalize text for easier regex processing (lowercase)
    const lower = segment.toLowerCase();

    // --- STRATEGY 1: COMPOUND UNITS (e.g., "3tr6", "4t5", "1m2") ---
    const compoundRegex =
        /(\d+(?:[.,]\d+)?)\s*(tr|triệu|củ|m|tỷ|ty|b|t)\s*(\d+)/i;
    const compoundMatch = lower.match(compoundRegex);

    if (compoundMatch) {
        const mainNum = parseFloat(compoundMatch[1].replace(",", "."));
        const unitStr = compoundMatch[2];
        const decimalPartStr = compoundMatch[3];

        let multiplier = 1;
        if (["tỷ", "ty", "b", "t"].includes(unitStr)) multiplier = BILLION;
        else if (["tr", "triệu", "củ", "m"].includes(unitStr))
            multiplier = MILLION;

        const decimalValue = parseFloat(decimalPartStr);
        const decimalFactor = Math.pow(10, decimalPartStr.length);

        finalValue =
            mainNum * multiplier + (decimalValue / decimalFactor) * multiplier;
        matchedString = compoundMatch[0];
    }
    // --- STRATEGY 2: STANDARD UNITS (e.g., "10k", "2.5 triệu", "500 ngàn") ---
    else {
        const standardRegex =
            /(\d+(?:[.,]\d+)*)\s*(k|ngàn|nghìn|ka|lít|xị|xu|tr|triệu|củ|m|chai|tỷ|ty|b|t)\s*(rưỡi|ruỡi|ruoi|rưởi)?(?:\b|\s|$)/i;
        const standardMatch = lower.match(standardRegex);

        if (standardMatch) {
            let numStr = standardMatch[1];
            const unitStr = standardMatch[2];
            const halfSuffix = standardMatch[3]; // capture "rưỡi"

            numStr = numStr.replace(/,/g, ".");
            if ((numStr.match(/\./g) || []).length > 1) {
                numStr = numStr.replace(/\./g, "");
            }

            let value = parseFloat(numStr);

            if (halfSuffix) {
                value += 0.5;
            }

            // Apply Multipliers
            if (["k", "ngàn", "nghìn", "ka", "xu"].includes(unitStr)) {
                value = value * THOUSAND;
            } else if (unitStr === "lít") {
                value = value * 100000;
            } else if (unitStr === "xị") {
                value = value * 10000;
            } else if (["tr", "triệu", "củ", "m", "chai"].includes(unitStr)) {
                value = value * MILLION;
            } else if (["tỷ", "ty", "b", "t"].includes(unitStr)) {
                value = value * BILLION;
            }

            finalValue = value;
            matchedString = standardMatch[0];
        }
        // --- STRATEGY 3: RAW NUMBERS ---
        else {
            const rawNumberRegex = /(?:\b|^)(\d+(?:[.,]\d+)*)(?:\b|$)/g;
            let matches: { val: string; index: number; raw: string }[] = [];
            let match;
            while ((match = rawNumberRegex.exec(lower)) !== null) {
                matches.push({ val: match[1], index: match.index, raw: match[0] });
            }

            if (matches.length > 0) {
                const bestMatch = matches[matches.length - 1];
                matchedString = bestMatch.raw;
                let cleanNum = bestMatch.val;

                const dotCount = (cleanNum.match(/\./g) || []).length;
                const commaCount = (cleanNum.match(/,/g) || []).length;

                if (dotCount > 0 && commaCount === 0) {
                    if (/\.\d{3}\b/.test(cleanNum)) {
                        cleanNum = cleanNum.replace(/\./g, "");
                    }
                } else if (commaCount > 0 && dotCount === 0) {
                    if (/,\d{3}\b/.test(cleanNum)) {
                        cleanNum = cleanNum.replace(/,/g, "");
                    } else {
                        cleanNum = cleanNum.replace(/,/g, ".");
                    }
                }

                let val = parseFloat(cleanNum);

                // THE GOLDEN RULE: < 1000 without unit -> x1000
                if (val < 1000 && val > 0) {
                    val = val * 1000;
                }
                finalValue = val;
            }
        }
    }

    // Cleanup description
    if (matchedString && finalValue > 0) {
        const escapeRegExp = (string: string) =>
            string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const removeRegex = new RegExp(escapeRegExp(matchedString), "i");
        description = description.replace(removeRegex, "").trim();
        description = description
            .replace(/\s+(hết|giá|khoảng)\s*$/, "")
            .trim();
        description = description.replace(/[-:]\s*$/, "").trim();
    }

    if (description.length === 0) description = "Khoản chi/thu";

    if (finalValue > 0) {
        return {
            original: segment,
            description: description,
            raw_money: finalValue,
        };
    }
    return null;
};

// Main Helper Function
export const parseMoney = (text: string): number => {
    if (!text) return 0;
    // Xử lý segment đầu tiên tìm được (vì message thường chỉ có 1 giao dịch chính, hoặc ta cộng tổng?)
    // User example: tính tổng. Vậy ta cũng cộng tổng cho Optimistic UI (vì 1 bubble = 1 message = 1 logic transaction AI thường xử lý).
    // Nhưng AI thường xử lý 1 message -> 1 transaction. Nếu user nhập "cafe 20k, ăn 30k" AI có thể parse ra 1 transaction 50k hoặc 2 transactions.
    // Ở đây để đơn giản cho Optimistic UI (display 1 bubble), ta cộng tổng là hợp lý.

    const segments = text.split(/[,;\n]+/);
    let total = 0;

    segments.forEach((segment) => {
        const trimmed = segment.trim();
        if (!trimmed) return;
        const extracted = extractMoneyFromSegment(trimmed);
        if (extracted) {
            total += extracted.raw_money;
        }
    });

    return total;
};

// Wrapper Hook (optional, if we need state later)
export function useClientMoneyParser() {
    return {
        parseMoney,
    };
}
