import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Head>
                <title>Contact Us - Company Scout</title>
            </Head>

            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-[#1A1A1A]">company<span className="text-gray-400 font-light">.scout</span></span>
                </Link>
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/documentation" className="hover:text-black cursor-pointer transition-colors">Documentation</Link>
                    <Link href="/contact" className="hover:text-black cursor-pointer transition-colors">Contact us</Link>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h1 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Contact Us</h1>

                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-800">
                            <a href="mailto:felixburton2002@gmail.com" className="hover:text-blue-600 transition-colors">
                                felixburton2002@gmail.com
                            </a>
                        </p>

                        <p className="text-gray-500 italic">
                            This is just an example project!
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
                            ← Back to Scout
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
