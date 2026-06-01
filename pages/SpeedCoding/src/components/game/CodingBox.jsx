
import { useState, useEffect, useRef } from "react";
import styles from './CodingBox.module.css';

export default function CodingBox({ word, onStatsUpdate }) {
    const [typed, setTyped] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [finished, setFinished] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const typedRef = useRef("");

    useEffect(() => {
        typedRef.current = typed;
    }, [typed]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (finished) return;

            if (event.ctrlKey || event.metaKey || event.altKey) return;

            const { key } = event;
            const currentTargetChar = word[typed.length];

            if (!startTime && key.length === 1) {
                setStartTime(Date.now());
            }

            if (key === 'Backspace') {
                setTyped((prev) => prev.slice(0, -1));
                return;
            }

            if (key === 'Enter') {
                event.preventDefault();
                if (currentTargetChar === '\n') {
                    setTyped((prev) => prev + '\n');
                } else {
                    triggerError();
                }
                return;
            }

            if (key === 'Tab') {
                event.preventDefault();
                const nextFour = word.slice(typed.length, typed.length + 4);
                if (nextFour === '    ') {
                    setTyped((prev) => prev + '    ');
                } else {
                    triggerError();
                }
                return;
            }

            if (key.length === 1) {
                if (key === currentTargetChar) {
                    setTyped((prev) => prev + key);
                } else {
                    triggerError();
                }
            }
        };

        const triggerError = () => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 300);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [finished, startTime, typed, word]);

    useEffect(() => {
        if (!finished && typed === word) {
            setFinished(true);
        }
    }, [typed, word, finished]);

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsedSeconds = (now - startTime) / 1000;
            const currentTyped = typedRef.current;

            const minutes = elapsedSeconds / 60;
            const wordsTyped = currentTyped.length / 5;
            const wpm = minutes > 0 ? wordsTyped / minutes : 0;

            if (onStatsUpdate) {
                onStatsUpdate({
                    wpm: wpm.toFixed(0),
                    time: elapsedSeconds.toFixed(1),
                    finished
                }, finished);
            }

        }, 100);

        return () => clearInterval(interval);

    }, [startTime, finished, onStatsUpdate]);

    return (
        <div className={`${styles.codingContainer} ${isShaking ? styles.shake : ''}`}>
            <pre className={styles.codeLayer}>
                {word.split('').map((char, i) => {
                    let status = 'pending';
                    if (i < typed.length) {
                        status = typed[i] === char ? 'correct' : 'error';
                    }

                    const isCursor = i === typed.length && !finished;

                    return (
                        <span key={i} className={`${styles.char} ${styles[status]} ${isCursor ? styles.cursor : ''}`}>
                            {char === '\n' ? '↵' : char}
                            {char === '\n' && <br />}
                        </span>
                    );
                })}
            </pre>
        </div>
    );
}