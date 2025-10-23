'use client';

import { useEffect, useState } from 'react';

interface Site {
  domain: string;
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      if (response.ok) {
        setSites(data.sites.map((domain: string) => ({ domain })));
      } else {
        setError(data.error || 'Failed to fetch sites');
      }
    } catch (err) {
      setError('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Quick Listicle
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            A collection of websites you want to remember.
          </p>
        </div>

        <div className="space-y-6">
          {loading && (
            <div className="text-center text-gray-500">
              Loading sites...
            </div>
          )}

          {error && (
            <div className="text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && sites.length === 0 && (
            <div className="text-center text-gray-500">
              No sites saved yet. Click the extension icon on any website to save it here.
            </div>
          )}

          {!loading && !error && sites.length > 0 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-sm text-gray-500">
                  {sites.length} site{sites.length !== 1 ? 's' : ''} saved
                </p>
              </div>

              <div className="space-y-3">
                {sites.map((site, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-900 font-medium">
                        {site.domain}
                      </span>
                    </div>
                    <a
                      href={`https://${site.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
