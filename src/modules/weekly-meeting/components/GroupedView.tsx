import React, { useMemo } from 'react';
import { WeeklyMeetingItem, GroupBy } from '../types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface GroupedViewProps {
    data: WeeklyMeetingItem[];
    groupBy: GroupBy;
}

export const GroupedView: React.FC<GroupedViewProps> = ({ data, groupBy }) => {
    const groupedData = useMemo(() => {
        const groups: Record<string, WeeklyMeetingItem[]> = {};
        data.forEach(item => {
            const key = item[groupBy] || 'Unknown';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return groups;
    }, [data, groupBy]);

    const groupKeys = Object.keys(groupedData).sort();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
                Items by {groupBy}
            </h2>

            <Accordion type="multiple" defaultValue={groupKeys} className="space-y-4">
                {groupKeys.map((group) => (
                    <AccordionItem key={group} value={group} className="border rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-sm px-4">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{group}</span>
                                <Badge variant="secondary" className="rounded-full px-3">
                                    {groupedData[group].length} items
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="grid gap-4 pt-2">
                                {groupedData[group].map((item, index) => (
                                    <div
                                        key={item.Number || index}
                                        className="p-4 rounded-md border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        {item.Number}
                                                    </span>
                                                    <h4 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                                                        {item.Summary?.split('\n')[0]}
                                                    </h4>
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400 pl-1 whitespace-pre-wrap mt-2">
                                                    {item.Summary}
                                                </div>

                                                {item['Resolution notes'] && (
                                                    <div className="mt-3 bg-green-50 dark:bg-green-900/10 p-3 rounded text-sm text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/20">
                                                        <span className="font-semibold block mb-1 text-xs uppercase tracking-wider">Resolution</span>
                                                        {item['Resolution notes']}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <Badge
                                                    className={`
                                                        ${item['Difficulty Level'] === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' : ''}
                                                        ${item['Difficulty Level'] === 'Medium' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200' : ''}
                                                        ${item['Difficulty Level'] === 'Easy' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : ''}
                                                    `}
                                                    variant="outline"
                                                >
                                                    {item['Difficulty Level']}
                                                </Badge>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    Weight: {item.Weight}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
