import type { ReactNode } from "react";

// Diframe's own icon set, drawn on a 32-unit grid. Each icon has one line weight and
// one element in the division's color, so color carries the signal here as everywhere else.
const fill = { fill: "var(--hue)", stroke: "none" };
const line = { stroke: "var(--hue)" };

const SHIELD = "M16 3l10 4v8c0 6.5-4.2 11-10 14C10.2 26 6 21.5 6 15V7z";

const ICONS: Record<string, ReactNode> = {
  // Software
  website: (
    <>
      <rect x="4" y="6" width="24" height="20" rx="3" />
      <path d="M4 12h24M8 23h9" />
      <circle cx="7.5" cy="9" r="0.5" />
      <circle cx="10.5" cy="9" r="0.5" />
      <rect x="8" y="15.5" width="16" height="4" rx="1" {...fill} />
    </>
  ),
  customSoftware: (
    <>
      <path d="M11 8l-7 8 7 8M21 8l7 8-7 8" />
      <path d="M16 11l5 5-5 5-5-5z" {...fill} />
    </>
  ),
  webMobile: (
    <>
      <path d="M17 21H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1M8 26h9M12.5 21v5" />
      <rect x="20" y="12" width="9" height="16" rx="2" />
      <rect x="22" y="15" width="5" height="8" rx="0.75" {...fill} />
    </>
  ),
  saas: (
    <>
      <path d="M27 13A11.5 11.5 0 0 0 7 8.5L4 12M4 5v7h7M5 19a11.5 11.5 0 0 0 20 4.5l3-3.5M28 27v-7h-7" />
      <rect x="12.5" y="12.5" width="7" height="7" rx="1.5" {...fill} />
    </>
  ),
  domain: (
    <>
      <circle cx="16" cy="12" r="9" />
      <ellipse cx="16" cy="12" rx="4" ry="9" />
      <path d="M7 12h18" />
      <rect x="6" y="24" width="20" height="4" rx="2" {...fill} />
    </>
  ),

  // AI and automation
  aiAgent: (
    <>
      <rect x="7" y="11" width="18" height="15" rx="4" />
      <path d="M16 11V7M4 16v5M28 16v5M13 22h6" />
      <circle cx="16" cy="5" r="2.25" {...fill} />
      <circle cx="12.5" cy="17" r="1.25" />
      <circle cx="19.5" cy="17" r="1.25" />
    </>
  ),
  agentic: (
    <>
      <path d="M16 9.5V19M7 19v-2a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2" />
      <circle cx="16" cy="6" r="3.5" {...fill} />
      <rect x="3.5" y="19" width="7" height="7" rx="2" />
      <rect x="12.5" y="19" width="7" height="7" rx="2" />
      <rect x="21.5" y="19" width="7" height="7" rx="2" />
    </>
  ),
  processAutomation: (
    <>
      <rect x="2.5" y="13" width="6" height="6" rx="1.5" />
      <rect x="23.5" y="13" width="6" height="6" rx="1.5" />
      <path d="M8.5 16H11M21 16h2.5" />
      <path d="M16 10.5l5.5 5.5-5.5 5.5-5.5-5.5z" {...fill} />
    </>
  ),
  workflow: (
    <>
      <circle cx="6" cy="16" r="2.5" />
      <path d="M8.5 16H12c3.5 0 2.5-8 6-8h4M12 16c3.5 0 2.5 8 6 8h4" />
      <rect x="22" y="5" width="6" height="6" rx="1.5" />
      <rect x="22" y="21" width="6" height="6" rx="1.5" {...fill} />
    </>
  ),
  aiIntegration: (
    <>
      <path d="M15 12h-4a6 6 0 0 0 0 12h4zM15 15h4M15 21h4M5 18H2M11 24v2a3 3 0 0 0 3 3h10" />
      <path d="M24 2l1.6 4.4L30 8l-4.4 1.6L24 14l-1.6-4.4L18 8l4.4-1.6z" {...fill} />
    </>
  ),

  // Data and BI
  analytics: (
    <>
      <path d="M3 28h26M6 28v-7M11 28v-11M16 28v-3" />
      <circle cx="20" cy="11" r="6.5" />
      <path d="M24.8 15.8L29 20" />
      <circle cx="20" cy="11" r="2.5" {...fill} />
    </>
  ),
  powerBi: (
    <>
      <rect x="4" y="4" width="24" height="24" rx="3" />
      <rect x="9" y="17" width="3.5" height="6" rx="1" />
      <rect x="14.25" y="13" width="3.5" height="10" rx="1" />
      <rect x="19.5" y="9" width="3.5" height="14" rx="1" {...fill} />
    </>
  ),
  dashboards: (
    <>
      <rect x="3" y="5" width="26" height="22" rx="3" />
      <path d="M12 5v22M6 11h3M6 16h3M6 21h3M16 15a4.5 4.5 0 0 1 9 0" />
      <path d="M18 18l7.5 2.6-3.1 1.3-1.3 3.1z" {...fill} />
    </>
  ),
  reporting: (
    <>
      <path d="M7 3h12l6 6v20H7zM19 3v6h6M11 14h9" />
      <rect x="11" y="21.5" width="2.5" height="3.5" rx="0.5" {...fill} />
      <rect x="15" y="19" width="2.5" height="6" rx="0.5" {...fill} />
      <rect x="19" y="17" width="2.5" height="8" rx="0.5" {...fill} />
    </>
  ),
  decision: (
    <>
      <path d="M16 4v23M10 27h12M6 8h20M6 8l-3.5 10M6 8l3.5 10M26 8l-3.5 10M26 8l3.5 10M2.5 18a3.5 3.5 0 0 0 7 0z" />
      <path d="M22.5 18a3.5 3.5 0 0 0 7 0z" {...fill} />
    </>
  ),

  // Infrastructure and cloud
  infrastructureDesign: (
    <>
      <path d="M4 3.5h24M4 2v3M28 2v3" />
      <rect x="4" y="9" width="24" height="19" rx="1" />
      <path d="M4 19h9v9M19 9v6" />
      <circle cx="21" cy="21.5" r="2.5" {...fill} />
    </>
  ),
  server: (
    <>
      <rect x="4" y="5" width="24" height="9" rx="2" />
      <rect x="4" y="18" width="24" height="9" rx="2" />
      <path d="M16 14v4M19 9.5h5M19 22.5h5" />
      <circle cx="9" cy="9.5" r="1.6" {...fill} />
      <circle cx="9" cy="22.5" r="1.6" {...fill} />
    </>
  ),
  networkArchitecture: (
    <>
      <path d="M16 9v11M6 20v-2a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v2" />
      <rect x="11" y="3" width="10" height="6" rx="1.5" {...fill} />
      <circle cx="6" cy="23.5" r="3.5" />
      <circle cx="16" cy="23.5" r="3.5" />
      <circle cx="26" cy="23.5" r="3.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M9 17a5.5 5.5 0 0 1-.6-11A8 8 0 0 1 23.6 7.1 5 5 0 0 1 24 17zM16 17v4" />
      <rect x="8" y="21" width="16" height="7" rx="1.5" {...fill} />
    </>
  ),
  systemsManagement: (
    <>
      <rect x="3" y="5" width="26" height="17" rx="2.5" />
      <path d="M16 22v5M10 27h12" />
      <path d="M7 14h4l2-4 3.5 8 2.5-4h6" {...line} />
    </>
  ),

  // Cybersecurity
  networkSecurity: (
    <>
      <path d={SHIELD} />
      <path d="M16 14l-5-3.5M16 14l5-3.5M16 14v7" />
      <circle cx="16" cy="14" r="2.5" {...fill} />
      <circle cx="10.5" cy="10" r="1.25" />
      <circle cx="21.5" cy="10" r="1.25" />
      <circle cx="16" cy="22" r="1.25" />
    </>
  ),
  infrastructureProtection: (
    <>
      <path d={SHIELD} />
      <rect x="11" y="9.5" width="10" height="4.5" rx="1" />
      <rect x="11" y="16" width="10" height="4.5" rx="1" {...fill} />
    </>
  ),
  consulting: (
    <>
      <path d="M5 4h22a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H13l-6 5v-5H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M16 7.5l5 2V13c0 3-2 5-5 6.5-3-1.5-5-3.5-5-6.5V9.5z" {...fill} />
    </>
  ),
  securitySaas: (
    <>
      <path d="M9 17a5.5 5.5 0 0 1-.6-11A8 8 0 0 1 23.6 7.1 5 5 0 0 1 24 17h-1M9 17" />
      <path d="M12.5 20v-3a3.5 3.5 0 0 1 7 0v3" />
      <rect x="10" y="20" width="12" height="9" rx="2" {...fill} />
    </>
  ),
  securityArchitecture: (
    <>
      <circle cx="16" cy="16" r="13" />
      <circle cx="16" cy="16" r="8.5" />
      <circle cx="16" cy="14.5" r="2.5" {...fill} />
      <path d="M15 16h2l1 4.5h-4z" {...fill} />
    </>
  ),

  // Design and documents
  graphicDesign: (
    <>
      <path d="M16 3l7.5 12.5L19 24h-6l-4.5-8.5zM16 3v10M12 28h8" />
      <circle cx="16" cy="15" r="2.25" {...fill} />
    </>
  ),
  brandIdentity: (
    <>
      <rect x="4" y="4" width="24" height="24" rx="3" />
      <path d="M14 8.5h7l-3 8.5h-7z" {...fill} />
      <circle cx="10.5" cy="22.5" r="1.75" />
      <circle cx="16" cy="22.5" r="1.75" />
      <circle cx="21.5" cy="22.5" r="1.75" />
    </>
  ),
  visualCommunication: (
    <>
      <path d="M15 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v9M3 17l6-6 5 5 2.5-2.5" />
      <circle cx="18" cy="9" r="2" {...fill} />
      <path d="M19 18h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3l-3 3v-3h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="13" width="24" height="5" rx="1" />
      <path d="M6 18v10h20V18M13 22.5h6" />
      <path d="M16 10V2.5M12.5 6L16 2.5 19.5 6" {...line} />
    </>
  ),
  documentManagement: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 21.5h9" />
      <rect x="9" y="14.5" width="14" height="3" rx="1" {...fill} />
    </>
  ),
};

/** The icon named in the content files, on a tile tinted with the division's color. */
export function ServiceIcon({ name }: { name: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--hue)_14%,transparent)]">
      <svg viewBox="0 0 32 32" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </span>
  );
}
