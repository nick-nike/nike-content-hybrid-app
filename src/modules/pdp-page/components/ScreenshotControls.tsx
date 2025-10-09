import {
    Camera,
    Copy,
    CropIcon,
    MousePointer,
    CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ScreenshotControlsProps {
    isCapturing: boolean;
    onCaptureAndCopy: () => void;
    onStartCustomScreenshot: () => void;
    onStartFreeSelection: () => void;
    onTestClipboard: () => void;
}

export function ScreenshotControls({
    isCapturing,
    onCaptureAndCopy,
    onStartCustomScreenshot,
    onStartFreeSelection,
    onTestClipboard,
}: ScreenshotControlsProps) {
    return (
        <div className="space-y-2 text-center">
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={onCaptureAndCopy}
                    disabled={isCapturing}
                    size="lg"
                >
                    {isCapturing
                        ? (
                                <>
                                    <Camera className="mr-2 h-4 w-4 animate-pulse" />
                                    截图中...
                                </>
                            )
                        : (
                                <>
                                    <Camera className="mr-2 h-4 w-4" />
                                    全屏截图
                                </>
                            )}
                </Button>

                <Button
                    onClick={onStartCustomScreenshot}
                    disabled={isCapturing}
                    variant="outline"
                    size="lg"
                >
                    <CropIcon className="mr-2 h-4 w-4" />
                    裁剪截图
                </Button>
            </div>

            <Button
                onClick={onStartFreeSelection}
                disabled={isCapturing}
                variant="secondary"
                className="w-full"
                size="lg"
            >
                <MousePointer className="mr-2 h-4 w-4" />
                自由选择截图
            </Button>

            <Button
                onClick={onTestClipboard}
                variant="outline"
                className="w-full"
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                测试剪贴板功能
            </Button>
        </div>
    );
}
