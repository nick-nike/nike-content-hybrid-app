'use client';

import html2canvas from 'html2canvas';
import {
    Camera,
    Copy,
    Download,
    Eye,
    Trash2,
    ZoomIn,
    ZoomOut,
    Clipboard,
    CheckCircle,
    Info as InfoIcon,
    Square,
    Move,
    Save,
    Image as ImageIcon,
    X,
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface SavedScreenshot {
    id: string;
    imageData: string; // base64 图片数据
    metadata: {
        filename: string;
        timestamp: string;
        size: number;
        dimensions: {
            width: number;
            height: number;
        };
        description?: string;
    };
}

interface SelectionArea {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isSelecting: boolean;
}

// 生成唯一ID
const generateId = () => `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 自定义截图Hook
function useCustomScreenshot() {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [selection, setSelection] = useState<SelectionArea>({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        isSelecting: false,
    });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 4));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setZoomLevel(1);

    // 全屏截图
    const captureFullImage = async () => {
        setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('未找到截图区域');
                return null;
            }

            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                backgroundColor: '#ffffff',
                onclone: (clonedDocument) => {
                    const styles = clonedDocument.querySelectorAll('style');
                    styles.forEach(style => {
                        if (style.textContent && style.textContent.includes('oklch')) {
                            style.textContent = style.textContent.replace(/[^{}]*oklch[^}]*}/g, '');
                        }
                    });
                },
            });

            return canvas;
        } catch (error) {
            console.error('截图失败:', error);
            alert('截图失败: ' + error.message);
            return null;
        } finally {
            setIsCapturing(false);
        }
    };

    // 自定义区域截图
    const captureCustomArea = async () => {
        if (!selection.isSelecting) {
            alert('请先选择截图区域');
            return null;
        }

        setIsCapturing(true);
        try {
            const element = document.getElementById('screenshot-area');
            if (!element) {
                alert('未找到截图区域');
                return null;
            }

            const fullCanvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                backgroundColor: '#ffffff',
            });

            // 创建裁剪后的canvas
            const croppedCanvas = document.createElement('canvas');
            const ctx = croppedCanvas.getContext('2d');
            if (!ctx) return null;

            const rect = element.getBoundingClientRect();
            const scaleX = fullCanvas.width / rect.width;
            const scaleY = fullCanvas.height / rect.height;

            const cropX = Math.min(selection.startX, selection.endX) * scaleX;
            const cropY = Math.min(selection.startY, selection.endY) * scaleY;
            const cropWidth = Math.abs(selection.endX - selection.startX) * scaleX;
            const cropHeight = Math.abs(selection.endY - selection.startY) * scaleY;

            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;

            ctx.drawImage(
                fullCanvas,
                cropX, cropY, cropWidth, cropHeight,
                0, 0, cropWidth, cropHeight,
            );

            return croppedCanvas;
        } catch (error) {
            console.error('自定义截图失败:', error);
            alert('自定义截图失败: ' + error.message);
            return null;
        } finally {
            setIsCapturing(false);
        }
    };

    // 开始选择区域
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isCustomMode) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isSelecting: true,
        });
    };

    // 更新选择区域
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isCustomMode || !selection.isSelecting) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelection(prev => ({
            ...prev,
            endX: x,
            endY: y,
        }));
    };

    // 完成选择
    const handleMouseUp = () => {
        if (!isCustomMode || !selection.isSelecting) return;
        // 保持选择状态，不重置
    };

    // 取消选择
    const cancelSelection = () => {
        setSelection({
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            isSelecting: false,
        });
        setIsCustomMode(false);
    };

    return {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        isCapturing,
        isCustomMode,
        setIsCustomMode,
        selection,
        captureFullImage,
        captureCustomArea,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        cancelSelection,
        imageContainerRef,
    };
}

// Clipboard Management Hook
function useClipboardManager() {
    const [savedScreenshots, setSavedScreenshots] = useState<SavedScreenshot[]>([]);
    const [clipboardContent, setClipboardContent] = useState('');

    // 复制图片到系统剪贴板
    const copyToClipboard = async (canvas: HTMLCanvasElement) => {
        try {
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/png');
            });

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ]);

            // 同时显示成功信息
            const timestamp = new Date().toLocaleString();
            const size = blob.size;
            const info = `截图已复制到系统剪贴板！\n时间: ${timestamp}\n大小: ${(size / 1024).toFixed(2)} KB\n\n💡 现在您可以:\n1. 在任何应用中按 Ctrl+V (Windows) 或 Cmd+V (Mac) 粘贴\n2. 点击下方"从剪贴板粘贴"按钮查看信息\n3. 点击"保存截图"永久保存`;

            setClipboardContent(info);
            alert('✅ 截图已复制到系统剪贴板！\n\n您现在可以在任何地方粘贴这张图片了！');

            return true;
        } catch (error) {
            console.error('复制到剪贴板失败:', error);
            alert('❌ 复制到剪贴板失败: ' + error.message);
            return false;
        }
    };

    // 从剪贴板读取
    const pasteFromClipboard = async () => {
        try {
            if (!navigator.clipboard?.read) {
                alert('❌ 当前浏览器不支持剪贴板读取功能');
                return;
            }

            const clipboardItems = await navigator.clipboard.read();

            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const timestamp = new Date().toLocaleString();
                        const size = (blob.size / 1024).toFixed(2);

                        // 创建图片URL用于预览
                        const imageUrl = URL.createObjectURL(blob);
                        const img = new Image();

                        img.onload = () => {
                            const info = `📸 在剪贴板中发现图片！\n\n📅 时间: ${timestamp}\n📦 类型: ${blob.type}\n📊 大小: ${size} KB\n📐 尺寸: ${img.width} x ${img.height} 像素\n\n✅ 图片信息已加载，现在可以保存了！`;
                            setClipboardContent(info);
                            URL.revokeObjectURL(imageUrl);
                        };

                        img.src = imageUrl;
                        alert('✅ 已从剪贴板读取到图片！请查看下方信息。');
                        return;
                    }
                }
            }

            alert('❌ 剪贴板中没有找到图片\n\n💡 请确保:\n1. 已经复制了图片\n2. 浏览器有剪贴板访问权限');
        } catch (error) {
            console.error('粘贴失败:', error);
            alert('❌ 读取剪贴板失败: ' + error.message);
        }
    };

    // 保存截图
    const saveScreenshot = async (canvas: HTMLCanvasElement, description?: string) => {
        try {
            const timestamp = new Date().toLocaleString();
            const dataUrl = canvas.toDataURL('image/png');

            const newScreenshot: SavedScreenshot = {
                id: generateId(),
                imageData: dataUrl,
                metadata: {
                    filename: `screenshot_${Date.now()}.png`,
                    timestamp,
                    size: Math.round((dataUrl.length * 3) / 4), // 估算文件大小
                    dimensions: {
                        width: canvas.width,
                        height: canvas.height,
                    },
                    description,
                },
            };

            setSavedScreenshots(prev => [newScreenshot, ...prev]);
            alert('✅ 截图已保存成功！');
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            alert('❌ 保存失败: ' + error.message);
            return false;
        }
    };

    // 删除截图
    const deleteScreenshot = (id: string) => {
        setSavedScreenshots(prev => prev.filter(item => item.id !== id));
        alert('🗑️ 截图已删除！');
    };

    // 下载截图
    const downloadScreenshot = (screenshot: SavedScreenshot) => {
        const link = document.createElement('a');
        link.download = screenshot.metadata.filename;
        link.href = screenshot.imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('📥 截图已开始下载！');
    };

    // 测试剪贴板功能
    const testClipboard = async () => {
        try {
            if (!navigator.clipboard) {
                alert('❌ 浏览器不支持剪贴板API');
                return;
            }

            await navigator.clipboard.writeText('🧪 剪贴板测试 - ' + new Date().toLocaleString());
            const text = await navigator.clipboard.readText();

            alert('✅ 剪贴板功能正常！\n\n💡 测试结果:\n- 写入功能: ✅ 正常\n- 读取功能: ✅ 正常\n- 当前内容: ' + text);
        } catch (error) {
            console.error('剪贴板测试失败:', error);
            alert('❌ 剪贴板功能异常: ' + error.message);
        }
    };

    return {
        savedScreenshots,
        clipboardContent,
        setClipboardContent,
        copyToClipboard,
        pasteFromClipboard,
        saveScreenshot,
        deleteScreenshot,
        downloadScreenshot,
        testClipboard,
    };
}

export default function EnhancedPDPPage() {
    const {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        isCapturing,
        isCustomMode,
        setIsCustomMode,
        selection,
        captureFullImage,
        captureCustomArea,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        cancelSelection,
        imageContainerRef,
    } = useCustomScreenshot();

    const {
        savedScreenshots,
        clipboardContent,
        setClipboardContent,
        copyToClipboard,
        pasteFromClipboard,
        saveScreenshot,
        deleteScreenshot,
        downloadScreenshot,
        testClipboard,
    } = useClipboardManager();

    // 键盘快捷键
    useHotkeys('ctrl+shift+s, cmd+shift+s', () => handleFullScreenshot(), { preventDefault: true });
    useHotkeys('ctrl+shift+c, cmd+shift+c', () => setIsCustomMode(!isCustomMode), { preventDefault: true });
    useHotkeys('escape', () => cancelSelection(), { preventDefault: true });

    // 全屏截图处理
    const handleFullScreenshot = async () => {
        const canvas = await captureFullImage();
        if (canvas) {
            await copyToClipboard(canvas);
        }
    };

    // 自定义截图处理
    const handleCustomScreenshot = async () => {
        const canvas = await captureCustomArea();
        if (canvas) {
            await copyToClipboard(canvas);
            cancelSelection();
        }
    };

    // 保存当前剪贴板内容
    const handleSaveFromClipboard = async () => {
        if (!clipboardContent.trim()) {
            alert('❌ 请先从剪贴板粘贴内容');
            return;
        }

        // 如果有剪贴板图片，尝试获取并保存
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();

                        img.onload = async () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx?.drawImage(img, 0, 0);
                            await saveScreenshot(canvas, '从剪贴板保存');
                            URL.revokeObjectURL(img.src);
                        };

                        img.src = URL.createObjectURL(blob);
                        return;
                    }
                }
            }
        } catch (error) {
            console.error('保存剪贴板图片失败:', error);
        }

        // 如果没有图片，保存文本信息
        alert('ℹ️ 未找到剪贴板图片，仅保存文本信息');
    };

    return (
        <div className="container mx-auto max-w-7xl space-y-6 p-6">
            {/* 标题区域 */}
            <div className="text-center">
                <h1 className="mb-2 text-4xl font-bold text-gray-800">
                    🔥 Nike Air Max 270 - 智能截图展示页
                </h1>
                <p className="text-lg text-gray-600">
                    🖼️ 支持全屏截图 | ✂️ 自定义区域截图 | 📋 Clipboard Management | 💾 图片保存
                </p>
            </div>

            {/* 快捷键提示 */}
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>⌨️ 快捷键操作</AlertTitle>
                <AlertDescription>
                    <div className="grid grid-cols-1 gap-1 text-sm md:grid-cols-3">
                        <div>🔴 Ctrl+Shift+S: 全屏截图</div>
                        <div>✂️ Ctrl+Shift+C: 自定义截图</div>
                        <div>❌ ESC: 取消选择</div>
                    </div>
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Side - Product Image Area */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <span>🖼️ Product Image</span>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    🔍
                                    {' '}
                                    {Math.round(zoomLevel * 100)}
                                    %
                                </Badge>
                                {isCustomMode && (
                                    <Badge variant="destructive">
                                        ✂️ 自定义模式
                                    </Badge>
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* 缩放控制 */}
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={zoomOut}
                                    disabled={zoomLevel <= 0.5}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                    Zoom Out
                                </Button>
                                <Button variant="outline" size="sm" onClick={resetZoom}>
                                    Reset
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={zoomIn}
                                    disabled={zoomLevel >= 4}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                    Zoom In
                                </Button>
                            </div>

                            {/* Product Image Container */}
                            <div
                                id="screenshot-area"
                                ref={imageContainerRef}
                                className={`relative flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-gray-50 p-4 ${
                                    isCustomMode ? 'cursor-crosshair border-blue-500' : 'border-gray-300'
                                }`}
                                style={{ minHeight: '400px' }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                            >
                                <img
                                    src="/src/assets/images/8.jpg"
                                    alt="Nike Air Max 270"
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        transition: 'transform 0.3s ease-in-out',
                                    }}
                                    className="max-h-96 max-w-full object-contain"
                                    draggable={false}
                                />

                                {/* 选择覆盖层 */}
                                {isCustomMode && selection.isSelecting && (
                                    <div
                                        className="bg-opacity-20 absolute border-2 border-blue-500 bg-blue-200"
                                        style={{
                                            left: Math.min(selection.startX, selection.endX),
                                            top: Math.min(selection.startY, selection.endY),
                                            width: Math.abs(selection.endX - selection.startX),
                                            height: Math.abs(selection.endY - selection.startY),
                                        }}
                                    >
                                        <div className="absolute -top-6 left-0 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                            {Math.abs(selection.endX - selection.startX)}
                                            {' '}
                                            x
                                            {Math.abs(selection.endY - selection.startY)}
                                        </div>
                                    </div>
                                )}

                                {/* 自定义模式提示 */}
                                {isCustomMode && !selection.isSelecting && (
                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                                        <div className="rounded-lg bg-white p-4 text-center">
                                            <Square className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                                            <p className="text-sm font-medium">点击并拖拽选择截图区域</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 截图操作按钮 */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={handleFullScreenshot}
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
                                        onClick={() => setIsCustomMode(!isCustomMode)}
                                        variant={isCustomMode ? 'destructive' : 'outline'}
                                        size="lg"
                                    >
                                        {isCustomMode
                                            ? (
                                                    <>
                                                        <X className="mr-2 h-4 w-4" />
                                                        取消选择
                                                    </>
                                                )
                                            : (
                                                    <>
                                                        <Square className="mr-2 h-4 w-4" />
                                                        自定义截图
                                                    </>
                                                )}
                                    </Button>
                                </div>

                                {isCustomMode && selection.isSelecting && (
                                    <Button
                                        onClick={handleCustomScreenshot}
                                        disabled={isCapturing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        截取选中区域
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 右侧 - 剪贴板管理区域 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clipboard className="h-5 w-5" />
                            📋 Clipboard Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 功能说明 */}
                        <Alert>
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>🔄 剪贴板工作流程</AlertTitle>
                            <AlertDescription>
                                <div className="mt-2 space-y-1 text-sm">
                                    <div>1️⃣ 截图会自动复制到系统剪贴板</div>
                                    <div>2️⃣ 在任何应用中 Ctrl+V 即可粘贴图片</div>
                                    <div>3️⃣ 点击"从剪贴板粘贴"查看图片信息</div>
                                    <div>4️⃣ 点击"保存截图"永久保存到列表</div>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* 剪贴板操作按钮 */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={testClipboard}
                                variant="outline"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                测试剪贴板
                            </Button>

                            <Button
                                onClick={pasteFromClipboard}
                                variant="outline"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                从剪贴板粘贴
                            </Button>
                        </div>

                        {/* 剪贴板内容显示 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">📋 剪贴板内容预览：</label>
                            <Textarea
                                value={clipboardContent}
                                onChange={(e) => setClipboardContent(e.target.value)}
                                placeholder="剪贴板内容和图片信息将显示在这里..."
                                rows={6}
                                className="min-h-32"
                            />
                        </div>

                        {/* 保存按钮 */}
                        <Button
                            onClick={handleSaveFromClipboard}
                            disabled={!clipboardContent.trim()}
                            className="w-full"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            💾 保存当前内容
                        </Button>

                        {/* 已保存的截图列表 */}
                        {savedScreenshots.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-medium">
                                    📚 已保存截图 (
                                    {savedScreenshots.length}
                                    {' '}
                                    张)
                                </h4>
                                <div className="max-h-96 space-y-3 overflow-y-auto">
                                    {savedScreenshots.map((screenshot) => (
                                        <Card key={screenshot.id} className="p-3">
                                            <div className="space-y-2">
                                                {/* 图片预览 */}
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={screenshot.imageData}
                                                        alt="截图预览"
                                                        className="h-16 w-16 rounded border object-cover"
                                                    />
                                                    <div className="flex-1 text-xs">
                                                        <div className="font-medium">
                                                            📅
                                                            {' '}
                                                            {screenshot.metadata.timestamp}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            📐
                                                            {' '}
                                                            {screenshot.metadata.dimensions.width}
                                                            {' '}
                                                            x
                                                            {' '}
                                                            {screenshot.metadata.dimensions.height}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            📦
                                                            {' '}
                                                            {(screenshot.metadata.size / 1024).toFixed(2)}
                                                            {' '}
                                                            KB
                                                        </div>
                                                        {screenshot.metadata.description && (
                                                            <div className="text-gray-600">
                                                                📝
                                                                {' '}
                                                                {screenshot.metadata.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 操作按钮 */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => downloadScreenshot(screenshot)}
                                                        className="flex-1"
                                                    >
                                                        <Download className="mr-1 h-3 w-3" />
                                                        下载
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteScreenshot(screenshot.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
