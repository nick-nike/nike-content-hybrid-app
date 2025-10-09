import html2canvas from 'html2canvas';
import { useState, useCallback } from 'react';

import type { CroppedAreaPixels } from '../types';
import { getHtml2CanvasConfig, copyImageToClipboard, getCroppedImg } from './useScreenshotUtils';

// 截图状态管理hook
function useScreenshotState() {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [isFreeSelectionOpen, setIsFreeSelectionOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 4));
    const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setZoomLevel(1);

    return {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        isCapturing,
        setIsCapturing,
        isCropperOpen,
        setIsCropperOpen,
        isFreeSelectionOpen,
        setIsFreeSelectionOpen,
        crop,
        setCrop,
        zoom,
        setZoom,
        croppedAreaPixels,
        setCroppedAreaPixels,
        imageSrc,
        setImageSrc,
    };
}

// 全屏截图功能
function useFullScreenCapture(setIsCapturing: (value: boolean) => void) {
    const captureFullScreen = async () => {
        setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('Screenshot area not found');
                return null;
            }

            console.log('Starting full screen capture...');
            const canvas = await html2canvas(element, getHtml2CanvasConfig());

            return new Promise<{ blob: Blob; downloadUrl: string } | null>((resolve) => {
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            await copyImageToClipboard(blob);
                            const downloadUrl = URL.createObjectURL(blob);
                            resolve({ blob, downloadUrl });
                        } catch (error) {
                            console.error('Failed to copy to clipboard:', error);
                            const downloadUrl = URL.createObjectURL(blob);
                            resolve({ blob, downloadUrl });
                        }
                    } else {
                        resolve(null);
                    }
                }, 'image/png');
            });
        } catch (error) {
            console.error('截图失败:', error);
            alert('截图失败: ' + (error as Error).message);
            return null;
        } finally {
            setIsCapturing(false);
        }
    };

    return { captureFullScreen };
}

// 自定义截图功能
function useCustomScreenshot(
    setIsCapturing: (value: boolean) => void,
    setImageSrc: (src: string) => void,
    setIsCropperOpen: (open: boolean) => void,
    setCrop: (crop: { x: number; y: number }) => void,
    setZoom: (zoom: number) => void,
    setCroppedAreaPixels: (pixels: null) => void,
) {
    const startCustomScreenshot = async () => {
        setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('未找到截图区域');
                return;
            }

            console.log('准备自定义截图...');
            const canvas = await html2canvas(element, getHtml2CanvasConfig());

            const dataUrl = canvas.toDataURL('image/png');
            setImageSrc(dataUrl);
            setIsCropperOpen(true);

            // 重置裁剪区域和缩放
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
        } catch (error) {
            console.error('准备自定义截图失败:', error);
            alert('准备自定义截图失败: ' + (error as Error).message);
        } finally {
            setIsCapturing(false);
        }
    };

    return { startCustomScreenshot };
}

// 截图功能hook
export function useScreenshot(onImageCropped?: (blob: Blob, imageInfo: string) => void) {
    const state = useScreenshotState();
    const { captureFullScreen } = useFullScreenCapture(state.setIsCapturing);
    const { startCustomScreenshot } = useCustomScreenshot(
        state.setIsCapturing,
        state.setImageSrc,
        state.setIsCropperOpen,
        state.setCrop,
        state.setZoom,
        state.setCroppedAreaPixels,
    );

    // 快速截图并复制到剪贴板
    const captureAndCopy = async () => {
        state.setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('Screenshot area not found');
                return null;
            }

            const canvas = await html2canvas(element, getHtml2CanvasConfig());
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                    if (!blob) throw new Error('Canvas is empty');
                    resolve(blob);
                }, 'image/png');
            });

            try {
                await copyImageToClipboard(blob);
                if (onImageCropped) {
                    const timestamp = new Date().toLocaleString();
                    const size = (blob.size / 1024).toFixed(2);
                    const imageInfo = `Quick Screenshot - ${timestamp}\nType: ${blob.type}\nSize: ${size} KB`;
                    onImageCropped(blob, imageInfo);
                }
                return blob;
            } catch {
                alert('Failed to copy to clipboard, but image is captured');
                return blob;
            }
        } catch (error) {
            console.error('Screenshot failed:', error);
            alert('Screenshot failed: ' + (error as Error).message);
            return null;
        } finally {
            state.setIsCapturing(false);
        }
    };

    // 自由选择截图功能
    const startFreeSelectionScreenshot = async () => {
        state.setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('未找到截图区域');
                return;
            }

            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                throw new Error('截图区域没有尺寸');
            }

            const canvas = await html2canvas(element, {
                ...getHtml2CanvasConfig(1),
                logging: false,
                width: rect.width,
                height: rect.height,
            });

            const dataUrl = canvas.toDataURL('image/png', 0.9);
            if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
                throw new Error('生成的图片数据无效或太小');
            }

            state.setImageSrc(dataUrl);
            state.setIsFreeSelectionOpen(true);
        } catch (error) {
            console.error('准备自由选择截图失败:', error);
            alert('准备自由选择截图失败: ' + (error as Error).message);
        } finally {
            state.setIsCapturing(false);
        }
    };

    const onCropComplete = useCallback(
        (_croppedArea: unknown, croppedAreaPixels: CroppedAreaPixels) => {
            state.setCroppedAreaPixels(croppedAreaPixels);
        },
        [state],
    );

    const completeCrop = async (): Promise<Blob | null> => {
        if (!state.imageSrc || !state.croppedAreaPixels) {
            alert('请先选择裁剪区域');
            return null;
        }

        try {
            const croppedImage = await getCroppedImg(state.imageSrc, state.croppedAreaPixels);
            await copyImageToClipboard(croppedImage);

            if (onImageCropped) {
                const timestamp = new Date().toLocaleString();
                const size = (croppedImage.size / 1024).toFixed(2);
                const imageInfo = `自定义截图 - ${timestamp}\n类型: ${croppedImage.type}\n大小: ${size} KB`;
                onImageCropped(croppedImage, imageInfo);
            }

            alert('自定义截图已复制到剪贴板！');
            state.setIsCropperOpen(false);
            return croppedImage;
        } catch (error) {
            console.error('裁剪失败:', error);
            alert('裁剪失败: ' + (error as Error).message);
            return null;
        }
    };

    return {
        ...state,
        captureAndCopy,
        startCustomScreenshot,
        captureFullScreen,
        startFreeSelectionScreenshot,
        onCropComplete,
        completeCrop,
    };
}
