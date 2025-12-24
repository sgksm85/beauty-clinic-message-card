/**
 * Message card templates
 * Each template defines the visual style for greeting cards
 */

export interface Template {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  pattern?: "simple" | "elegant" | "modern";
}

export const TEMPLATES: Template[] = [
  {
    id: "template1",
    name: "シンプル",
    description: "白を基調とした清潔感のあるデザイン",
    backgroundColor: "#FFFFFF",
    textColor: "#2C2C2C",
    accentColor: "#D4A373",
    pattern: "simple",
  },
  {
    id: "template2",
    name: "エレガント",
    description: "淡いピンクと花モチーフの優雅なデザイン",
    backgroundColor: "#FFF5F7",
    textColor: "#4A3C3C",
    accentColor: "#E8B4BC",
    pattern: "elegant",
  },
  {
    id: "template3",
    name: "モダン",
    description: "グレーと幾何学模様の洗練されたデザイン",
    backgroundColor: "#F5F5F5",
    textColor: "#1A1A1A",
    accentColor: "#8B8B8B",
    pattern: "modern",
  },
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
