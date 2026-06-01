import styles from './Input.module.css';

export default function Input({ placeholder, type = 'text', name, value, onChange, ...props }) {
    return (
        <div className={styles.inputGroup}>
            <input 
                type={type} 
                name={name}
                value={value}    
                onChange={onChange} 
                className={styles.input}
                placeholder='  '
                required     
                {...props}
            />
            <span className={styles.text}>{placeholder}</span>
        </div>
    );
}