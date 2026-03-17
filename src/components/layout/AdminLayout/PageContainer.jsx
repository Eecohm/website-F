import styles from './PageContainer.module.css';

export function PageContainer({ children, maxWidth = '1400px' }) {
    return (
        <div
            className={styles.container}
            style={{ maxWidth }}
        >
            {children}
        </div>
    );
}
