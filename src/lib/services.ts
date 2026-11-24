export type Service = {
  slug: string;
  name: string;
  short: string;
  category: "Specialist" | "Diagnostics" | "Emergency" | "Family";
  image: string;
  summary: string;
  intro: string;
  offers: string[];
  conditions: string[];
  prepare: string[];
  duration: number; // minutes per consultation slot
};

export const services: Service[] = [
  {
    slug: "nephrology-dialysis",
    name: "Nephrology & Dialysis",
    short: "Kidney care",
    category: "Specialist",
    image: "/images/dialysis.jpg",
    summary:
      "Consultant-led kidney care and a calm, modern haemodialysis unit for both acute and long-term patients.",
    intro:
      "Kidney care is where Hilton Clinics began, and it remains at the heart of what we do. Our nephrology team diagnoses and manages kidney disease at every stage — from early chronic kidney disease to end-stage renal failure — and our haemodialysis unit runs scheduled and emergency sessions in a quiet, well-monitored setting.",
    offers: [
      "Haemodialysis — scheduled and emergency sessions",
      "Chronic kidney disease (CKD) assessment and staging",
      "Acute kidney injury management",
      "Hypertension and kidney-related blood pressure clinics",
      "Vascular access planning and catheter care",
      "Dietary and fluid counselling for kidney patients",
    ],
    conditions: [
      "Chronic kidney disease",
      "Acute kidney injury",
      "Kidney failure",
      "Diabetic kidney disease",
      "Glomerulonephritis",
      "Electrolyte imbalance",
    ],
    prepare: [
      "Bring your most recent creatinine / urea results and any scans",
      "List every medication you take, including herbal remedies",
      "For dialysis, eat lightly and wear clothing with easy arm access",
    ],
    duration: 30,
  },
  {
    slug: "kidney-transplant",
    name: "Kidney Transplant Care",
    short: "Transplant",
    category: "Specialist",
    image: "/images/ward.jpg",
    summary:
      "Work-up, donor evaluation and lifelong follow-up for patients preparing for — or living with — a kidney transplant.",
    intro:
      "A transplant is a long journey, and families should not have to navigate it alone. We guide recipients and donors through evaluation, coordinate with transplant centres, and provide careful post-transplant follow-up, including immunosuppression monitoring close to home.",
    offers: [
      "Pre-transplant recipient evaluation",
      "Living donor assessment and counselling",
      "Coordination with partner transplant centres",
      "Post-transplant follow-up clinics",
      "Immunosuppressant drug-level monitoring",
      "Rejection and infection screening",
    ],
    conditions: [
      "End-stage kidney disease",
      "Post-transplant monitoring",
      "Graft dysfunction",
    ],
    prepare: [
      "Bring your full medical history and dialysis records",
      "Donors should bring a valid ID and blood group result if known",
      "Come with a family member — decisions are easier together",
    ],
    duration: 45,
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    short: "Heart health",
    category: "Specialist",
    image: "/images/cardiology.jpg",
    summary:
      "Assessment and long-term management of heart and blood-pressure conditions, with ECG and cardiac screening on site.",
    intro:
      "High blood pressure is one of the most common — and most silent — health risks in our community. Our cardiology service focuses on early detection, clear explanations and practical, sustainable treatment plans that fit real life.",
    offers: [
      "Resting ECG and cardiac risk assessment",
      "Hypertension clinic and medication review",
      "Heart failure management",
      "Pre-operative cardiac clearance",
      "Cholesterol and lifestyle counselling",
    ],
    conditions: [
      "Hypertension",
      "Heart failure",
      "Palpitations and arrhythmia",
      "Chest pain evaluation",
      "High cholesterol",
    ],
    prepare: [
      "Bring home blood-pressure readings if you have them",
      "Avoid caffeine for a few hours before an ECG",
      "Bring all current medication packs",
    ],
    duration: 30,
  },
  {
    slug: "obstetrics-gynaecology",
    name: "Obstetrics & Gynaecology",
    short: "Women's health",
    category: "Specialist",
    image: "/images/maternity.jpg",
    summary:
      "Antenatal care, safe delivery and women's health — with continuity from the first scan to the first weeks at home.",
    intro:
      "From planning a pregnancy to postnatal recovery, our obstetrics and gynaecology team offers steady, respectful care. Mothers are seen by the same team throughout, so questions are answered by people who already know your story.",
    offers: [
      "Antenatal clinics and pregnancy scans",
      "Labour, delivery and caesarean section",
      "Postnatal checks for mother and baby",
      "Family planning and fertility counselling",
      "Gynaecological assessment and minor procedures",
      "Cervical screening",
    ],
    conditions: [
      "Pregnancy care",
      "Fibroids",
      "Menstrual disorders",
      "Infertility",
      "Pelvic pain",
    ],
    prepare: [
      "Bring your antenatal card or previous scan reports",
      "Note the first day of your last menstrual period",
      "A partner or family member is always welcome",
    ],
    duration: 30,
  },
  {
    slug: "paediatrics",
    name: "Paediatrics & Child Welfare",
    short: "Children",
    category: "Family",
    image: "/images/paediatrics.jpg",
    summary:
      "Gentle, unhurried care for babies, children and teenagers — including immunisations and growth checks.",
    intro:
      "Children are not small adults, and a hospital visit should never feel frightening. Our paediatric team takes time to put little ones at ease while giving parents clear, honest guidance.",
    offers: [
      "Well-baby and child welfare clinics",
      "Routine immunisations",
      "Growth and developmental checks",
      "Management of childhood fevers, malaria and infections",
      "Nutrition advice for growing children",
    ],
    conditions: [
      "Fever and malaria",
      "Respiratory infections",
      "Diarrhoea and dehydration",
      "Asthma",
      "Growth concerns",
    ],
    prepare: [
      "Bring your child's immunisation card",
      "A favourite toy or snack helps with waiting",
      "Note when symptoms started and any medicines given",
    ],
    duration: 30,
  },
  {
    slug: "orthopaedics",
    name: "Orthopaedics",
    short: "Bones & joints",
    category: "Specialist",
    image: "/images/orthopaedics.jpg",
    summary:
      "Diagnosis and treatment of bone, joint and muscle problems — from sports injuries to arthritis.",
    intro:
      "Pain that limits movement limits life. Our orthopaedic service assesses injuries and long-standing joint problems, and builds a plan that may combine medication, physiotherapy and, where needed, surgical referral.",
    offers: [
      "Fracture assessment and casting",
      "Joint pain and arthritis clinics",
      "Sports and work injury care",
      "Back and neck pain evaluation",
      "Physiotherapy referral and rehabilitation plans",
    ],
    conditions: [
      "Fractures",
      "Osteoarthritis",
      "Back pain",
      "Ligament injuries",
      "Gout",
    ],
    prepare: [
      "Bring any X-rays or scan images you already have",
      "Wear loose clothing that allows the area to be examined",
    ],
    duration: 30,
  },
  {
    slug: "endocrinology-diabetes",
    name: "Endocrinology & Diabetes",
    short: "Diabetes",
    category: "Specialist",
    image: "/images/lab.jpg",
    summary:
      "Structured care for diabetes, thyroid and hormone conditions, with on-site laboratory monitoring.",
    intro:
      "Diabetes and hormone disorders need steady, long-term partnership. We help patients understand their numbers, adjust treatment safely and prevent complications — particularly to the kidneys, eyes and heart.",
    offers: [
      "Diabetes diagnosis and treatment plans",
      "HbA1c and blood sugar monitoring",
      "Insulin initiation and education",
      "Thyroid disorder management",
      "Diabetic foot and kidney screening",
    ],
    conditions: [
      "Type 1 & type 2 diabetes",
      "Thyroid disease",
      "Obesity and metabolic syndrome",
      "Gestational diabetes",
    ],
    prepare: [
      "Fast for 8–10 hours if a fasting blood test is planned",
      "Bring your glucose meter or sugar diary",
    ],
    duration: 30,
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    short: "Skin",
    category: "Specialist",
    image: "/images/hero.jpg",
    summary:
      "Assessment and treatment of skin, hair and nail conditions for adults and children.",
    intro:
      "Skin conditions affect comfort and confidence. Our dermatology clinic offers careful diagnosis and practical treatment for common and persistent skin problems.",
    offers: [
      "Eczema and dermatitis care",
      "Acne and pigmentation clinics",
      "Fungal and bacterial skin infections",
      "Hair and scalp disorders",
      "Skin lesion assessment",
    ],
    conditions: ["Eczema", "Acne", "Hyperpigmentation", "Fungal infections", "Psoriasis"],
    prepare: [
      "Avoid applying creams on the affected area on the day",
      "Bring any products or medicines you have been using",
    ],
    duration: 30,
  },
  {
    slug: "laboratory-diagnostics",
    name: "Laboratory & Diagnostics",
    short: "Lab tests",
    category: "Diagnostics",
    image: "/images/lab.jpg",
    summary:
      "On-site laboratory for fast, reliable results — so treatment decisions are made the same day wherever possible.",
    intro:
      "Good care starts with accurate results. Our in-house laboratory handles routine and specialist investigations, with results shared directly with your doctor.",
    offers: [
      "Full blood count, malaria and typhoid tests",
      "Kidney and liver function tests",
      "Blood sugar and HbA1c",
      "Urinalysis and electrolytes",
      "Pregnancy and hormone tests",
      "Pre-employment and routine health checks",
    ],
    conditions: ["Routine screening", "Monitoring of chronic illness", "Pre-surgery work-up"],
    prepare: [
      "Some tests need fasting — ask us when you book",
      "Bring your doctor's request form if you have one",
    ],
    duration: 15,
  },
  {
    slug: "emergency-general-practice",
    name: "24-Hour Emergency & General Practice",
    short: "Emergency",
    category: "Emergency",
    image: "/images/team.jpg",
    summary:
      "Open day and night for emergencies, admissions and general consultations — every day of the year.",
    intro:
      "Illness does not keep office hours, so neither do we. Our emergency team is available around the clock, supported by admission beds, laboratory services and on-call specialists.",
    offers: [
      "24-hour emergency care",
      "General medical consultations",
      "Inpatient admission and nursing care",
      "Minor procedures and wound care",
      "Referral and ambulance coordination",
    ],
    conditions: ["Acute illness", "Injuries", "High fever", "Breathing difficulty", "Chest pain"],
    prepare: [
      "In an emergency, come straight in or call 0708 902 9932",
      "Bring any medications the patient is currently taking",
    ],
    duration: 20,
  },
];

export const bookableServices = services.filter((s) => s.slug !== "emergency-general-practice").concat(
  services.filter((s) => s.slug === "emergency-general-practice").map((s) => ({ ...s, name: "General Consultation" }))
);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
