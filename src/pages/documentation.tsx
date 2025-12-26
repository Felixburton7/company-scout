import Head from 'next/head';
import Link from 'next/link';

// Logos
const LOGOS = {
    nextjs: (
        <svg viewBox="0 0 180 180" width="40" height="40" className="fill-black">
            <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
                <circle cx="90" cy="90" fill="#000" r="90"></circle>
            </mask>
            <g mask="url(#mask0_next)">
                <circle cx="90" cy="90" data-circle="true" fill="#000" r="90"></circle>
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white"></path>
                <rect fill="white" height="72" width="12" x="115" y="54"></rect>
            </g>
        </svg>
    ),
    trigger: (
        <svg viewBox="0 0 24 24" fill="none" width="40" height="40" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" className="text-orange-600 fill-orange-600" />
        </svg>
    ),
    groq: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="M9 9l3 3-3 3" />
            <path d="M15 15h-3" />
        </svg>
    ),
    singlestore: (
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-600">
            <path d="M21 7.5C21 9.433 16.9706 11 12 11C7.02944 11 3 9.433 3 7.5M21 7.5C21 5.567 16.9706 4 12 4C7.02944 4 3 5.567 3 7.5M21 7.5V16.5C21 18.433 16.9706 20 12 20C7.02944 20 3 18.433 3 16.5V7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12C3 13.933 7.02944 15.5 12 15.5C16.9706 15.5 21 13.933 21 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

const STEPS = [
    {
        id: 1,
        title: "Request Initialization",
        description: "You enter a company domain (e.g., 'stripe.com'). The Next.js frontend sends a signed request via tRPC to our backend.",
        tech: "Next.js + tRPC",
        logo: LOGOS.nextjs,
    },
    {
        id: 2,
        title: "Agent Orchestration",
        description: "Trigger.dev receives the event and spins up a resilient background worker. This ensures the long-running research task never times out.",
        tech: "Trigger.dev v3",
        logo: LOGOS.trigger,
    },
    {
        id: 3,
        title: "Deep Reconnaissance",
        description: "The agent actively crawls the homepage, 'About', and 'Team' sub-pages. It applies a strict anti-hallucination filter to ignore testimonials and investors, focusing only on operational staff.",
        tech: "DOM Scraping & Filtering",
        logo: (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        ),
    },
    {
        id: 4,
        title: "Cognitive Processing",
        description: "We feed the scraped context into Groq's LSH (Language Processing Unit) running Llama 3 70B. It extracts contacts and generates a sales summary.",
        tech: "Groq + Llama 3",
        logo: LOGOS.groq,
    },
    {
        id: 5,
        title: "Data Persistence",
        description: "Structured insights (contacts, emails, summaries) are stored in SingleStore for caching and historical analysis.",
        tech: "SingleStore DB",
        logo: LOGOS.singlestore,
    },
    {
        id: 6,
        title: "Strategic Output",
        description: "The frontend polls the database state and renders the final 'AI Scouting Report' when the agent completes its mission.",
        tech: "React Query",
        logo: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
                <line x1="9" y1="17" x2="12" y2="17"></line>
            </svg>
        ),
    }
];

export default function Documentation() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-purple-100 selection:text-purple-900 flex flex-col">
            <Head>
                <title>How it Works | Company Scout</title>
            </Head>

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

            <main className="flex-1 w-full max-w-[900px] mx-auto px-6 pt-16 pb-32">

                {/* Header */}
                <div className="mb-24 text-center md:text-left">
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-purple-100 mb-6 inline-block">
                        System Architecture
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[#1A1A1A]">
                        Inside the <span className="text-gray-400">Engine</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                        From raw domain to actionable intelligence. A breakdown of our autonomous agentic workflow.
                    </p>
                </div>

                {/* Vertical Timeline - Clean Layout */}
                <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-16">

                    {STEPS.map((step, index) => (
                        <div key={step.id} className="relative pl-12 md:pl-16 pr-4 group">
                            {/* Timeline Node */}
                            <div className="absolute -left-[11px] top-2 w-6 h-6 rounded-full bg-white border-4 border-gray-200 group-hover:border-black group-hover:scale-110 transition-all duration-300 z-10 shadow-sm"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-bold text-[#1A1A1A]">{step.title}</h3>
                                        <span className="hidden md:inline-block h-px w-10 bg-gray-100"></span>
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded">
                                            Step 0{step.id}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed text-lg mb-6 max-w-lg">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Visual Card */}
                                <div className="w-full md:w-64 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#1A1A1A]">
                                            {step.logo}
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Technology</div>
                                    <div className="font-medium text-[#1A1A1A]">{step.tech}</div>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>

                {/* Bottom CTA */}
                <div className="mt-32 p-12 bg-gray-50 rounded-3xl text-center border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Ready to see it in action?</h3>
                    <p className="text-gray-500 mb-8">Run your first reconnaissance mission now.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-bold rounded-xl hover:scale-105 transition-transform">
                        Launch Scout
                    </Link>
                </div>

            </main>
        </div>
    );
}
