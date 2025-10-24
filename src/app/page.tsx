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
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-normal text-black mb-6 tracking-tight">
            Quick Listicle
          </h1>
          <p className="text-xl text-gray-600 font-light">
            A collection of websites you want to remember
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 text-lg">
            Loading...
          </div>
        )}

        {/* Backend Not Connected */}
        {!backendConnected && !loading && (
          <div className="text-center space-y-4 mb-12">
            <p className="text-gray-600">
              {backendMessage || 'Backend not configured. Add Redis environment variables to enable saving sites.'}
            </p>
            <p className="text-sm text-gray-400">
              Set KV_REST_API_URL and KV_REST_API_TOKEN in Vercel
            </p>
          </div>
        )}

        {/* Error State */}
        {error && backendConnected && (
          <div className="text-center text-gray-600 mb-12">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && backendConnected && sites.length === 0 && (
          <div className="text-center space-y-2">
            <p className="text-gray-600">No sites saved yet</p>
            <p className="text-sm text-gray-400">
              Use the Chrome extension to save websites
            </p>
          </div>
        )}

        {/* Sites List */}
        {!loading && !error && sites.length > 0 && (
          <div className="space-y-12">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                {sites.length} site{sites.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="space-y-6">
              {sites.map((site, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-lg text-black">
                    {site.domain}
                  </span>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors duration-150"
                  >
                    visit →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400">
            Made with 💙
          </p>
        </div>
      </div>
    </div>
  );
}
