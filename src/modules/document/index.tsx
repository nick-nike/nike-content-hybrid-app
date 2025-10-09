/* eslint-disable max-lines-per-function */

import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentData {
    title: string;
    type: string;
    path: string;
    lastModified: string;
    state: string;
    facets: string[];
    properties?: {
        'file:content'?: {
            name?: string;
            'mime-type'?: string;
            encoding?: string | null;
            digestAlgorithm?: string;
            digest?: string;
            length?: string;
            data: string;// 图片URL
        };
        'picture:views'?: {
            title: string;
            content: {
                data: string;
            };
            width?: number;
            height?: number;
        }[];
        'nxtag:tags'?: { label: string; username: string }[];
        'dc:created'?: string;
        'dc:creator'?: string;
        'dc:contributors'?: string;
    };
}

// 单独的字段展示组件
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-3 flex flex-col sm:flex-row">
            <div className="w-full text-sm font-medium text-gray-500 sm:w-1/3">{label}</div>
            <div className="w-full text-sm sm:w-2/3">{children}</div>
        </div>
    );
}

// 徽章组件
function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {children}
        </span>
    );
}

// Facets 列表组件
function Facets({ facets }: { facets: string[] }) {
    return (
        <Field label="Facets">
            <div className="flex flex-wrap gap-1">
                {facets.map((facet, idx) => (
                    <Badge key={idx}>{facet}</Badge>
                ))}
            </div>
        </Field>
    );
}

// 卡片标题组件
function CardTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-4 border-b pb-2 text-lg font-medium">{children}</h2>
    );
}

export function Main() {
    const { documentId } = useParams() as { documentId?: string };
    // 添加状态来存储API获取的数据
    const [documentData, setDocumentData] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // 添加状态来存储图片的base64数据
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState<string | null>(null);

    // 从API获取文档数据
    useEffect(() => {
        if (!documentId) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `https://ae1bzam443.execute-api.cn-northwest-1.amazonaws.com.cn/Stage/document?id=${documentId}`,
                );

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();
                setDocumentData(data);
            } catch (err) {
                console.error('Error fetching document:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch document data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [documentId]);

    // 单独的 API 获取图片 base64 数据
    useEffect(() => {
        if (!documentId) return;

        setImageLoading(true);
        setImageError(null);

        // 获取 base64 图片
        fetch(`https://ae1bzam443.execute-api.cn-northwest-1.amazonaws.com.cn/Stage/document?id=${documentId}&type=image`)
            .then((res) => {
                if (!res.ok) throw new Error(`图片加载失败: ${res.status}`);
                return res.text(); // 注意：不是 res.json()
            })
            .then((base64) => {
                setImageBase64(`data:image/png;base64,${base64}`);
                setImageLoading(false);
            })
            .catch((err) => {
                console.error('图片加载失败：', err);
                setImageError(err instanceof Error ? err.message : '图片加载失败');
                setImageLoading(false);
            });
    }, [documentId]);

    // 格式化日期的函数
    const formattedDate = useMemo(() => {
        if (!documentData?.lastModified) return '';
        return new Date(documentData.lastModified).toLocaleString();
    }, [documentData?.lastModified]);

    // 格式化创建日期
    const formattedCreatedDate = useMemo(() => {
        if (!documentData?.properties?.['dc:created']) return '';
        return new Date(documentData.properties['dc:created']).toLocaleString();
    }, [documentData?.properties]);

    // 加载状态时显示加载指示器
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                    <p className="text-gray-600">加载文档中...</p>
                </div>
            </div>
        );
    }

    // 错误状态时显示错误信息
    if (error || !documentData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <h2 className="mb-4 text-xl font-bold text-red-600">加载失败</h2>
                    <p className="text-gray-600">{error || '无法加载文档数据'}</p>
                    <button
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                        onClick={() => window.location.reload()}
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 顶部标题栏 */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
                <h1 className="max-w-[60%] truncate text-lg font-semibold">
                    {documentData.title || 'Document Page'}
                </h1>
                <div className="flex gap-2">
                    <Button className="rounded bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700">
                        下载
                    </Button>
                    <Button variant="outline" className="rounded px-3 py-1 transition-colors hover:bg-gray-50">
                        更多操作
                    </Button>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="p-4 md:p-6">
                {/* 上半部分：使用 grid 确保对齐 */}
                <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-full overflow-hidden p-0">
                            <div className="aspect-video w-full bg-gray-800">
                                {imageLoading
                                    ? (
                                            <div className="flex h-full items-center justify-center">
                                                <div className="text-center text-white">
                                                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                                                    <p>加载图片中...</p>
                                                </div>
                                            </div>
                                        )
                                    : imageError
                                        ? (
                                                <div className="flex h-full items-center justify-center">
                                                    <div className="text-center text-white">
                                                        <p>图片加载失败</p>
                                                        <p className="text-sm">{imageError}</p>
                                                        <button
                                                            className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs text-white"
                                                            onClick={() => window.location.reload()}
                                                        >
                                                            重试
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        : imageBase64
                                            ? (
                                                    <img
                                                        src={imageBase64}
                                                        alt={documentData.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                )
                                            : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <div className="text-center text-white">
                                                            <p>无图片数据</p>
                                                        </div>
                                                    </div>
                                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="h-full p-4">
                            <CardTitle>文档信息</CardTitle>
                            <div className="space-y-3">
                                <Field label="状态">
                                    <Badge>{documentData.state}</Badge>
                                </Field>
                                <Field label="修改时间">
                                    <time dateTime={documentData.lastModified}>
                                        {formattedDate}
                                    </time>
                                </Field>
                                <Field label="创建时间">
                                    <time dateTime={documentData.properties?.['dc:created'] || ''}>
                                        {formattedCreatedDate}
                                    </time>
                                </Field>
                                <Field label="创建者">{documentData.properties?.['dc:creator']}</Field>
                                <Field label="贡献者">{documentData.properties?.['dc:contributors']}</Field>
                                <Field label="标题">{documentData.title}</Field>
                                <Field label="标签">
                                    <div className="flex flex-wrap gap-1">
                                        {documentData.properties?.['nxtag:tags']?.map((tag, idx) => (
                                            <Badge key={idx}>{tag.label}</Badge>
                                        ))}
                                    </div>
                                </Field>
                                <Facets facets={documentData.facets} />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 底部四个区域 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Picture Info */}
                    <Card className="flex h-full flex-col p-4">
                        <CardTitle>Picture Info</CardTitle>
                        <div className="space-y-3">
                            <Field label="尺寸">1920 x 1080 px</Field>
                            <Field label="颜色空间">RGB</Field>
                            <Field label="格式">JPEG</Field>
                            <Field label="分辨率">72 dpi</Field>
                        </div>
                    </Card>

                    {/* Additional Format */}
                    <Card className="flex h-full flex-col p-4">
                        <CardTitle>Additional Format</CardTitle>
                        <div className="space-y-3">
                            <Field label="格式">
                                <div className="flex flex-wrap gap-1">
                                    <Badge>PNG</Badge>
                                    <Badge>TIFF</Badge>
                                    <Badge>WebP</Badge>
                                </div>
                            </Field>
                            <Field label="可用尺寸">
                                <div className="flex flex-wrap gap-1">
                                    <Badge>原始尺寸</Badge>
                                    <Badge>中等</Badge>
                                    <Badge>缩略图</Badge>
                                </div>
                            </Field>
                        </div>
                    </Card>

                    {/* Metadata */}
                    <Card className="flex h-full flex-col p-4">
                        <CardTitle>Metadata</CardTitle>
                        <div className="space-y-3">
                            <Field label="路径">{documentData.path}</Field>
                            <Field label="类型">{documentData.type}</Field>
                            <Field label="大小">
                                {documentData.properties?.['file:content']?.length
                                    ? `${Math.round(parseInt(documentData.properties['file:content'].length) / 1024)} KB`
                                    : '未知'}
                            </Field>
                        </div>
                    </Card>

                    {/* Usage Info */}
                    <Card className="flex h-full flex-col p-4">
                        <CardTitle>Usage Info</CardTitle>
                        <div className="space-y-3">
                            <Field label="浏览次数">128</Field>
                            <Field label="下载次数">45</Field>
                            <Field label="关联文档">3</Field>
                            <Field label="最近访问">
                                <time>{new Date().toLocaleDateString()}</time>
                            </Field>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
