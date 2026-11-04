import type { Metadata } from "next";
import Link from "next/link";
import { ThankYouConversion } from "@/components/sites/showlanka/thank-you-conversion";

export const metadata: Metadata = {
  title:
    "Thanks for Reaching Out to Show Lanka Tours — Your Sri Lanka Holiday Enquiry Has Been Received, and Our Local Travel Team Will Be in Touch to Help Plan Your Trip | Show Lanka Tours",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <ThankYouConversion />
      <section className="flex subpage-content">
        <div className="container">
          <h1 className="sub-page-title border-after">Thank you!</h1>
          <p>Your enquiry has been received. Our team will be in touch with you shortly.</p>
          <Link className="common-btn" href="/">
            Return to home
          </Link>
        </div>
      </section>
    </>
  );
}
