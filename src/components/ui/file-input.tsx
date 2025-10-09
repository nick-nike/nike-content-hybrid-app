"use client"

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileInputProps {
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    maxSize?: number; // in bytes
    maxFiles?: number;
    className?: string;
    children?: React.ReactNode;
    onFilesSelect: (files: File[]) => void;
    onError?: (error: string) => void;
}

export function FileInput({
    accept = 'image/*',
    multiple = false,
    disabled = false,
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    className,
    children,
    onFilesSelect,
    onError,
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const validateFiles = (files: File[]): File[] => {
        const validFiles: File[] = [];
        
        for (const file of files) {
            // 检查文件大小
            if (file.size > maxSize) {
                onError?.(`File "${file.name}" is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
                continue;
            }
            
            // 检查文件类型
            if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
                onError?.(`File "${file.name}" is not a supported type`);
                continue;
            }
            
            validFiles.push(file);
        }
        
        // 检查文件数量
        if (validFiles.length > maxFiles) {
            onError?.(`Too many files. Maximum is ${maxFiles}`);
            return validFiles.slice(0, maxFiles);
        }
        
        return validFiles;
    };

    const handleFileSelect = (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles = validateFiles(fileArray);
        
        if (validFiles.length > 0) {
            setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
            onFilesSelect(validFiles);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileSelect(e.target.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        if (disabled) return;
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelect(files);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* 文件输入区域 */}
            <div
                className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                    isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50',
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleInputChange}
                    className="hidden"
                />
                
                {children || (
                    <div className="space-y-2">
                        <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {accept} files up to {formatFileSize(maxSize)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 选中的文件列表 */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Selected Files ({selectedFiles.length})</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFiles}
                        >
                            Clear All
                        </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted rounded-lg"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
