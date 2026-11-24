import { Hero } from "@/components/home/hero";
import { Specialties } from "@/components/home/specialties";
import { Philosophy } from "@/components/home/philosophy";
import { KidneySpotlight } from "@/components/home/kidney-spotlight";
import { Journey } from "@/components/home/journey";
import { LocationBand } from "@/components/home/location-band";
import { Questions } from "@/components/home/questions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Specialties />
      <Philosophy />
      <KidneySpotlight />
      <Journey />
      <LocationBand />
      <Questions />
    </>
  );
}
