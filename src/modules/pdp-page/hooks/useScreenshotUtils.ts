// 通用的html2canvas配置
export const getHtml2CanvasConfig = (scale = 2) => ({
    useCORS: true,
    allowTaint: true,
    scale,
    backgroundColor: '#ffffff',
    onclone: (clonedDocument: Document) => {
        // 过滤掉包含 oklch 的 CSS 规则
        const styles = clonedDocument.querySelectorAll('style');
        styles.forEach((style) => {
            if (style.textContent && style.textContent.includes('oklch')) {
                style.textContent = style.textContent.replace(
                    /[^{}]*oklch[^}]*}/g,
                    '',
                );
            }
        });
    },
});

// 复制图片到剪贴板的通用函数
export const copyImageToClipboard = async (blob: Blob): Promise<void> => {
    try {
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
        ]);
        console.log('Image copied to clipboard successfully');
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        throw error;
    }
};

// 创建一个裁剪助手函数
export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob> => {
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Canvas is empty');
            }
            resolve(blob);
        }, 'image/png');
    });
};
