import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trpc } from '../utils/trpc';
import Head from 'next/head';

interface Contact {
  name: string;
  role: string;
  email: string;
  linkedin?: string;
  type: string;
}

interface CompanyData {
  id: number;
  domain: string;
  status: string;
  leadScore: number;
  summary: string;
  contacts: Contact[];
  emailDraft: string;
  createdAt: Date;
}

const LOADING_STEPS = [
  "Building the Universe (SingleStore)...",
  "Crawling Sub-Pages (About, Team)...",
  "Filtering Testimonials vs Staff...",
  "Mapping Organization Hierarchy...",
  "Identifying Champions & Blockers...",
  "Analyzing Hiring & Funding Signals...",
  "Drafting Contextual Spintax Messaging...",
  "Finalizing Lead Score..."
];

const REASSURANCE_MESSAGES = [
  "Just taking a second in the stream...",
  "Optimizing neural pathways...",
  "Cross-referencing signals...",
  "Polishing the output..."
];

export default function Home() {
  const [domain, setDomain] = useState('');
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [reassuranceIndex, setReassuranceIndex] = useState(0);
  const [showRawData, setShowRawData] = useState(false);

  const analyzeMutation = trpc.company.analyze.useMutation({
    onSuccess: (data) => {
      setTrackingId(data.id);
      setLoadingStepIndex(0);
      setReassuranceIndex(0);
    },
    onError: (err) => {
      alert("Error starting analysis: " + err.message);
    }
  });

  const { data: companyData, isLoading: isQueryLoading, refetch } = trpc.company.getResults.useQuery(
    { id: trackingId! },
    {
      enabled: !!trackingId,
    }
  );

  const isResearching = analyzeMutation.isPending || (!!trackingId && (!companyData || companyData.status === 'researching'));

  useEffect(() => {
    if (!!trackingId && (!companyData || companyData.status === 'researching')) {
      const timer = setTimeout(() => refetch(), 1000);
      return () => clearTimeout(timer);
    }
  }, [trackingId, companyData, refetch]);

  useEffect(() => {
    if (!isResearching) return;

    // Cycle through steps every 1.5 seconds for visual effect
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        // Stop at the penultimate step (prevent reaching 100% prematurely)
        if (prev >= LOADING_STEPS.length - 2) {
          setReassuranceIndex((r) => r + 1);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isResearching]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    analyzeMutation.mutate({ domain });
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple selection:text-black flex flex-col items-center relative overflow-hidden">
      <Head>
        <title>Company Scout</title>
      </Head>

      {/* Background Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Raw Data Slide-Over */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${showRawData ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold">Raw Intelligence Data</h2>
            <p className="text-xs text-gray-500 font-mono">ID: {trackingId || 'NULL'}</p>
          </div>
          <button onClick={() => setShowRawData(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117] text-gray-300 font-mono text-sm leading-relaxed">
          <pre>{JSON.stringify(companyData || {}, null, 2)}</pre>
        </div>
      </div>

      {/* Overlay for Slide-Over */}
      {showRawData && <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setShowRawData(false)}></div>}


      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[#1A1A1A]">company<span className="text-gray-400 font-light">.scout</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          <Link href="/documentation" className="hover:text-black cursor-pointer transition-colors">Documentation</Link>
          <Link href="/contact" className="hover:text-black cursor-pointer transition-colors">Contact us</Link>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 pt-16 lg:pt-24 flex flex-col items-center">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full max-w-2xl mb-12">
          <div className="inline-block mb-6 animate-fade-in-up">
            <span className="bg-[#B4F7C3] text-[#0a3814] px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#9FE0AE] shadow-sm">
              AI-Native Sales Infrastructure
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl leading-[0.95] tracking-tight font-bold mb-8 text-[#0F0F0F]">
            Data to revenue,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">autonomous.</span>
          </h1>

          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg font-light">
            Enter a domain to unleash our agent swarm. Identify high-leverage accounts, map organization hierarchies, and score buying intent.
          </p>

          <form onSubmit={handleSubmit} className="w-full relative max-w-lg">
            <div className={`relative group shadow-2xl transition-all duration-300 ${isResearching ? 'scale-[0.98] opacity-80 pointer-events-none' : 'hover:scale-[1.01]'}`}>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="company.com"
                className="w-full bg-white border-2 border-transparent focus:border-black/5 text-lg px-8 py-6 rounded-t-xl focus:outline-none focus:ring-0 placeholder:text-gray-300 font-medium text-center tracking-wide"
              />
              <button
                type="submit"
                disabled={isResearching}
                className="w-full h-[72px] bg-[#1A1A1A] hover:bg-black text-white text-lg font-medium rounded-b-xl flex items-center justify-between px-8 transition-all"
              >
                <span className="font-bold tracking-wider text-sm uppercase">
                  {isResearching ? 'Agent Active' : 'Start Reconnaissance'}
                </span>
                <span className="text-xl font-light">
                  {isResearching ? (
                    <span className="flex gap-1">
                      <span className="animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </span>
                  ) : '↵'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic Status / Results Area */}
        <div className="w-full min-h-[400px] mb-20 relative">

          {/* Loading State Overlay */}
          {isResearching && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center shadow-inner">
              <div className="w-full max-w-md space-y-8">
                {/* Tech Loader Animation */}
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-black rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">
                    {Math.round(((loadingStepIndex + 1) / LOADING_STEPS.length) * 100)}%
                  </div>
                </div>

                <div className="space-y-2 relative h-16">
                  {/* Normal Status */}
                  <h3 className="text-xl font-bold text-gray-900 animate-pulse transition-all duration-300">
                    {reassuranceIndex > 0 ? REASSURANCE_MESSAGES[(reassuranceIndex - 1) % REASSURANCE_MESSAGES.length] : LOADING_STEPS[loadingStepIndex]}
                  </h3>

                  <p className="text-sm text-gray-400 font-mono mt-1">
                    Thread ID: {trackingId ? `THX-${trackingId}` : 'INIT...'}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center gap-1 mt-8">
                  {LOADING_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx <= loadingStepIndex ? 'w-8 bg-black' : 'w-2 bg-gray-200'}`}
                    />
                  ))}
                </div>

                <div className="pt-4 text-xs text-gray-400 uppercase tracking-widest">
                  System Activity Log
                </div>
                <div className="bg-black/5 rounded p-4 font-mono text-xs text-left text-gray-600 h-24 overflow-hidden border border-black/5 flex flex-col-reverse">
                  {LOADING_STEPS.slice(0, loadingStepIndex + 1).reverse().map((step, i) => (
                    <div key={i} className="mb-1">
                      <span className="text-green-600 mr-2">✓</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className={`transition-all duration-700 ${isResearching ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {companyData?.status === 'qualified' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Result Card 1: Lead Score */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Proprietary Lead Score</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">High Intent</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-8xl font-black text-[#1A1A1A] tracking-tighter">
                        {companyData.leadScore}
                      </div>
                      <div className="text-gray-400 text-2xl font-medium">/100</div>
                    </div>
                    <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-900 to-gray-600 transition-all duration-1000 ease-out"
                        style={{ width: `${companyData.leadScore as number}%` }}
                      ></div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      Calculated based on 47 signals including hiring velocity and tech stack fit.
                    </p>
                  </div>

                  {/* Result Card 2: Company Summary */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">AI Scouting Report</span>
                    <div className="grow flex flex-col justify-center">
                      <p className="text-[#1A1A1A] text-xl leading-relaxed font-light">
                        {companyData.summary}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-xs">
                      <span className="text-gray-400">Source: Public & Private Graphs</span>
                      <button onClick={() => setShowRawData(true)} className="text-black font-bold hover:underline">View Raw Data →</button>
                    </div>
                  </div>

                  {/* Result Card 3: Org Chart (Contacts) - Span 2 Cols */}
                  <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Interactive Org Chart</span>
                      <span className="text-xs text-gray-400">Mapped via Public Graphs</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-widest">
                            <th className="pb-3 pl-2 font-medium">Name</th>
                            <th className="pb-3 font-medium">Role</th>
                            <th className="pb-3 font-medium">Context / Persona</th>
                            <th className="pb-3 font-medium">Contact</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {companyData.contacts && companyData.contacts.length > 0 ? (companyData.contacts.map((contact, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                              <td className="py-4 pl-2 font-bold text-[#1A1A1A]">
                                {contact.name}
                                {contact.linkedin && (
                                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-700 text-[10px] uppercase font-bold tracking-wider inline-flex items-center">
                                    IN ↗
                                  </a>
                                )}
                              </td>
                              <td className="py-4 text-gray-600">{contact.role}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${contact.type === 'Decision Maker' ? 'bg-purple-100 text-purple-700' :
                                  contact.type === 'Champion' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                  {contact.type}
                                </span>
                              </td>
                              <td className="py-4 text-accent-purple-hover font-mono text-xs cursor-pointer hover:underline group-hover:text-purple-600">
                                {contact.email}
                              </td>
                            </tr>
                          ))) : (
                            <tr>
                              <td colSpan={4} className="py-4 text-center text-gray-400 italic">No contacts mapped for this entity.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Result Card 4: Active Campaign Sequence */}
                  {/* @ts-ignore */}
                  {companyData.contacts && (companyData.contacts as any[]).length > 0 && (
                    <div className="md:col-span-2 bg-[#F9FAFB] rounded-2xl p-8 border border-gray-200 border-dashed relative group">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6 block">Active Campaign Preview</span>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left: Targeting & Permutations */}
                        <div className="col-span-1 border-r border-gray-200 pr-0 md:pr-8">
                          <h4 className="font-bold text-sm mb-2">Targeting</h4>
                          {/* @ts-ignore */}
                          <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                              {/* @ts-ignore */}
                              {(companyData.contacts as any)[0].name.charAt(0)}
                            </div>
                            <div>
                              {/* @ts-ignore */}
                              <div className="font-bold text-sm">{(companyData.contacts as any)[0].name}</div>
                              {/* @ts-ignore */}
                              <div className="text-xs text-gray-500">{(companyData.contacts as any)[0].role}</div>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm mb-2">Email Permutations</h4>
                          <div className="space-y-2 font-mono text-xs text-gray-500">
                            {/* @ts-ignore */}
                            {(() => {
                              /* @ts-ignore */
                              const c = companyData.contacts[0];
                              const names = c.name.toLowerCase().split(' ');
                              const f = names[0];
                              const l = names[names.length - 1];
                              // Basic permutations
                              const domainHost = domain.replace('https://', '').replace('www.', '').split('/')[0];
                              const perms = [
                                `${f}@${domainHost}`,
                                `${f}.${l}@${domainHost}`,
                                `${f}${l}@${domainHost}`,
                                `${l}${f}@${domainHost}`
                              ];
                              return perms.map((p, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                  <span className={i === 0 ? 'text-black font-bold' : ''}>{p}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Right: The Email Content */}
                        <div className="col-span-1 md:col-span-2">
                          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                              <span className="text-xs font-bold text-gray-400 uppercase">Subject: Partnership / {companyData.summary?.split(' ').slice(0, 3).join(' ')}...</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">DRAFT_V1</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                              Hi {/* @ts-ignore */}{(companyData.contacts as any)[0].name.split(' ')[0]},
                              <br /><br />
                              {/* @ts-ignore */}
                              {companyData.emailDraft as string}
                              <br /><br />
                              Best,<br />
                              Felix
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                              <span>Send Campaign</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="md:col-span-2 mt-4 bg-[#1A1A1A] text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                    <div className="mb-4 md:mb-0">
                      <h4 className="font-bold text-lg">Ready to engage?</h4>
                      <p className="text-gray-400 text-sm">Our agents can start outbound to decision makers now.</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        Launch Campaign
                      </button>
                      <button className="px-6 py-3 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                        Export to CRM
                      </button>
                    </div>
                  </div>

                </div >
              </>
            ) : (
              /* Empty State / Placeholder to keep layout stable */
              <div className="h-full flex items-center justify-center p-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <div className="max-w-xs space-y-4 opacity-40">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <p className="font-bold text-gray-900">Awaiting target</p>
                  <p className="text-sm">Enter a domain above to initialize the scout.</p>
                </div>
              </div>
            )}
          </div >
        </div >
      </main >

      <footer className="py-8 text-center text-gray-300 text-xs tracking-wider uppercase">
        © 2025 Company Scout. System Status: <span className="text-green-500">● Operational</span>
      </footer>
    </div >
  );
}

