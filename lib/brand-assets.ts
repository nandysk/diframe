// Logo and badge files, matched to the names in content/en.json and fr.json.
// To add one: put the file in public/brand, then add a line here with its size.
// A name without a file is shown as text, so nothing breaks while files are missing.

export type BrandImage = { src: string; width: number; height: number };

export const clientLogos: Record<string, BrandImage> = {
  SLB: { src: "/brand/clients/slb.webp", width: 800, height: 480 },
  "Aker Solutions": { src: "/brand/clients/aker-solutions.webp", width: 800, height: 227 },
  Supersonic: { src: "/brand/clients/supersonic.webp", width: 290, height: 60 },
};

export const certificationImages: Record<string, BrandImage> = {
  "Cisco CCNA": { src: "/brand/certifications/cisco-ccna.webp", width: 518, height: 331 },
  Fortinet: { src: "/brand/certifications/fortinet.webp", width: 652, height: 76 },
  "Microsoft Power BI Data Analyst (PL-300)": {
    src: "/brand/certifications/power-bi-pl-300.webp",
    width: 570,
    height: 590,
  },
  "ITIL 4 Practitioner Service Configuration Management": {
    src: "/brand/certifications/itil-4-practitioner.webp",
    width: 800,
    height: 800,
  },
};
