"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getPublicSettings } from "@/lib/publicApi";

const EnrollPanelContext = createContext(null);

export function EnrollPanelProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCourse, setDefaultCourse] = useState("");
  const [enquiryLink, setEnquiryLink] = useState("");
  const [enquiryMode, setEnquiryMode] = useState("panel");

  useEffect(() => {
    let active = true;
    getPublicSettings()
      .then((settings) => {
        if (!active || !settings) return;
        setEnquiryLink(settings.enquiryLink || "");
        setEnquiryMode(settings.enquiryMode || "panel");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const openEnroll = useCallback(
    (course = "") => {
      if (enquiryMode === "link" && enquiryLink) {
        window.open(enquiryLink, "_blank", "noopener,noreferrer");
        return;
      }
      setDefaultCourse(course);
      setIsOpen(true);
    },
    [enquiryLink, enquiryMode]
  );

  const closeEnroll = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <EnrollPanelContext.Provider
      value={{
        isOpen,
        defaultCourse,
        openEnroll,
        openEnquiry: openEnroll,
        closeEnroll,
      }}
    >
      {children}
    </EnrollPanelContext.Provider>
  );
}

export function useEnrollPanel() {
  const ctx = useContext(EnrollPanelContext);
  if (!ctx) {
    throw new Error("useEnrollPanel must be used within EnrollPanelProvider");
  }
  return ctx;
}
