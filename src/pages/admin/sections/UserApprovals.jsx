import { PageContainer } from '@/components/layout/AdminLayout/PageContainer';

export default function UserApprovals() {
    return (
        <PageContainer>
            <div style={{ padding: 'var(--space-4)', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h2 style={{ marginBottom: 'var(--space-1)', color: 'var(--navy-700)' }}>User Approvals</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                    Review pending registration requests from teachers and students.
                </p>
                <div style={{ padding: 'var(--space-6)', border: '2px dashed var(--navy-100)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--navy-400)' }}>
                    Approval management UI is coming soon.
                </div>
            </div>
        </PageContainer>
    );
}
