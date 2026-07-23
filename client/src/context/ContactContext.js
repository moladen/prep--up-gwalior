"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { contact as fallbackContact } from "@/data/content";
import { getPublicContactInfo } from "@/lib/publicApi";

const ContactContext = createContext(fallbackContact);

export function ContactProvider({ children }) {
  const [contact, setContact] = useState(fallbackContact);

  useEffect(() => {
    let active = true;

    getPublicContactInfo()
      .then((data) => {
        if (!active || !data) return;

        setContact({
          address: data.address || fallbackContact.address,
          phones: data.phones?.length ? data.phones : fallbackContact.phones,
          email: data.email || fallbackContact.email,
          googleMapsLink: data.googleMapsLink || "",
          social: {
            instagram:
              data.social?.instagram || fallbackContact.social?.instagram || "",
            facebook:
              data.social?.facebook || fallbackContact.social?.facebook || "",
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
