import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-6 text-center">
            <Head>
                <title>Contact Us - Company Scout</title>
            </Head>

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
        </div>
    );
}
