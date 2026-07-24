import PageBanner from "@/components/ui/PageBanner";
import ContactSection from "@/components/home/ContactSection";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Prep Up Gwalior for admissions, course details, or to visit our center.",
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" subtitle="Reach out for admissions, course details, or visit our Gwalior center." />
      <ContactSection showHeading={false} />
    </>
  );
}
