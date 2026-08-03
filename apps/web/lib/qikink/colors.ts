export interface AppColorOption {
  name: string;
  code: string;
  hex: string;
}

export const QIKINK_EXCEL_COLORS: AppColorOption[] = [
  { name: "Baby Blue", code: "BB", hex: "#B0E0E6" },
  { name: "Baby Pink", code: "BPk", hex: "#F8C8DC" },
  { name: "Beige", code: "Be", hex: "#F5F5DC" },
  { name: "Black", code: "Bk", hex: "#18181B" },
  { name: "Black Charcoal Melange", code: "BkCm", hex: "#282C34" },
  { name: "Black White", code: "BkWh", hex: "#3F3F46" },
  { name: "Black melange", code: "Bml", hex: "#27272A" },
  { name: "Bottle Green", code: "Gn", hex: "#093824" },
  { name: "Brick Red", code: "BRd", hex: "#B22222" },
  { name: "Brown Black", code: "BrBk", hex: "#3B2F2F" },
  { name: "Charcoal Melange", code: "Cm", hex: "#4B5563" },
  { name: "Coffee Brown", code: "Bn", hex: "#4A2C2A" },
  { name: "Coffee Brown off white", code: "BnOw", hex: "#6E473B" },
  { name: "Copper", code: "Cop", hex: "#B87333" },
  { name: "Coral", code: "Cor", hex: "#FF7F50" },
  { name: "Flag Green", code: "Fgn", hex: "#006400" },
  { name: "Flamingo", code: "Fl", hex: "#FC8EAC" },
  { name: "Golden Yellow", code: "GYl", hex: "#FFD700" },
  { name: "Green Black", code: "GrBk", hex: "#1C392B" },
  { name: "Grey", code: "Gry", hex: "#808080" },
  { name: "Grey Melange", code: "Gm", hex: "#9CA3AF" },
  { name: "Jade", code: "Jd", hex: "#00A86B" },
  { name: "Khaki", code: "Kk", hex: "#C3B091" },
  { name: "Lavender", code: "Lv", hex: "#E6E6FA" },
  { name: "Light Baby Pink", code: "LBp", hex: "#FFDBE9" },
  { name: "Maroon", code: "Mn", hex: "#800000" },
  { name: "Maroon off white", code: "MnOw", hex: "#8B263E" },
  { name: "Mint", code: "Mnt", hex: "#3EB489" },
  { name: "Mushroom", code: "Mh", hex: "#BD8D6E" },
  { name: "Mustard Yellow", code: "MYl", hex: "#FFDB58" },
  { name: "Mustard yellow off white", code: "MyOw", hex: "#E5C158" },
  { name: "Navy Blue", code: "Nb", hex: "#000080" },
  { name: "Navy melange", code: "Nml", hex: "#1E293B" },
  { name: "New Yellow", code: "NYl", hex: "#FFF01F" },
  { name: "Off White", code: "OFw", hex: "#FAF0E6" },
  { name: "Olive Green", code: "OG", hex: "#556B2F" },
  { name: "Olive Green off white", code: "OgOw", hex: "#6B7A46" },
  { name: "Orange", code: "Or", hex: "#FFA500" },
  { name: "Orchid Blue", code: "Ob", hex: "#6A5ACD" },
  { name: "Peach", code: "Ph", hex: "#FFDAB9" },
  { name: "Petrol Blue", code: "Pb", hex: "#005F73" },
  { name: "Pink", code: "Pk", hex: "#FFC0CB" },
  { name: "Purple", code: "Pu", hex: "#800080" },
  { name: "Purple melange", code: "PMl", hex: "#6B46C1" },
  { name: "Red", code: "Rd", hex: "#FF0000" },
  { name: "Royal Blue", code: "Rb", hex: "#4169E1" },
  { name: "Silver", code: "Sil", hex: "#C0C0C0" },
  { name: "SkyBlue", code: "Sb", hex: "#87CEEB" },
  { name: "Steel Grey", code: "SG", hex: "#4682B4" },
  { name: "White", code: "Wh", hex: "#FFFFFF" },
  { name: "White Black", code: "WhBk", hex: "#E4E4E7" },
  { name: "White Lavender", code: "WhLv", hex: "#F3E8FF" },
  { name: "Yellow", code: "Yl", hex: "#FFFF00" },
];

export const COLOR_SKU_CODE_MAP: Record<string, string> = QIKINK_EXCEL_COLORS.reduce((acc, curr) => {
  acc[curr.name] = curr.code;
  acc[curr.name.toLowerCase()] = curr.code;
  return acc;
}, {} as Record<string, string>);

export function getColorSkuCode(colorName: string): string {
  if (!colorName) return "XX";
  const nameTrimmed = colorName.trim();
  const directMatch = COLOR_SKU_CODE_MAP[nameTrimmed];
  if (directMatch) return directMatch;
  const lowerMatch = COLOR_SKU_CODE_MAP[nameTrimmed.toLowerCase()];
  if (lowerMatch) return lowerMatch;
  return nameTrimmed.slice(0, 2).toUpperCase();
}

export function generateVariantSku(baseSku: string, colorName: string, size: string): string {
  const code = getColorSkuCode(colorName);
  const cleanBase = baseSku ? baseSku.trim() : "SKU";
  return `${cleanBase}-${code}-${size}`;
}
