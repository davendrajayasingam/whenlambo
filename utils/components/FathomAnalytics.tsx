// Guide: https://github.com/derrickreimer/fathom-client

'use client'

import { load, trackPageview } from 'fathom-client'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
    siteId: string
}

function TrackPageView({ siteId }: Props)
{
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() =>
    {
        load(siteId, {
            honorDNT: true,
            includedDomains: [
                process.env.NEXT_PUBLIC_DOMAIN_NAME!
            ],
            excludedDomains: [
                'localhost'
            ]
        })
    }, [])

    // Record a pageview when route changes
    useEffect(() =>
    {
        trackPageview()
    }, [pathname, searchParams])

    return null
}

export default function FathomAnalytics({ siteId }: Props)
{
    return <Suspense fallback={null}>
        <TrackPageView siteId={siteId} />
    </Suspense>
}