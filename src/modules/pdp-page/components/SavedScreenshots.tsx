import { Copy, Download, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ScreenshotData {
    id: string;
    content: string;
    timestamp: string;
    imageUrl: string;
    imageBlob: Blob;
}

interface SavedScreenshotsProps {
    screenshots: ScreenshotData[];
    onCopyToClipboard: (blob: Blob) => void;
    onDownload: (screenshot: ScreenshotData) => void;
    onDelete: (id: string) => void;
}

export function SavedScreenshots({
    screenshots,
    onCopyToClipboard,
    onDownload,
    onDelete,
}: SavedScreenshotsProps) {
    if (screenshots.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 space-y-3">
            <h4 className="font-medium">
                已保存的截图 (
                {screenshots.length}
                )
            </h4>
            <div className="max-h-96 space-y-3 overflow-y-auto">
                {screenshots.map((screenshot) => (
                    <Card key={screenshot.id} className="p-3">
                        <div className="space-y-3">
                            {/* 图片预览 */}
                            <div className="flex justify-center">
                                <img
                                    src={screenshot.imageUrl}
                                    alt="截图预览"
                                    className="max-h-32 max-w-full rounded border object-contain"
                                />
                            </div>

                            {/* 截图信息 */}
                            <div className="text-sm">
                                <div className="mb-1 font-medium">
                                    保存时间:
                                    {' '}
                                    {screenshot.timestamp}
                                </div>
                                <div className="max-h-16 overflow-y-auto rounded bg-gray-50 p-2 text-xs">
                                    {screenshot.content}
                                </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCopyToClipboard(screenshot.imageBlob)}
                                    className="flex-1"
                                >
                                    <Copy className="mr-1 h-3 w-3" />
                                    复制到剪贴板
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onDownload(screenshot)}
                                >
                                    <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDelete(screenshot.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
