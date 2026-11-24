export const site = {
  name: "Hilton Clinics",
  shortName: "Hilton",
  tagline: "Specialist care, close to home.",
  description:
    "Hilton Clinics is a 24-hour, specialist-led hospital off Ada-George Road, Port Harcourt — offering dialysis and kidney care, cardiology, obstetrics & gynaecology, paediatrics, orthopaedics and more.",
  url: "http://localhost:3000",
  address: {
    line1: "2 Ejekwu Wike Street",
    line2: "Mile 4, off Ada-George Road",
    area: "Rumuepirikom",
    city: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
    landmark: "By Wimpey Road, Ada-George",
  },
  geo: { lat: 4.83017, lng: 6.9753 },
  phones: {
    emergency: { display: "0708 902 9932", tel: "+2347089029932" },
    mobile: { display: "0803 313 0014", tel: "+2348033130014" },
    landline: { display: "084 235 750", tel: "+23484235750" },
  },
  whatsapp: {
    number: "2347089029932",
    display: "0708 902 9932",
    greeting:
      "Hello Hilton Clinics, I would like to make an enquiry.",
  },
  email: "", // add the clinic's official email here when available
  hours: {
    summary: "Open 24 hours, every day",
    emergency: "24 / 7 — including public holidays",
    consultations: [
      { days: "Monday – Friday", time: "8:00 am – 6:00 pm" },
      { days: "Saturday", time: "9:00 am – 3:00 pm" },
      { days: "Sunday", time: "Emergencies & admitted patients" },
    ],
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Specialties" },
  { href: "/patients", label: "Patient Guide" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.greeting);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}

export const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;
export const mapsEmbed = `https://maps.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`;
export const mapsPlace = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Hilton Clinics, Ejekwu Wike Street, Ada-George, Port Harcourt"
)}`;
