import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyMeetingItem } from '../types';

interface DashboardViewProps {
    data: WeeklyMeetingItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
    // Calculate stats
    const totalItems = data.length;
    const highPriority = data.filter(i => i['Difficulty Level'] === 'High').length;
    const mediumPriority = data.filter(i => i['Difficulty Level'] === 'Medium').length;

    // Group by Category for Chart
    const categoryStats = React.useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            const cat = item.Category || 'Unknown';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    // Group by Assignee for Chart
    const assigneeStats = React.useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            const name = item['Assigned to'] || 'Unassigned';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">{totalItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">For this week</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">High Difficulty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-red-600">{highPriority}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items requiring attention</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Medium Difficulty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-yellow-600">{mediumPriority}</div>
                        <p className="text-xs text-muted-foreground mt-1">Standard complexity</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-none bg-white/80">
                    <CardHeader>
                        <CardTitle>Distribution by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryStats} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-none bg-white/80">
                    <CardHeader>
                        <CardTitle>Workload by Assignee</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assigneeStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {assigneeStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
