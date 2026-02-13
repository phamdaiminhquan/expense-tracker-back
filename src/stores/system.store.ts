import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mode } from '@/common/enums/mode.enum';

interface SystemState {
    mode: Mode;
    toggleMode: () => void;
}

export const useSystemStore = create<SystemState>()(
    persist(
        (set) => ({
            mode: Mode.LIGHT,
            toggleMode: () =>
                set((state) => ({
                    mode: state.mode === Mode.LIGHT ? Mode.DARK : Mode.LIGHT,
                })),
        }),
        {
            name: 'system-storage', // localStorage key
        }
    )
);
