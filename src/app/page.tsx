import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { Specialties } from "@/components/home/specialties";
import { FindUs } from "@/components/home/find-us";
import { Faq } from "@/components/home/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <Specialties />
      <FindUs />
      <Faq />
    </>
  );
}
