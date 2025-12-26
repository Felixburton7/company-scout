import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';

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
    // Poll if status is researching
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl" />

        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 text-center">
          Company Scout
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          AI-Powered Enrichment Agent
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
            <input
              type="text"
              placeholder="e.g. openai.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="relative w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-0 placeholder-gray-600 transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isMutating}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            {isMutating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Simulating Agent...
              </span>
            ) : 'Analyze Domain'}
          </button>
        </form>

        {/* Results Section */}
        {trackingId && (
          <div className={`mt-8 transition-all duration-500 ${companyData ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-200">Analysis Results</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-colors duration-300 ${companyData?.status === 'qualified'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                    : companyData?.status === 'rejected'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                  }`}>
                  {companyData?.status === 'researching' && <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />}
                  {companyData?.status || 'Waiting...'}
                </div>
              </div>

              {companyData?.status === 'qualified' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lead Score</div>
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                        {companyData.leadScore}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Confidence</div>
                      <div className="text-4xl font-bold text-white">High</div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {companyData.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
