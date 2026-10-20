import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ChartColumn,
  KeyRound,
  Languages,
  Mails,
  PanelsTopLeft,
  Sparkles,
  Theater,
  Webhook,
} from "lucide-react";
import {
  siAstro,
  siCss,
  siDocker,
  siElectron,
  siEslint,
  siExpress,
  siGit,
  siGithub,
  siGraphql,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siKonva,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPinia,
  siPm2,
  siPnpm,
  siPostgresql,
  siPrettier,
  siPrisma,
  siPuppeteer,
  siReact,
  siReacthookform,
  siReactquery,
  siReactrouter,
  siRedis,
  siRedux,
  siShadcnui,
  siSharp,
  siShopify,
  siSocketdotio,
  siSqlite,
  siTailwindcss,
  siTurborepo,
  siTypescript,
  siVercel,
  siVite,
  siVuedotjs,
  siVuetify,
  siWebassembly,
  siZod,
} from "simple-icons";
import type { TechId } from "./tech-ids";

export type { TechId } from "./tech-ids";

// A brand mark from simple-icons (24×24 path) or a neutral lucide glyph for
// the few technologies simple-icons doesn't carry.
export type TechIconSource =
  | { kind: "brand"; path: string; hex: string }
  | { kind: "glyph"; icon: LucideIcon };

export interface Tech {
  id: TechId;
  label: string;
  icon: TechIconSource;
}

interface SimpleIconLike {
  path: string;
  hex: string;
}

const brand = ({ path, hex }: SimpleIconLike): TechIconSource => ({
  kind: "brand",
  path,
  hex: `#${hex}`,
});
const glyph = (icon: LucideIcon): TechIconSource => ({ kind: "glyph", icon });

const registry: Record<TechId, Omit<Tech, "id">> = {
  react: { label: "React", icon: brand(siReact) },
  nextjs: { label: "Next.js", icon: brand(siNextdotjs) },
  vue: { label: "Vue.js", icon: brand(siVuedotjs) },
  nuxt: { label: "Nuxt", icon: brand(siNuxt) },
  astro: { label: "Astro", icon: brand(siAstro) },
  typescript: { label: "TypeScript", icon: brand(siTypescript) },
  javascript: { label: "JavaScript", icon: brand(siJavascript) },
  html: { label: "HTML5", icon: brand(siHtml5) },
  css: { label: "CSS", icon: brand(siCss) },
  tailwind: { label: "Tailwind CSS", icon: brand(siTailwindcss) },
  shadcn: { label: "shadcn/ui", icon: brand(siShadcnui) },
  vuetify: { label: "Vuetify", icon: brand(siVuetify) },
  redux: { label: "Redux Toolkit", icon: brand(siRedux) },
  "rtk-query": { label: "RTK Query", icon: brand(siRedux) },
  "tanstack-query": { label: "TanStack Query", icon: brand(siReactquery) },
  zustand: { label: "Zustand", icon: glyph(PanelsTopLeft) },
  pinia: { label: "Pinia", icon: brand(siPinia) },
  "react-hook-form": { label: "React Hook Form", icon: brand(siReacthookform) },
  "react-router": { label: "React Router", icon: brand(siReactrouter) },
  konva: { label: "Konva", icon: brand(siKonva) },
  nodejs: { label: "Node.js", icon: brand(siNodedotjs) },
  express: { label: "Express", icon: brand(siExpress) },
  prisma: { label: "Prisma", icon: brand(siPrisma) },
  postgresql: { label: "PostgreSQL", icon: brand(siPostgresql) },
  mongodb: { label: "MongoDB", icon: brand(siMongodb) },
  mysql: { label: "MySQL", icon: brand(siMysql) },
  sqlite: { label: "SQLite", icon: brand(siSqlite) },
  redis: { label: "Redis", icon: brand(siRedis) },
  graphql: { label: "GraphQL", icon: brand(siGraphql) },
  rest: { label: "REST APIs", icon: glyph(Braces) },
  webhooks: { label: "Webhooks", icon: glyph(Webhook) },
  socketio: { label: "Socket.IO", icon: brand(siSocketdotio) },
  shopify: { label: "Shopify", icon: brand(siShopify) },
  polaris: { label: "Polaris", icon: brand(siShopify) },
  webassembly: { label: "WebAssembly", icon: brand(siWebassembly) },
  auth: { label: "Auth.js", icon: glyph(KeyRound) },
  jwt: { label: "JWT", icon: brand(siJsonwebtokens) },
  zod: { label: "Zod", icon: brand(siZod) },
  i18n: { label: "i18n", icon: glyph(Languages) },
  openai: { label: "OpenAI API", icon: glyph(Sparkles) },
  playwright: { label: "Playwright", icon: glyph(Theater) },
  puppeteer: { label: "Puppeteer", icon: brand(siPuppeteer) },
  electron: { label: "Electron", icon: brand(siElectron) },
  docker: { label: "Docker", icon: brand(siDocker) },
  pm2: { label: "PM2", icon: brand(siPm2) },
  git: { label: "Git", icon: brand(siGit) },
  github: { label: "GitHub", icon: brand(siGithub) },
  vite: { label: "Vite", icon: brand(siVite) },
  turborepo: { label: "Turborepo", icon: brand(siTurborepo) },
  pnpm: { label: "pnpm", icon: brand(siPnpm) },
  eslint: { label: "ESLint", icon: brand(siEslint) },
  prettier: { label: "Prettier", icon: brand(siPrettier) },
  vercel: { label: "Vercel", icon: brand(siVercel) },
  charts: { label: "Charts", icon: glyph(ChartColumn) },
  sharp: { label: "sharp", icon: brand(siSharp) },
  email: { label: "Email delivery", icon: glyph(Mails) },
};

export function getTech(id: TechId): Tech {
  return { id, ...registry[id] };
}

export function getTechs(ids: readonly TechId[]): Tech[] {
  return ids.map(getTech);
}
