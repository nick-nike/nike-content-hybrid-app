import { Camera, X } from 'lucide-react';
import Cropper from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface CropDialogProps {
    isOpen: boolean;
    imageSrc: string | null;
    crop: { x: number; y: number };
    zoom: number;
    onClose: () => void;
    onCropChange: (crop: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
    onConfirmCrop: () => void;
}

export function CropDialog({
    isOpen,
    imageSrc,
    crop,
    zoom,
    onClose,
    onCropChange,
    onZoomChange,
    onCropComplete,
    onConfirmCrop,
}: CropDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-[90vh] max-w-3xl">
                <DialogTitle>自定义截图</DialogTitle>
                <div className="relative mt-4 h-[60vh] w-full">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={onCropChange}
                            onCropComplete={onCropComplete}
                            onZoomChange={onZoomChange}
                            classes={{
                                containerClassName: 'h-full',
                            }}
                        />
                    )}
                </div>
                <div className="mt-2 space-y-4">
                    <div className="flex items-center">
                        <span className="mr-2 text-sm">缩放:</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="flex-1"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            取消
                        </Button>
                        <Button onClick={onConfirmCrop}>
                            <Camera className="mr-2 h-4 w-4" />
                            确认截图
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
