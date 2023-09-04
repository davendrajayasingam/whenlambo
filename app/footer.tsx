import { FaExternalLinkAlt } from 'react-icons/fa'

export default function Footer()
{
    return <footer className='p-4 border-t border-white/10'>
        <p className='font-light text-white text-sm text-center'>
            Made with ❤️ by Davendra Jayasingam. Source code available on <a href='https://github.com/davendrajayasingam/whenlambo' className='underline inline-flex items-center' target='_blank'>GitHub <FaExternalLinkAlt /></a>.
        </p>
    </footer>
}