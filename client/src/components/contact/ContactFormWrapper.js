"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";

function ContactFormWithParams({ title }) {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "";

  return <ContactForm defaultCourse={course} title={title} />;
}

export default function ContactFormWrapper({
  title = "Send Us a Message",
  ...props
}) {
  return (
    <Suspense fallback={<ContactForm {...props} title={title} />}>
      <ContactFormWithParams title={title} />
    </Suspense>
  );
}
