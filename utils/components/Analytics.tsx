'use client'

import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

import FathomAnalytics from '@/utils/components/FathomAnalytics'

export default function Analytics()
{
    return <>
        <VercelAnalytics />
        <FathomAnalytics siteId={process.env.NEXT_PUBLIC_FATHOM_ID!} />
    </>
}