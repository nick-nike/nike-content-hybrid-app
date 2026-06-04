export interface WeeklyMeetingItem {
    Category: string;
    Number: string;
    'Assigned to': string;
    'Difficulty Level'?: 'Easy' | 'Medium' | 'High';
    Weight?: number;
    Summary: string;
    'Resolution notes'?: string | null;
    Rationale?: string | number | null;
    State: string;
    'Due date'?: string;
    Priority?: string;
    Resolved?: string;
    Created?: string;
}

export interface TicketData {
    'Number': string;
    'Summary': string;
    'State': string;
    'Assigned to': string;
    'Category': string;
    'Resolved'?: string;
    'Due date'?: string;
    'Resolution notes'?: string;
    'Priority'?: string;
    [key: string]: any;
}

export type GroupBy = 'Category' | 'Assigned to';
