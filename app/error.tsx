// Guide: https://beta.nextjs.org/docs/api-reference/file-conventions/error

'use client' // Error components must be Client components

type Props = {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: Props)
{
    return (
        <div className='p-6 mt-16 space-y-8 w-full h-full max-w-[30rem] min-h-screen mx-auto'>

            <div>
                <h1 className='text-6xl text-center'>
                    😕
                </h1>
                <h1 className='font-bold text-center text-amber-400 text-4xl'>
                    Whoops!
                </h1>
                <h2 className='mt-2 font-medium text-lg text-center text-teal-100'>
                    {error.message}
                </h2>
            </div>

            <div className='text-center'>
                <button
                    onClick={() => reset()}
                    className='bg-emerald-400 rounded-xl p-4 font-bold text-xl text-white text-center hover:brightness-110 transition-all duration-300 ease-in-out'
                >
                    Try Again
                </button>
            </div>

        </div>
    )
}