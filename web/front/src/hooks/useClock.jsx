import { useState, useEffect }  from    "react";

export default function useClock() {
    const formatTime = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const [time, setTime] = useState(() => formatTime());
    useEffect(() => {
        const interval = setInterval(() => {
        setTime(formatTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return time;
}