import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import Head from 'next/head';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [trackingId, setTrackingId] = useState<number | null>(null);

  const analyzeMutation = trpc.company.analyze.useMutation({
    onSuccess: (data) => {
      setTrackingId(data.id);
    },
    onError: (err) => {
      alert("Error starting analysis: " + err.message);
    }
  });

  const { data: companyData, refetch } = trpc.company.getResults.useQuery(
    { id: trackingId! },
    {
      enabled: !!trackingId,
    }
  );

  useEffect(() => {
    if (!trackingId) return;
    if (!companyData || companyData.status === 'researching') {
      const timer = setTimeout(() => refetch(), 1000);
      return () => clearTimeout(timer);
    }
  }, [trackingId, companyData, refetch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    analyzeMutation.mutate({ domain });
  };

  // @ts-ignore
  const isMutating = analyzeMutation.isLoading || analyzeMutation.isPending;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple selection:text-black flex flex-col">
      <Head>
        <title>Company Scout</title>
      </Head>

      {/* Simplified Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span className="text-[#1A1A1A]">company-scout</span>
        </div>
      </nav>

      {/* Main Analysis Section */}
      <main className="flex-1 max-w-[1400px] mx-auto px-6 pt-8 lg:pt-16 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start w-full">

        {/* Left Column: Input and Value Prop */}
        <div className="pt-4 flex flex-col justify-center h-full">
          <div className="inline-block mb-8">
            <span className="bg-[#B4F7C3] text-[#1A1A1A] px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm border border-[#9FE0AE]">
              AI-Powered Enrichment
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl leading-[0.95] tracking-tight font-bold mb-8 text-[#0F0F0F]">
            Instant company<br />
            intelligence.
          </h1>

          <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-md font-light">
            Enter a domain to deploy our autonomous agent. It scans, analyzes, and synthesizes key data points in seconds.
          </p>

          <form onSubmit={handleSubmit} className="mb-12 max-w-lg relative w-full">
            <div className="relative group shadow-sm">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. stripe.com"
                className="w-full bg-white border border-gray-200 text-lg px-6 py-5 rounded-t-lg focus:outline-none focus:ring-0 border-b-0 placeholder:text-gray-300 font-medium"
              />
              <button
                type="submit"
                disabled={isMutating}
                className="w-full h-[72px] bg-[#1A1A1A] hover:bg-black text-white text-lg font-medium rounded-b-lg flex items-center justify-between px-8 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {isMutating && <span className="animate-spin text-xl">◌</span>}
                  <span>{isMutating ? 'Scouting...' : 'Generate Report'}</span>
                </div>
                <span className="text-2xl font-light opacity-50">→</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Data Grid / Results */}
        <div className="relative lg:pt-8 w-full">
          {/* Static "Placeholder" Grid if no data, Real data if results exist */}
          <div className={`grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden ${isMutating ? 'opacity-50 blur-sm scale-[0.99] transition-all duration-500' : 'opacity-100 scale-100 transition-all duration-500'}`}>

            {/* Card 1: Lead Score */}
            <div className="bg-white p-8 aspect-[1.1] flex flex-col justify-between group hover:bg-[#FDFCFB] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Lead Potential</span>

                {/* Status Dot */}
                <div className={`w-2 h-2 rounded-full ${companyData?.status === 'qualified' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>

              <div>
                <div className="text-5xl font-bold text-[#1A1A1A] mb-2 tracking-tighter">
                  {companyData ? (companyData.leadScore ?? '--') : '00'}
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-purple" style={{ width: companyData ? `${companyData.leadScore}%` : '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Card 2: Status / Signal */}
            <div className="bg-white p-8 aspect-[1.1] flex flex-col justify-between group hover:bg-[#FDFCFB] transition-colors">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Analysis Status</span>
              <div className="flex flex-col gap-2">
                <div className={`inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-bold border ${companyData?.status === 'qualified' ? 'bg-[#B4F7C3]/20 border-[#B4F7C3] text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {companyData?.status ? companyData.status.toUpperCase() : 'WAITING FOR INPUT'}
                </div>
                {companyData?.status === 'researching' && <span className="text-xs text-blue-500 animate-pulse">Processing live data...</span>}
              </div>
            </div>

            {/* Card 3: Summary (Spans 2 cols) */}
            <div className="col-span-2 bg-white p-8 min-h-[200px] flex flex-col gap-4 group hover:bg-[#FDFCFB] transition-colors">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Executive Summary</span>
              <p className="text-[#1A1A1A] text-lg leading-relaxed font-light">
                {companyData?.summary ? companyData.summary : "No analysis data available. Enter a domain to begin the enrichment process."}
              </p>
              {companyData && (
                <div className="mt-auto flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold rounded">AI Generated</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold rounded">{new Date().toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-xs tracking-wider uppercase">
        © 2024 Company Scout Intelligence
      </footer>
    </div>
  );
}
