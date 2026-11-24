import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { Specialties } from "@/components/home/specialties";
import { Journey } from "@/components/home/journey";
import { LocationBand } from "@/components/home/location-band";
import { Questions } from "@/components/home/questions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <Specialties />
      <Journey />
      <LocationBand />
      <Questions />
    </>
  );
}
