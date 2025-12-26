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

  // Calendar Mock Data
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i + 1;
    let event = null;
    if (day === 4 || day === 23) event = { type: 'green', label: 'Booked Call' };
    if (day === 8 || day === 20 || day === 29) event = { type: 'purple', label: 'Booked Call' };
    return { day: day <= 31 ? day : '', event };
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent-purple selection:text-black">
      <Head>
        <title>Company Scout</title>
      </Head>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
            <path d="M22 17.5V6.5C22 5.39543 21.1046 4.5 20 4.5H4C2.89543 4.5 2 5.39543 2 6.5V17.5C2 18.6046 2.89543 19.5 4 19.5H20C21.1046 19.5 22 18.6046 22 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 6.5L12 13.5L2 6.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span>company-scout</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
          <a href="#" className="hover:text-black transition-colors">Solutions <span className="text-[10px] ml-1">▼</span></a>
          <a href="#" className="hover:text-black transition-colors">About Us</a>
          <a href="#" className="hover:text-black transition-colors">Resources <span className="text-[10px] ml-1">▼</span></a>
        </div>

        <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded text-[15px] font-medium hover:bg-black transition-colors shadow-lg">
          Strategy Call
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 pt-12 lg:pt-20 grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">

        {/* Left Content */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-3 mb-10 group cursor-pointer">
            <span className="bg-[#FF6A3D] text-white w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-sm">Y</span>
            <span className="text-gray-500 text-xs font-mono font-medium tracking-wide uppercase border-b border-gray-300 group-hover:border-black transition-all">Backed by Y-Combinator</span>
          </div>

          <h1 className="text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight font-bold mb-8 text-[#0F0F0F]">
            We analyze companies<br />
            with your perfect<br />
            fit prospects
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed max-w-lg font-light">
            We run your entire analysis using our own custom-built tech that
            uncovers niche-specific data, delivers unique messaging
            at scale, and keeps your emails landing in inboxes.
          </p>

          <form onSubmit={handleSubmit} className="mb-12 max-w-lg relative">
            <div className="relative group">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g. apple.com)"
                className="w-full bg-white border border-gray-200 text-lg px-6 py-5 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all placeholder:text-gray-300"
              />
              <button
                type="submit"
                disabled={isMutating}
                className="w-full h-[72px] bg-accent-purple hover:bg-accent-purple-hover text-[#1A1A1A] text-lg font-medium rounded-b-lg flex items-center justify-between px-8 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  {isMutating && <span className="animate-spin text-xl">◌</span>}
                  <span>{isMutating ? 'Analyzing Agent Running...' : 'Analyze Domain'}</span>
                </div>
                <span className="text-2xl font-light">→</span>
              </button>
            </div>
            {/* Status Indicator */}
            {trackingId && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${companyData?.status === 'qualified' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                <span className="font-medium text-gray-600 uppercase tracking-wider text-xs">{companyData?.status || 'Processing...'}</span>
              </div>
            )}
          </form>

          {/* Result Card Preview */}
          {companyData && companyData.status === 'qualified' && (
            <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm border-l-4 border-l-green-400 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Lead Score</div>
              <div className="text-5xl font-bold text-gray-900 mb-4">{companyData.leadScore}<span className="text-lg text-gray-300 ml-1">/100</span></div>
              <p className="text-gray-600 leading-relaxed text-sm">{companyData.summary}</p>
            </div>
          )}
        </div>

        {/* Right Content - Calendar Grid */}
        <div className="relative pt-8 pl-8 hidden lg:block">
          <div className="bg-white border text-gray-800 rounded-sm shadow-sm overflow-hidden select-none">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'].map(day => (
                <div key={day} className="p-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-r border-gray-100 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7 bg-[#FDFCFB]">
              {calendarDays.map((date, idx) => (
                <div key={idx} className={`aspect-[0.8] border-r border-b border-gray-100 p-2 relative group hover:bg-white transition-colors ${idx % 7 === 6 ? 'border-r-0' : ''}`}>
                  <span className={`text-xs font-medium ${!date.day ? 'opacity-0' : 'text-gray-900'}`}>{date.day}</span>

                  {date.event && (
                    <div className={`absolute left-0 right-0 top-8 bottom-0 p-3 flex flex-col justify-end ${date.event.type === 'green' ? 'bg-[#B4F7C3]' : 'bg-[#D0C3FC]'
                      }`}>
                      <div className="font-bold text-[11px] leading-tight mb-1">{date.event.label}</div>
                      <div className="text-[8px] tracking-wider uppercase opacity-60 font-semibold">Sales Opportunity</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Trusted By */}
      <div className="max-w-[1400px] mx-auto px-6 mt-24 mb-20">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-8 uppercase">Trusted by Top Sales Teams</p>
        <div className="flex flex-wrap gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-8 w-24 bg-gray-800 rounded mask-logo"></div>
          <div className="h-6 w-20 bg-gray-800 rounded"></div>
          <div className="h-10 w-28 bg-gray-800 rounded"></div>
          <div className="h-7 w-24 bg-gray-800 rounded"></div>
          <div className="h-9 w-32 bg-gray-800 rounded"></div>
        </div>
      </div>

      {/* Testimonials Section (Dark) */}
      <section className="bg-[#111111] text-white py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-[#B4F7C3] mb-6">
            <span className="w-8 h-[1px] bg-[#B4F7C3]"></span>
            TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 max-w-2xl leading-tight">
            Trusted by teams selling into traditional industries.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-[#E5E5E5]">
            <TestimonialCard
              stat="5"
              statLabel="MEETINGS BOOKED PER WEEK"
              quote="The manufacturing industry is one of the toughest markets to crack. Throxy's personalized outboard put the right message in front of every educator."
              author="NIKLAS GERLACH, CCO"
              company="IMNOO"
            />
            <TestimonialCard
              stat="84%"
              statLabel="POSITIVE REPLY RATE"
              quote="Throxy's personalized outboard put the right message in front of every educator at the perfect moment. We gained precious time."
              author="FRANCISCO ORTIZ, BD"
              company="SANTILLANA"
            />
            <TestimonialCard
              stat="15"
              statLabel="HOURS BACK PER WEEK"
              quote="Throxy runs all the outreach so I can stay heads-down on coding. After just eight highly targeted calls we're about to sign our first deal."
              author="NOUR ISLAM, FOUNDER"
              company="PYCAD"
            />
          </div>
        </div>
      </section>

      {/* Target Fit Section (Darker) */}
      <section className="bg-[#181818] text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Know your targets fit<br />
              before we reach out
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
              We evaluate prospect fit by analyzing their website, social presence, value prop, language so every lead is relevant.
            </p>
            <button className="text-white border-b border-white pb-1 hover:opacity-70 transition-opacity">
              Book Call <span className="ml-2">→</span>
            </button>
          </div>

          {/* Abstract Chart Graphic */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 text-xs">
                <div className="h-8 bg-white/5 w-full rounded-sm flex items-center overflow-hidden">
                  <div className="h-full bg-white/10" style={{ width: `${Math.random() * 40 + 20}%` }}></div>
                  {i % 2 === 0 && <div className="h-full bg-[#D0C3FC] ml-auto w-1/3"></div>}
                  {i % 2 !== 0 && <div className="h-full bg-[#B4F7C3] ml-auto w-1/4"></div>}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <div className="h-10 bg-white w-1/3 rounded-sm"></div>
              <div className="h-10 bg-white/5 w-2/3 rounded-sm"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function TestimonialCard({ stat, statLabel, quote, author, company }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-[#D0C3FC]/30 transition-colors">
      <div className="flex items-end gap-2 mb-8 border-b border-white/10 pb-8">
        <span className="text-4xl font-light text-white">{stat}</span>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-2">{statLabel}</span>
      </div>
      <p className="text-sm leading-relaxed text-gray-300 mb-8 min-h-[120px]">
        {quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-sm"></div>
        <div className="text-[10px] font-bold tracking-wider">
          <div className="text-white">{author}</div>
          <div className="text-gray-500">{company}</div>
        </div>
      </div>
    </div>
  )
}
