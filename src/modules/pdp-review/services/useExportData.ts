import type { ImageAnnotation } from '@annotorious/react';
import { useAnnotator } from '@annotorious/react';
import { useCallback } from 'react';
import { LineColor, LineWidth } from '../components/ToolBox';
import { useStyles } from './useStyles';

const useExportData = () => {
    const annotator = useAnnotator();
    const { getLineStyle } = useStyles();

    const exportJsonData = useCallback(() => {
        if (!annotator) return;
        const data = annotator.getAnnotations().map((annotation: ImageAnnotation) => {
            console.log('export annotation', annotation);
            const style = getLineStyle(annotation.id) || {
                lineColor: LineColor.RED,
                lineWidth: LineWidth.THIN,
            };
            return {
                id: annotation.id,
                style,
                body: annotation.target.selector,
            };
        });
        const json = JSON.stringify(data, null, 2);
        console.log('Exported Annotations:', json);
    }, [annotator, getLineStyle]);

    return {
        exportJsonData,
    };
};

export { useExportData };
