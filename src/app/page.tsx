'use client';

import { useEffect, useState } from 'react';

interface Site {
  domain: string;
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(true);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      
      setBackendConnected(data.backendConnected !== false);
      
      if (data.message) {
        setBackendMessage(data.message);
      }
      
      if (response.ok) {
        setSites(data.sites.map((domain: string) => ({ domain })));
      } else {
        setError(data.error || 'Failed to fetch sites');
      }
    } catch (err) {
      setError('Failed to load sites');
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-32">
        {/* Header */}
        <div className="text-center mb-40">
          <h1 className="text-5xl font-serif text-black mb-10 leading-tight max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif', fontWeight: 400, fontSize: '3.5rem', lineHeight: '1.2' }}>
            Quick Listicle
          </h1>
          <p className="text-lg text-gray-700 font-normal leading-relaxed max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
            A collection of websites you want to remember
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 text-lg py-16">
            Loading...
          </div>
        )}

        {/* Backend Not Connected */}
        {!backendConnected && !loading && (
          <div className="text-center space-y-6 py-16 max-w-2xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              {backendMessage || 'Backend not configured. Add Redis environment variables to enable saving sites.'}
            </p>
            <p className="text-base text-gray-500">
              Set KV_REST_API_URL and KV_REST_API_TOKEN in Vercel
            </p>
          </div>
        )}

        {/* Error State */}
        {error && backendConnected && (
          <div className="text-center text-gray-700 text-lg py-16">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && backendConnected && sites.length === 0 && (
          <div className="text-center space-y-4 py-16">
            <p className="text-gray-700 text-lg">No sites saved yet</p>
            <p className="text-base text-gray-500">
              Use the Chrome extension to save websites
            </p>
          </div>
        )}

        {/* Sites List */}
        {!loading && !error && sites.length > 0 && (
          <div className="space-y-20">
            <div className="text-center">
              <p className="text-base text-gray-500">
                {sites.length} site{sites.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="space-y-1 max-w-2xl mx-auto">
              {sites.map((site, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-lg text-black font-normal">
                    {site.domain}
                  </span>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-base transition-colors duration-150"
                  >
                    visit →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-40 text-center">
          <p className="text-sm text-gray-500">
            made with 💙
          </p>
        </div>
      </div>
    </div>
  );
}
