import PageBanner from "@/components/ui/PageBanner";
import ContactSection from "@/components/home/ContactSection";
import { contact } from "@/data/content";

export const metadata = {
  title: "Contact Us",
  description: `Contact Prep Up Gwalior — ${contact.address}. Call ${contact.phones.join(" or ")}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" subtitle="Reach out for admissions, course details, or visit our Gwalior center." />
      <ContactSection showHeading={false} />
    </>
  );
}
