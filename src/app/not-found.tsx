import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center bg-[#f4f5f6]">
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-24 pt-36 sm:px-8">
        <p className="text-[14.5px] font-medium tracking-[-0.01em]">
          <span className="text-ink">page</span>
          <span className="text-ink/35">not found.</span>
        </p>
        <h1 className="title-serif mt-6 text-[clamp(3.6rem,8vw,7.5rem)] text-ink">
          Nothing
          <br />
          <span className="italic">Here.</span>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] font-medium">
          <Link href="/" className="text-ink transition-colors hover:text-sky-600">
            Back to home
          </Link>
          <a href={`tel:${site.phones.emergency.tel}`} className="text-ink/60 transition-colors hover:text-ink">
            Call {site.phones.emergency.display}
          </a>
        </div>
      </div>
    </section>
  );
}
