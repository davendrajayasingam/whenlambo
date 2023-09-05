import { useEffect, useState } from 'react'

type Props = {
    targetTimeInMs: number
}

// Just a quick countdown timer hook to display seconds remaining until the next price refresh
export default function useCountdown({ targetTimeInMs }: Props)
{
    const [secondsRemaining, setSecondsRemaining] = useState(0)

    useEffect(() =>
    {
        const getSecondsRemaining = () => Math.abs(Math.floor(((targetTimeInMs - Date.now()) % (1000 * 60)) / 1000))
        setSecondsRemaining(getSecondsRemaining())

        const interval = setInterval(() => setSecondsRemaining(getSecondsRemaining()), 1000)
        return () => clearInterval(interval)
    }, [targetTimeInMs])

    return secondsRemaining
}