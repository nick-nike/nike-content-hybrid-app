import type { ImageAnnotation } from '@annotorious/react';
import { create } from 'zustand';

type State = {
    lastSelected?: ImageAnnotation;
    setLastSelected: (item: ImageAnnotation) => void;
    clearLastSelected: () => void;
};

const useAnnoLastSelected = create<State>((set) => ({
    lastSelected: undefined,
    setLastSelected: (item) => set({ lastSelected: item }),
    clearLastSelected: () => set({ lastSelected: undefined }),
}));

export { useAnnoLastSelected };
