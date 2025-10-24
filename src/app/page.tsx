'use client';

import { useEffect, useState } from 'react';

interface Site {
  domain: string;
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      
      if (response.ok) {
        setSites(data.sites.map((domain: string) => ({ domain })));
      }
    } catch (err) {
      console.error('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  const formatCompanyName = (domain: string) => {
    // Remove TLD and format as title case
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          List of Interesting Things
        </h1>
        
        <p className="text-lg text-gray-700 mb-12">
          Here is my priority list of companies that feel extremely high potential
        </p>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-8">
            {sites.map((site, index) => (
              <div key={index} className="flex gap-3">
                <div className="text-gray-400 text-xl flex-shrink-0">›</div>
                <div>
                  <div className="font-semibold text-lg mb-1">
                    {formatCompanyName(site.domain)}
                  </div>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {site.domain}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
