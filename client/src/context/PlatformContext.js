"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPublicPlatformData, getPublicSeo } from "@/lib/publicApi";

const PlatformContext = createContext({
  announcements: [],
  heroHighlights: [],
  seo: null,
  loading: true,
});

export function PlatformProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [heroHighlights, setHeroHighlights] = useState([]);
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getPublicPlatformData().catch(() => ({})),
      getPublicSeo().catch(() => null),
    ])
      .then(([platform, seoData]) => {
        if (!active) return;
        setAnnouncements(platform.announcements || []);
        setHeroHighlights(platform.heroHighlights || []);
        setSeo(seoData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PlatformContext.Provider
      value={{ announcements, heroHighlights, seo, loading }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  return useContext(PlatformContext);
}
