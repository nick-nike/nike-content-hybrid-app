import {
    Copy,
    Save,
    Share2,
    Clipboard,
    Info as InfoIcon,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ClipboardSectionProps {
    clipboardContent: string;
    lastImageUrl: string | null;
    lastImageBlob: Blob | null;
    onClipboardContentChange: (content: string) => void;
    onPasteFromClipboard: () => void;
    onSaveScreenshot: () => void;
    onCopyToSystemClipboard: (blob: Blob) => void;
}

export function ClipboardSection({
    clipboardContent,
    lastImageUrl,
    lastImageBlob,
    onClipboardContentChange,
    onPasteFromClipboard,
    onSaveScreenshot,
    onCopyToSystemClipboard,
}: ClipboardSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clipboard className="h-5 w-5" />
                    剪贴板管理
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 使用说明 */}
                <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>操作流程</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 space-y-1">
                            <div>1. 点击测试剪贴板功能确认权限</div>
                            <div>2. 选择全屏截图或自定义截图</div>
                            <div>3. 点击从剪贴板粘贴获取截图信息</div>
                            <div>4. 点击保存截图保存到列表</div>
                            <div>5. 可以复制到系统剪贴板或下载图片</div>
                        </div>
                    </AlertDescription>
                </Alert>

                {/* 粘贴预览 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">剪贴板预览：</span>
                        <Button
                            onClick={onPasteFromClipboard}
                            variant="outline"
                            size="sm"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            从剪贴板粘贴
                        </Button>
                    </div>

                    {lastImageUrl && (
                        <div className="my-2 flex justify-center rounded border p-2">
                            <img
                                src={lastImageUrl}
                                alt="剪贴板内容"
                                className="max-h-40 object-contain"
                            />
                        </div>
                    )}

                    <Textarea
                        value={clipboardContent}
                        onChange={(e) => onClipboardContentChange(e.target.value)}
                        placeholder="剪贴板内容将显示在这里..."
                        rows={3}
                        className="min-h-20"
                    />
                </div>

                {/* 保存按钮 */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        onClick={onSaveScreenshot}
                        disabled={!clipboardContent.trim() || !lastImageBlob}
                        className="w-full"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        保存截图
                    </Button>

                    {lastImageBlob && (
                        <Button
                            onClick={() => onCopyToSystemClipboard(lastImageBlob)}
                            variant="secondary"
                            className="w-full"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            复制到剪贴板
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
