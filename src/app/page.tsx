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
      
      // Check backend connection status
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

          {!backendConnected && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Backend Not Connected
              </h3>
              <p className="text-yellow-800 mb-4">
                {backendMessage || 'The backend database is not configured. Sites cannot be saved yet.'}
              </p>
              <div className="text-sm text-yellow-700 bg-yellow-100 rounded p-3 text-left">
                <p className="font-semibold mb-1">To enable site saving:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Set up an Upstash Redis database</li>
                  <li>Add environment variables in Vercel:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li><code className="bg-yellow-200 px-1 rounded">KV_REST_API_URL</code></li>
                      <li><code className="bg-yellow-200 px-1 rounded">KV_REST_API_TOKEN</code></li>
                    </ul>
                  </li>
                  <li>Redeploy your application</li>
                </ol>
              </div>
            </div>
          )}

          {error && backendConnected && (
            <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
              {error}
            </div>
          )}

          {!loading && !error && backendConnected && sites.length === 0 && (
            <div className="text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="mb-2">No sites saved yet.</p>
              <p className="text-sm">Click the extension icon on any website to save it here.</p>
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
