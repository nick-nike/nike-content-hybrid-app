export type CalendarCloudState = {
    meetingInputs?: Record<string, unknown>;
    gatewayDateOverrides?: Record<string, unknown>;
    gatewayStatuses?: Record<string, unknown>;
    customProjects?: unknown[];
    manualGatewayMarkers?: Record<string, unknown>;
    projectIdentityOverrides?: Record<string, unknown>;
};

const STATE_TABLE = 'project_calendar_state';

const normalizeSupabaseUrl = (value?: string) => {
    if (!value) {
        return '';
    }

    return value.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
};

const supabaseUrl = normalizeSupabaseUrl(
    import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_REST_URL,
);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const headers = () => ({
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
});

export const isCalendarCloudConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const loadCalendarState = async (id: string): Promise<CalendarCloudState | null> => {
    if (!isCalendarCloudConfigured()) {
        return null;
    }

    const response = await fetch(
        `${supabaseUrl}/rest/v1/${STATE_TABLE}?id=eq.${encodeURIComponent(id)}&select=data`,
        { headers: headers() },
    );

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Supabase load failed: ${response.status} ${detail}`);
    }

    const rows = await response.json() as { data?: CalendarCloudState }[];
    return rows[0]?.data ?? null;
};

export const saveCalendarState = async (id: string, data: CalendarCloudState) => {
    if (!isCalendarCloudConfigured()) {
        return;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${STATE_TABLE}?on_conflict=id`, {
        method: 'POST',
        headers: {
            ...headers(),
            Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
            id,
            data,
            updated_at: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Supabase save failed: ${response.status} ${detail}`);
    }
};
