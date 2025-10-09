import {
    Camera,
    Copy,
    Save,
    Trash2,
    ZoomIn,
    ZoomOut,
    Clipboard,
    CheckCircle,
    Info as InfoIcon,
    Download,
    Crop as CropIcon,
    Share2,
    MousePointer,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ProductImageSectionProps {
    zoomLevel: number;
    isCapturing: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onCaptureAndCopy: () => void;
    onStartCustomScreenshot: () => void;
    onStartFreeSelection: () => void;
    onTestClipboard: () => void;
}

export function ProductImageSection({
    zoomLevel,
    isCapturing,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onCaptureAndCopy,
    onStartCustomScreenshot,
    onStartFreeSelection,
    onTestClipboard,
}: ProductImageSectionProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <span>产品图片</span>
                    <Badge variant="secondary">
                        缩放:
                        {' '}
                        {Math.round(zoomLevel * 100)}
                        %
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* 缩放控制按钮 */}
                    <div className="flex justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onZoomOut}
                            disabled={zoomLevel <= 0.5}
                        >
                            <ZoomOut className="mr-1 h-4 w-4" />
                            缩小
                        </Button>
                        <Button variant="outline" size="sm" onClick={onResetZoom}>
                            重置
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onZoomIn}
                            disabled={zoomLevel >= 4}
                        >
                            <ZoomIn className="mr-1 h-4 w-4" />
                            放大
                        </Button>
                    </div>

                    {/* 产品图片 */}
                    <div
                        id="screenshot-area"
                        className="relative flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
                        style={{ minHeight: '400px' }}
                    >
                        <img
                            src="/src/assets/images/8.jpg"
                            alt="Nike Air Max 270"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transition: 'transform 0.3s ease-in-out',
                            }}
                            className="max-h-96 max-w-full object-contain"
                        />
                    </div>

                    {/* 截图按钮 */}
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
                </div>
            </CardContent>
        </Card>
    );
}
