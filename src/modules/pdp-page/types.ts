export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CroppedAreaPixels {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ScreenshotData {
    id: string;
    content: string;
    timestamp: string;
    imageUrl: string;
    imageBlob: Blob;
}
