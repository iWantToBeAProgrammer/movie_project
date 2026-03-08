"use client";

import { useEffect, useState } from "react";
import { getWatchProviders } from "@/libs/api-libs";
import Image from "next/image";

const WatchProviders = ({ movieId }) => {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      const data = await getWatchProviders(movieId);
      setProviders(data);
      setLoading(false);
    };
    fetchProviders();
  }, [movieId]);

  if (loading) return <div className="h-20 w-full animate-pulse bg-white/5 rounded-xl"></div>;
  if (!providers || (!providers.flatrate && !providers.buy && !providers.rent)) return null;

  const allProviders = [
    ...(providers.flatrate || []),
    ...(providers.buy || []),
    ...(providers.rent || [])
  ];

  // Remove duplicates by provider_id
  const uniqueProviders = Array.from(new Map(allProviders.map(item => [item.provider_id, item])).values()).slice(0, 10);

  return (
    <div className="mt-6 flex flex-col gap-3 font-sans_caption animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Where to Watch</h3>
      <div className="flex flex-wrap gap-3">
        {uniqueProviders.map((provider) => (
          <div key={provider.provider_id} className="group relative">
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/10 transition-all group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.3)]">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {provider.provider_name}
            </div>
          </div>
        ))}
        {providers.link && (
          <a 
            href={providers.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-[10px] font-bold text-primary hover:underline ml-2"
          >
            See all options
          </a>
        )}
      </div>
    </div>
  );
};

export default WatchProviders;
