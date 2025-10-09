import { create } from 'zustand';
import { type LineStyle } from '../components/ToolBox';

type State = {
    styles: Record<string, LineStyle>;
    setLineStyle: (id: string, style: LineStyle) => void;
    getLineStyle: (id: string) => LineStyle | undefined;
};

const useStyles = create<State>((set, get) => ({
    styles: {},
    setLineStyle: (id, style) => {
        set((state) => ({
            styles: {
                ...state.styles,
                [id]: style,
            },
        }));
    },
    getLineStyle: (id) => {
        const styles = get().styles;
        return styles[id];
    },
}));

export { useStyles };
