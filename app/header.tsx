import Link from 'next/link'

export default function Header()
{
    return (
        <header className='p-4 border-b-2 border-gray-800'>

            <div className='max-w-screen-xl mx-auto text-center'>
                <Link
                    href='/'
                    className='flex items-center justify-center space-x-2 font-bold text-xl text-white hover:underline'
                >
                    <span className='text-amber-400'>When Lambo?</span> <span className='text-4xl'>🤷‍♂️</span>
                </Link>
            </div>

        </header>
    )
}