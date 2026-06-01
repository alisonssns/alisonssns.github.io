import styles from './StatDisplay.module.css';

export default function StatDisplay({ icon, label, value, unit, className }) {
    return (
        <div className={`${styles.statItem} ${className}`}>
            <span className={styles.icon} aria-label={label} role="img">{icon}</span>
            <div className={styles.details}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>
                    {value}
                    {unit && <span className={styles.unit}>{unit}</span>}
                </span>
            </div>
        </div>
    );
}