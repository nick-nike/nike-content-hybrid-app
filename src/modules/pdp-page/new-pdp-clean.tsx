'use client';

import { useState } from 'react';

import { ClipboardSection } from './components/ClipboardSection';
import { CropDialog } from './components/CropDialog';
import { ProductImageSection } from './components/ProductImageSection';
import { SavedScreenshots } from './components/SavedScreenshots';
import { useClipboard } from './hooks/useClipboard';
import { useScreenshot } from './hooks/useScreenshot';
import type { ScreenshotData } from './types';
import { FreeSelectionScreenshot } from '@/components/FreeSelectionScreenshot';

export function NewPDPPage() {
    const {
        clipboardContent,
        setClipboardContent,
        pasteFromClipboard,
        testClipboard,
        lastImageBlob,
        setLastImageBlob,
        lastImageUrl,
        setLastImageUrl,
        copyToSystemClipboard,
    } = useClipboard();

    const handleImageCropped = (blob: Blob, imageInfo: string) => {
        setClipboardContent(imageInfo);
        setLastImageBlob(blob);
        const imageUrl = URL.createObjectURL(blob);
        setLastImageUrl(imageUrl);
    };

    const {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        isCapturing,
        captureAndCopy,
        isCropperOpen,
        setIsCropperOpen,
        isFreeSelectionOpen,
        setIsFreeSelectionOpen,
        crop,
        setCrop,
        zoom,
        setZoom,
        onCropComplete,
        completeCrop,
        imageSrc,
        setImageSrc,
        startCustomScreenshot,
        startFreeSelectionScreenshot,
    } = useScreenshot(handleImageCropped);

    const [savedScreenshots, setSavedScreenshots] = useState<ScreenshotData[]>([]);

    const saveScreenshot = async () => {
        if (!clipboardContent.trim() || !lastImageBlob) {
            alert('请先粘贴剪贴板内容');
            return;
        }

        const imageUrl = URL.createObjectURL(lastImageBlob);
        const newScreenshot: ScreenshotData = {
            id: Date.now().toString(),
            content: clipboardContent,
            timestamp: new Date().toLocaleString(),
            imageUrl,
            imageBlob: lastImageBlob,
        };

        setSavedScreenshots((prev) => [newScreenshot, ...prev]);
        setClipboardContent('');
        alert('截图已保存！');
    };

    const deleteScreenshot = (id: string) => {
        setSavedScreenshots((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            const toDelete = prev.find((item) => item.id === id);
            if (toDelete) {
                URL.revokeObjectURL(toDelete.imageUrl);
            }
            return updated;
        });
    };

    const downloadScreenshot = (screenshot: ScreenshotData) => {
        const link = document.createElement('a');
        link.href = screenshot.imageUrl;
        link.download = `产品截图_${screenshot.timestamp.replace(/[:/]/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-8 p-6">
            <div className="text-center">
                <h1 className="mb-2 text-4xl font-bold text-gray-800">
                    Nike Air Max 270 - 产品展示页
                </h1>
                <p className="text-lg text-gray-600">
                    体验产品缩放、截图和剪贴板功能
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <ProductImageSection
                    zoomLevel={zoomLevel}
                    isCapturing={isCapturing}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onResetZoom={resetZoom}
                    onCaptureAndCopy={captureAndCopy}
                    onStartCustomScreenshot={startCustomScreenshot}
                    onStartFreeSelection={startFreeSelectionScreenshot}
                    onTestClipboard={testClipboard}
                />

                <div className="space-y-4">
                    <ClipboardSection
                        clipboardContent={clipboardContent}
                        lastImageUrl={lastImageUrl}
                        lastImageBlob={lastImageBlob}
                        onClipboardContentChange={setClipboardContent}
                        onPasteFromClipboard={pasteFromClipboard}
                        onSaveScreenshot={saveScreenshot}
                        onCopyToSystemClipboard={copyToSystemClipboard}
                    />

                    <SavedScreenshots
                        screenshots={savedScreenshots}
                        onCopyToClipboard={copyToSystemClipboard}
                        onDownload={downloadScreenshot}
                        onDelete={deleteScreenshot}
                    />
                </div>
            </div>

            <CropDialog
                isOpen={isCropperOpen}
                imageSrc={imageSrc}
                crop={crop}
                zoom={zoom}
                onClose={() => setIsCropperOpen(false)}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onConfirmCrop={completeCrop}
            />

            {imageSrc && (
                <FreeSelectionScreenshot
                    imageSrc={imageSrc}
                    isOpen={isFreeSelectionOpen}
                    onClose={() => {
                        setIsFreeSelectionOpen(false);
                        setImageSrc(null);
                    }}
                    onConfirm={async (selectedArea) => {
                        try {
                            console.log('选中区域:', selectedArea);
                            setIsFreeSelectionOpen(false);
                            setImageSrc(null);
                        } catch (error) {
                            console.error('处理自由选择截图失败:', error);
                        }
                    }}
                />
            )}
        </div>
    );
}
