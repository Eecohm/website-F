import { PageContainer } from '@/components/layout/AdminLayout/PageContainer';

export default function SystemLogs() {
    return (
        <PageContainer>
            <div style={{ padding: 'var(--space-4)', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h2 style={{ marginBottom: 'var(--space-1)', color: 'var(--teal-700)' }}>System Logs</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                    Detailed audit trail of all platform activities and security events.
                </p>
                <div style={{ padding: 'var(--space-6)', border: '2px dashed var(--teal-100)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--teal-400)' }}>
                    Log viewer UI is coming soon.
                </div>
            </div>
        </PageContainer>
    );
}
