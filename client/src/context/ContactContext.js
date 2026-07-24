"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPublicContactInfo } from "@/lib/publicApi";

const EMPTY_CONTACT = {
  address: "",
  phones: [],
  email: "",
  googleMapsLink: "",
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
  },
};

const ContactContext = createContext(EMPTY_CONTACT);

export function ContactProvider({ children }) {
  const [contact, setContact] = useState(EMPTY_CONTACT);

  useEffect(() => {
    let active = true;

    getPublicContactInfo()
      .then((data) => {
        if (!active || !data) return;

        setContact({
          address: data.address || "",
          phones: Array.isArray(data.phones) ? data.phones.filter(Boolean) : [],
          email: data.email || "",
          googleMapsLink: data.googleMapsLink || "",
          social: {
            instagram: data.social?.instagram || "",
            facebook: data.social?.facebook || "",
            youtube: data.social?.youtube || "",
            twitter: data.social?.twitter || "",
          },
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
