import type { AssetDto } from "@/src/lib/api";

export function sortAssetsByBookOrder(assets: AssetDto[]): AssetDto[] {
  return [...assets].sort((a, b) => a.orderIndex - b.orderIndex);
}
