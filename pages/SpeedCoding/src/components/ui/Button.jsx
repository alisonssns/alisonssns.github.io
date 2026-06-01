import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', onClick, type = 'button', className }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}