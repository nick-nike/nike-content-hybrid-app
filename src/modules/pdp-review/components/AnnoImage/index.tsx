import type { Color, ImageAnnotation } from '@annotorious/react';
import { Annotorious, ImageAnnotator, useAnnotator, useSelection } from '@annotorious/react';
import { useCallback, useEffect, useState, type FC } from 'react';
import { useAnnoLastSelected } from '../../services/useAnnoLastSelected';
import { useExportData } from '../../services/useExportData';
import { useStyles } from '../../services/useStyles';
import type { LineStyle } from '../ToolBox';
import { LineColor, LineWidth, ToolBox } from '../ToolBox';
import { ZoomPane } from '@/components/ZoomPane';
import { ViewPane } from '@/components/ZoomPane/components/ViewPane';
import { ZoomStore } from '@/components/ZoomPane/components/ZoomStore';
import { Button } from '@/components/ui/button';

const testData = [
    {
        id: '5a8e19ce-e8aa-4d70-89fd-e11ab09baf44',
        style: {
            lineColor: '#ff0000',
            lineWidth: 2,
        },
        body: {
            type: 'RECTANGLE',
            geometry: {
                bounds: {
                    minX: 382.2,
                    minY: 355.6,
                    maxX: 819.7,
                    maxY: 719.8,
                },
                x: 382.2,
                y: 355.6,
                w: 437.5,
                h: 364.2,
            },
        },
    },
    {
        id: '4d399f62-e2eb-4047-8d67-9c4d901ca3b4',
        style: {
            lineWidth: 5,
            lineColor: '#0000ff',
        },
        body: {
            type: 'RECTANGLE',
            geometry: {
                bounds: {
                    minX: 1103.5,
                    minY: 615.5,
                    maxX: 1599.1,
                    maxY: 1170.9,
                },
                x: 1103.5,
                y: 615.5,
                w: 495.5,
                h: 555.4,
            },
        },
    },
    {
        id: 'f9207af4-5225-429f-8221-dbe3f46b4db2',
        style: {
            lineWidth: 8,
            lineColor: '#ffff00',
        },
        body: {
            type: 'RECTANGLE',
            geometry: {
                bounds: {
                    minX: 238.8,
                    minY: 1423.3,
                    maxX: 940.3,
                    maxY: 1757.9,
                },
                x: 238.8,
                y: 1423.3,
                w: 701.5,
                h: 334.6,
            },
        },
    },
];

type Props = {
    className?: string;
    imageUrl: string;
};

const Content: FC<Props> = ({ className, imageUrl }) => {
    const { selected } = useSelection();
    const annotator = useAnnotator();
    const { lastSelected, setLastSelected } = useAnnoLastSelected();
    const [defaultStyle, setDefaultStyle] = useState<LineStyle>({
        lineColor: LineColor.RED,
        lineWidth: LineWidth.THIN,
    });

    const { getLineStyle, setLineStyle } = useStyles();
    const { exportJsonData } = useExportData();

    // use keyboard DELETE to remove selected annotations
    const onKeyDown = useCallback((event: KeyboardEvent) => {
        // only remove global last selected annotation
        if (!lastSelected) return;
        // also check if current selected includes last selected
        if ((event.key === 'Delete' || event.key === 'Backspace')) {
            if (!selected.find((item) => item.annotation.id === lastSelected.id)) return;
            annotator.removeAnnotation(lastSelected.id);
        }
    }, [annotator, lastSelected, selected]);

    const onLineStyleChange = useCallback((style: { lineWidth: LineWidth; lineColor: LineColor }) => {
        annotator.setStyle((annotation, state) => {
            // console.log('set style', annotation.id, state);
            // console.log('set style', annotation.id, style);
            if (selected.length > 0 && selected[0].annotation.id !== annotation.id) {
                const preLineStyle = getLineStyle(annotation.id) || defaultStyle;
                return {
                    // fill: '#ffffff00',
                    fillOpacity: 0,
                    stroke: preLineStyle.lineColor,
                    strokeWidth: preLineStyle.lineWidth,
                };
            }
            else {
                setLineStyle(annotation.id, { ...style });
                return {
                    // fill: '#ffffff00',
                    fillOpacity: 0,
                    stroke: style.lineColor,
                    strokeWidth: style.lineWidth,
                };
            }
        });
        setDefaultStyle({ ...style });
    }, [annotator, defaultStyle, getLineStyle, selected, setDefaultStyle, setLineStyle]);

    useEffect(() => {
        if (!annotator) return;
        annotator.setAnnotations(testData.map(item => {
            return {
                id: item.id,
                target: {
                    selector: item.body,
                } as any,
            } as ImageAnnotation;
        }));
        annotator.setStyle((annotation, state) => {
            const style = testData.find(item => item.id === annotation.id)?.style || {
                lineColor: LineColor.RED,
                lineWidth: LineWidth.THIN,
            };

            setLineStyle(annotation.id, style as LineStyle);
            return {
                stroke: style.lineColor as Color,
                strokeWidth: style.lineWidth,
                fill: '#ffffff00',
                fillOpacity: 0,
            };
        });
    }, [annotator, setLineStyle]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    useEffect(() => {
        if (!annotator) return;
        annotator.on('selectionChanged', (annotations: ImageAnnotation[]) => {
            if (!annotations || annotations.length === 0) return;
            setLastSelected(annotations[0]);
        });
    }, [annotator, setLastSelected]);

    useEffect(() => {
        if (!annotator) return;
        // when an annotation is created, deselect it
        annotator.on('createAnnotation', (annotation: ImageAnnotation) => {
            onLineStyleChange(defaultStyle);
            annotator.setSelected([]);
        });
    }, [annotator, defaultStyle, onLineStyleChange]);

    return (
        <div
            className="flex flex-col"
        >
            <div className="flex gap-2">
                <Button onClick={exportJsonData}>Export</Button>
                {selected.length > 0 && (
                    <ToolBox
                        lineStyle={getLineStyle(selected[0].annotation.id) || defaultStyle}
                        onChange={onLineStyleChange}
                    />
                )}
            </div>
            <ViewPane>
                <ImageAnnotator containerClassName="bg-gray-100 !block">
                    <img src={imageUrl} alt="" className="size-full select-none" />
                </ImageAnnotator>
            </ViewPane>
        </div>
    );
};

const AnnoImage: FC<Props> = ({ className, imageUrl }) => {
    return (
        <div className="size-120 overflow-auto border">
            <Annotorious>
                <ZoomStore>
                    <ZoomPane>
                        <Content className={className} imageUrl={imageUrl} />
                    </ZoomPane>
                </ZoomStore>
            </Annotorious>
        </div>
    );
};

export { AnnoImage };
