"use client"

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw, Download, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
    images: Array<{ url: string; name?: string; id?: string }>;
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onIndexChange: (index: number) => void;
    onCopy?: (imageUrl: string) => void;
}

export function ImageLightbox({
    images,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange,
    onCopy,
}: ImageLightboxProps) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const currentImage = images[currentIndex];

    const handlePrevious = useCallback(() => {
        onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }, [currentIndex, images.length, onIndexChange]);

    const handleNext = useCallback(() => {
        onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }, [currentIndex, images.length, onIndexChange]);

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev * 1.2, 5));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev / 1.2, 0.1));
    }, []);

    const handleRotate = useCallback(() => {
        setRotation(prev => (prev + 90) % 360);
    }, []);

    const handleDownload = useCallback(() => {
        if (!currentImage) return;
        
        const link = document.createElement('a');
        link.href = currentImage.url;
        link.download = currentImage.name || `image-${currentIndex + 1}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [currentImage, currentIndex]);

    const handleCopy = useCallback(() => {
        if (!currentImage || !onCopy) return;
        onCopy(currentImage.url);
    }, [currentImage, onCopy]);

    const resetTransform = useCallback(() => {
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    }, []);

    // 鼠标拖拽
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    }, [zoom, position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    }, [isDragging, dragStart, zoom]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // 重置变换当切换图片时
    useEffect(() => {
        resetTransform();
    }, [currentIndex, resetTransform]);

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                    handleZoomOut();
                    break;
                case 'r':
                case 'R':
                    handleRotate();
                    break;
                case '0':
                    resetTransform();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrevious, handleNext, handleZoomIn, handleZoomOut, handleRotate, resetTransform, onClose]);

    if (!currentImage) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
                {/* 工具栏 */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.1}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoom >= 5}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleRotate}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={resetTransform}>
                            Reset
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handleDownload}>
                            <Download className="h-4 w-4" />
                        </Button>
                        {onCopy && (
                            <Button variant="secondary" size="sm" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        )}
                        <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <Button variant="secondary" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 图片容器 */}
                <div 
                    className="relative flex items-center justify-center h-full overflow-hidden cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* 导航按钮 */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute left-4 z-10"
                                onClick={handlePrevious}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-4 z-10"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* 图片 */}
                    <div className="flex items-center justify-center h-full w-full">
                        <img
                            src={currentImage.url}
                            alt={currentImage.name || `Image ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                            }}
                            draggable={false}
                        />
                    </div>
                </div>

                {/* 缩略图导航 */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => onIndexChange(index)}
                                    className={cn(
                                        "flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all",
                                        index === currentIndex
                                            ? "border-white scale-110"
                                            : "border-transparent opacity-70 hover:opacity-100",
                                    )}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 快捷键提示 */}
                <div className="absolute bottom-4 right-4 z-10 text-white text-xs bg-black/50 p-2 rounded opacity-50">
                    <div>← → : Navigate</div>
                    <div>+/- : Zoom</div>
                    <div>R : Rotate</div>
                    <div>0 : Reset</div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
