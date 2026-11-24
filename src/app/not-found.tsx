import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center bg-paper pt-32 pb-20">
      <div className="container-x">
        <p className="eyebrow text-blue">404 · Page Not Found</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5rem)] text-ink">
          We couldn&apos;t find that page.
        </h1>
        <p className="lede mt-5 max-w-xl">
          The page you looked for may have moved. You can return home, explore our specialties, or call our 24-hour desk on {site.phones.emergency.display}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">Back to home</ButtonLink>
          <Link href="/book" className="rounded-[3px] border border-ink/20 px-6 py-3.5 text-[13px] font-medium text-ink hover:border-ink">
            Book an appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
