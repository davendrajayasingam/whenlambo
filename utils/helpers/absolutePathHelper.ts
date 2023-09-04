export const getAbsolutePath = (relativePath: string) =>
{
    const env = process.env.VERCEL_ENV
    if (env)
    {
        return `https://${process.env.VERCEL_URL}${relativePath}`
    }
    else
    {
        return `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${relativePath}`
    }
}