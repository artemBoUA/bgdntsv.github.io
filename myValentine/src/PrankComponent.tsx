import React, { useState, useRef, useEffect } from 'react';

type PrankComponentProps = {
    onFinalComplete?: () => void;
}

interface Heart {
    id: number;
    top: number;
    left: number;
}

export const PrankComponent: React.FC<PrankComponentProps> = () => {
    const [position, setPosition] = useState({ top: '50%', left: '55%' });
    const [hearts, setHearts] = useState<Heart[]>([]);
    const [isAccepted, setIsAccepted] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isMoving = useRef(false);

    // Відстеження шлейфу
    useEffect(() => {
        let lastTimestamp = 0;
        const trackTrail = (timestamp: number) => {
            if (isMoving.current && buttonRef.current && containerRef.current) {
                if (timestamp - lastTimestamp > 40) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const parentRect = containerRef.current.getBoundingClientRect();
                    const newHeart: Heart = {
                        id: Math.random(),
                        top: rect.top - parentRect.top + rect.height / 2,
                        left: rect.left - parentRect.left + rect.width / 2,
                    };
                    setHearts(prev => [...prev.slice(-15), newHeart]);
                    setTimeout(() => {
                        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
                    }, 600);
                    lastTimestamp = timestamp;
                }
            }
            requestAnimationFrame(trackTrail);
        };
        const animId = requestAnimationFrame(trackTrail);
        return () => cancelAnimationFrame(animId);
    }, []);

    const moveButton = () => {
        const randomTop = Math.floor(Math.random() * 80 + 10);
        const randomLeft = Math.floor(Math.random() * 80 + 10);
        setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
        isMoving.current = true;
        setTimeout(() => { isMoving.current = false; }, 300);
    };

    return (
        <div
            ref={containerRef}
            style={{
                aspectRatio: '1/1',
                width: '100%',
                position: 'relative',
                border: '2px solid #ccc',
                borderRadius: '15px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {!isAccepted ? (
                // Використовуємо Fragment <>, щоб не створювати зайвих обгорток,
                // які можуть перекривати контент
                <>
                    {hearts.map((heart) => (
                        <span key={heart.id} style={{
                            position: 'absolute', top: heart.top, left: heart.left,
                            transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                            fontSize: '14px', animation: 'heart-fade 0.6s forwards', zIndex: 1
                        }}>❤️</span>
                    ))}

                    <button
                        onClick={() => setIsAccepted(true)}
                        style={{
                            padding: '10px 20px',
                            marginRight: '80px',
                            zIndex: 2,
                            cursor: 'pointer'
                        }}
                    >
                        Yes
                    </button>

                    <button
                        ref={buttonRef}
                        onMouseEnter={moveButton}
                        onClick={moveButton}
                        onTouchStart={moveButton}
                        style={{
                            padding: '10px 20px',
                            position: 'absolute',
                            transition: 'all 0.25s ease-out',
                            top: position.top,
                            left: position.left,
                            zIndex: 2,
                        }}
                    >
                        No
                    </button>
                </>
            ) : (
                <>
                    {/* Фінальна сцена */}
                    <div style={{
                        position: 'absolute',
                        fontSize: '100px',
                        zIndex: 5,
                        animation: 'heart-grow 1.5s forwards ease-in-out',
                        pointerEvents: 'none'
                    }}>
                        ❤️
                    </div>

                    <div style={{
                        zIndex: 10,
                        textAlign: 'center',
                        animation: 'fadeIn 1s 0.3s forwards',
                        opacity: 0,
                        color: '#ff4d4d'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '24px' }}>You are the best!🌹</h2>
                        <img height={'100%'}
                            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGdzcHNkb2dlNG16dG1qOTlsaDQ3MzQ3M2w1enBvMHlkamNrZ3ZyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/R6gvnAxj2ISzJdbA63/giphy.gif"
                            alt="gif"/>
                    </div>
                </>
            )}

            <style>{`
                @keyframes heart-fade {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -20%) scale(0.5); }
                }
                @keyframes heart-grow {
                    0% { transform: scale(0); opacity: 0; }
                    30% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(20); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};