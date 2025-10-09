import { X } from 'lucide-react';
import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';

interface FreeSelectionScreenshotProps {
    imageSrc: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (blob: Blob, downloadUrl: string) => void;
}

export function FreeSelectionScreenshot({
    imageSrc,
    isOpen,
    onClose,
    onConfirm,
}: FreeSelectionScreenshotProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selection, setSelection] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsLoading(true);
            setImageLoaded(false);
            setSelection(null);
            return;
        }

        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;

        if (!canvas || !overlayCanvas) {
            console.error('画布元素未找到');
            return;
        }

        const ctx = canvas.getContext('2d');
        const overlayCtx = overlayCanvas.getContext('2d');

        if (!ctx || !overlayCtx) {
            console.error('无法获取画布上下文');
            return;
        }

        // 创建图片对象
        const img = new Image();

        img.onload = () => {
            console.log('图片加载成功, 尺寸:', img.width, 'x', img.height);

            // 等待一下让容器渲染完成
            setTimeout(() => {
                const container = canvas.parentElement;
                if (!container) {
                    console.error('容器元素未找到');
                    setIsLoading(false);
                    return;
                }

                const containerWidth = container.clientWidth || 800;
                const containerHeight = container.clientHeight || 600;

                console.log('容器尺寸:', containerWidth, 'x', containerHeight);

                // 设置画布尺寸
                canvas.width = containerWidth;
                canvas.height = containerHeight;
                overlayCanvas.width = containerWidth;
                overlayCanvas.height = containerHeight;

                // 计算图片在画布中的位置和尺寸
                const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (containerWidth - scaledWidth) / 2;
                const y = (containerHeight - scaledHeight) / 2;

                console.log('缩放信息: scale=', scale, 'scaledSize=', scaledWidth, 'x', scaledHeight, 'position=', x, ',', y);

                // 清除画布并添加背景
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, containerWidth, containerHeight);

                // 绘制图片
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

                setImageLoaded(true);
                setIsLoading(false);
                console.log('图片绘制完成');
            }, 100);
        };

        img.onerror = (error) => {
            console.error('图片加载失败:', error, 'imageSrc前100字符:', imageSrc?.substring(0, 100));
            setIsLoading(false);
        };

        console.log('开始加载图片, imageSrc长度:', imageSrc?.length);
        // 设置图片源
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
    }, [imageSrc, isOpen]);

    // 鼠标事件处理
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!imageLoaded) return;

        const rect = overlayCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsSelecting(true);
        setStartPoint({ x, y });
        setSelection({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isSelecting || !startPoint) return;

        const rect = overlayCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const newSelection = {
            x: Math.min(startPoint.x, currentX),
            y: Math.min(startPoint.y, currentY),
            width: Math.abs(currentX - startPoint.x),
            height: Math.abs(currentY - startPoint.y),
        };

        setSelection(newSelection);

        // 绘制选择区域
        const overlayCanvas = overlayCanvasRef.current;
        const overlayCtx = overlayCanvas?.getContext('2d');
        if (!overlayCtx || !overlayCanvas) return;

        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // 半透明遮罩
        overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // 清除选择区域
        overlayCtx.clearRect(newSelection.x, newSelection.y, newSelection.width, newSelection.height);

        // 选择框边框
        overlayCtx.strokeStyle = '#007bff';
        overlayCtx.lineWidth = 2;
        overlayCtx.strokeRect(newSelection.x, newSelection.y, newSelection.width, newSelection.height);
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        setStartPoint(null);
    };

    const handleConfirm = async () => {
        if (!selection || !canvasRef.current) return;

        try {
            // Create a new canvas for the cropped image
            const croppedCanvas = document.createElement('canvas');
            const croppedCtx = croppedCanvas.getContext('2d');

            if (!croppedCtx) return;

            // Set the size of the cropped canvas
            croppedCanvas.width = selection.width;
            croppedCanvas.height = selection.height;

            // Draw the selected area onto the new canvas
            croppedCtx.drawImage(
                canvasRef.current,
                selection.x, selection.y, selection.width, selection.height,
                0, 0, selection.width, selection.height,
            );

            // Convert to blob
            croppedCanvas.toBlob(async (blob) => {
                if (blob) {
                    // Copy to clipboard
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob }),
                        ]);
                        console.log('Screenshot copied to clipboard');
                    } catch (error) {
                        console.error('Failed to copy to clipboard:', error);
                    }

                    // Create download URL
                    const downloadUrl = URL.createObjectURL(blob);

                    // Call onConfirm with blob and download URL
                    onConfirm(blob, downloadUrl);
                }
            }, 'image/png');
        } catch (error) {
            console.error('Failed to create screenshot:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex h-[90vh] w-[90vw] flex-col rounded-lg bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Custom Screenshot</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="relative flex-1 rounded border">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                                <div>Loading image...</div>
                            </div>
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 h-full w-full"
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                    />

                    <canvas
                        ref={overlayCanvasRef}
                        className="absolute inset-0 h-full w-full cursor-crosshair"
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selection || selection.width === 0 || selection.height === 0}
                    >
                        Confirm & Copy to Clipboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FreeSelectionScreenshot;
