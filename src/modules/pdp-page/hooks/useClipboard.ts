import { useState } from 'react';

export function useClipboard() {
    const [clipboardContent, setClipboardContent] = useState('');
    const [lastImageBlob, setLastImageBlob] = useState<Blob | null>(null);
    const [lastImageUrl, setLastImageUrl] = useState<string | null>(null);

    // 从剪贴板中粘贴
    const pasteFromClipboard = async () => {
        try {
            if (!navigator.clipboard?.read) {
                alert('当前浏览器不支持剪贴板读取功能');
                return null;
            }

            console.log('开始读取剪贴板...');
            const clipboardItems = await navigator.clipboard.read();
            console.log('剪贴板项目数量:', clipboardItems.length);

            if (clipboardItems.length === 0) {
                alert('剪贴板为空，请先进行截图操作');
                return null;
            }

            let foundImage = false;
            for (const item of clipboardItems) {
                console.log('剪贴板项目类型:', item.types);

                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        foundImage = true;
                        const blob = await item.getType(type);
                        const timestamp = new Date().toLocaleString();
                        const size = (blob.size / 1024).toFixed(2);
                        const imageInfo = `产品截图 - ${timestamp}\n类型: ${blob.type}\n大小: ${size} KB`;

                        setClipboardContent(imageInfo);
                        setLastImageBlob(blob);

                        // 创建临时URL用于预览
                        const imageUrl = URL.createObjectURL(blob);
                        setLastImageUrl(imageUrl);

                        alert('图片已粘贴！现在可以点击保存按钮');
                        return blob;
                    }
                }
            }

            if (!foundImage) {
                alert('剪贴板中没有找到图片，请确保先进行截图操作');
            }
            return null;
        } catch (error) {
            console.error('粘贴失败:', error);
            alert('粘贴失败，请确保先进行截图操作');
            return null;
        }
    };

    // 测试剪贴板功能
    const testClipboard = async () => {
        try {
            if (!navigator.clipboard) {
                alert('浏览器不支持剪贴板API');
                return;
            }

            // 测试写入文本
            await navigator.clipboard.writeText('测试文本 - ' + new Date().toLocaleString());

            // 测试读取
            const text = await navigator.clipboard.readText();
            console.log('剪贴板文本:', text);

            alert('剪贴板功能正常！可以进行截图操作了');
        } catch (error) {
            console.error('剪贴板测试失败:', error);
            alert('剪贴板功能异常，请检查浏览器权限设置');
        }
    };

    // 复制到系统剪贴板
    const copyToSystemClipboard = async (blob: Blob) => {
        try {
            if (!navigator.clipboard) {
                alert('浏览器不支持剪贴板API');
                return;
            }

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ]);
            alert('图片已复制到系统剪贴板！您可以在其他应用中粘贴使用');
        } catch (error) {
            console.error('复制到系统剪贴板失败:', error);
            alert('复制到系统剪贴板失败');
        }
    };

    // 清理资源
    const cleanup = () => {
        if (lastImageUrl) {
            URL.revokeObjectURL(lastImageUrl);
            setLastImageUrl(null);
        }
    };

    return {
        clipboardContent,
        setClipboardContent,
        pasteFromClipboard,
        testClipboard,
        lastImageBlob,
        setLastImageBlob,
        lastImageUrl,
        setLastImageUrl,
        copyToSystemClipboard,
        cleanup,
    };
}
