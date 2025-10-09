import { ImageIcon, Camera, Crop, Download, Share2 } from 'lucide-react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ImageToolkit - Core components and utilities for image processing
 *
 * This module provides the base functionality for image manipulation,
 * screenshots, and other image-related tools. It serves as a foundation
 * that can be extended by other modules like image-toolkit-demo.
 */

// Core component for image toolkit functionality
export const ImageToolkitBase: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Image Toolkit</h1>
                <p className="text-gray-600">Core image processing functionality</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="flex w-full items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Take Screenshot
                        </Button>
                        <Button variant="outline" className="flex w-full items-center gap-2">
                            <Crop className="h-4 w-4" />
                            Crop Image
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Export ImageToolkitPage for backward compatibility with existing imports
export const ImageToolkitPage = ImageToolkitBase;

// Export individual tool components that can be reused
export const ScreenshotTool: React.FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Screenshot Tool
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-gray-600">
                Capture and annotate screenshots
            </p>
            <Button variant="outline" className="w-full">
                Capture Screenshot
            </Button>
        </CardContent>
    </Card>
);

export const ImageUploadTool: React.FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Upload
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-gray-600">
                Upload and process images
            </p>
            <Button variant="outline" className="w-full">
                Upload Image
            </Button>
        </CardContent>
    </Card>
);

export const ImageCropTool: React.FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Crop className="h-5 w-5" />
                Crop & Resize
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-gray-600">
                Crop and resize images
            </p>
            <Button variant="outline" className="w-full">
                Open Crop Tool
            </Button>
        </CardContent>
    </Card>
);

export const ImageExportTool: React.FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Options
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-gray-600">
                Export in various formats
            </p>
            <Button variant="outline" className="w-full">
                Export Image
            </Button>
        </CardContent>
    </Card>
);

export const ImageSharingTool: React.FC = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Image
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-gray-600">
                Share images directly
            </p>
            <Button variant="outline" className="w-full">
                Share Image
            </Button>
        </CardContent>
    </Card>
);
