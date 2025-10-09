import type { FC } from 'react';
import { cn } from '@/lib/utils';

export enum LineWidth {
    THIN = 2,
    MEDIUM = 5,
    THICK = 8,
}

export enum LineColor {
    RED = '#ff0000',
    BLUE = '#0000ff',
    GREEN = '#00ff00',
    YELLOW = '#ffff00',
    GRAY = '#808080',
    WHITE = '#ffffff',
}

export type LineStyle = {
    lineWidth: LineWidth;
    lineColor: LineColor;
};

type Props = {
    lineStyle: LineStyle;
    onChange?: (lineStyle: LineStyle) => void;
};

const ToolBox: FC<Props> = ({ lineStyle, onChange }) => {
    const { lineWidth, lineColor } = lineStyle;
    // 三个圆点，表示三中粗细的画笔，5 个方块表示画笔颜色，选中后支持回调
    return (
        <div className="flex items-center justify-center gap-2 self-start border bg-gray-600 p-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange?.({ lineWidth: LineWidth.THIN, lineColor })}
                    className={cn('size-2 cursor-pointer rounded-full bg-gray-400', {
                        'bg-white': lineWidth === LineWidth.THIN,
                    })}
                />
                <button
                    onClick={() => onChange?.({ lineWidth: LineWidth.MEDIUM, lineColor })}
                    className={cn('size-3 cursor-pointer rounded-full bg-gray-400', {
                        'bg-white': lineWidth === LineWidth.MEDIUM,
                    })}
                />
                <button
                    onClick={() => onChange?.({ lineWidth: LineWidth.THICK, lineColor })}
                    className={cn('size-4 cursor-pointer rounded-full bg-gray-400', {
                        'bg-white': lineWidth === LineWidth.THICK,
                    })}
                />
            </div>
            <div className="h-4 w-1 border-l border-gray-300" />
            <div className="flex items-center gap-1">
                <button
                    className={cn('size-4 cursor-pointer bg-red-500', {
                        'ring-2 ring-white': lineColor === LineColor.RED,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.RED })}
                />
                <button
                    className={cn('size-4 cursor-pointer bg-blue-500', {
                        'ring-2 ring-white': lineColor === LineColor.BLUE,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.BLUE })}
                />
                <button
                    className={cn('size-4 cursor-pointer bg-green-500', {
                        'ring-2 ring-white': lineColor === LineColor.GREEN,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.GREEN })}
                />
                <button
                    className={cn('size-4 cursor-pointer bg-yellow-500', {
                        'ring-2 ring-white': lineColor === LineColor.YELLOW,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.YELLOW })}
                />
                <button
                    className={cn('size-4 cursor-pointer bg-gray-500', {
                        'ring-2 ring-white': lineColor === LineColor.GRAY,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.GRAY })}
                />
                <button
                    className={cn('size-4 cursor-pointer bg-white', {
                        'ring-2 ring-white border': lineColor === LineColor.WHITE,
                    })}
                    onClick={() => onChange?.({ lineWidth, lineColor: LineColor.WHITE })}
                />
            </div>
        </div>
    );
};

export { ToolBox };
