import fs from "node:fs";
import path from "node:path";
import type { ProofExample } from "@/src/lib/marketing/proof-examples";
import {
  FEATURED_PROOF,
  GALLERY_PROOF_EXAMPLES,
  HERO_PROOF,
} from "@/src/lib/marketing/proof-examples";

function publicMarketingPath(urlPath: string): string {
  const relative = urlPath.replace(/^\//, "");
  return path.join(process.cwd(), "public", relative);
}

export function proofPairExists(example: Pick<ProofExample, "beforeSrc" | "afterSrc">): boolean {
  return (
    fs.existsSync(publicMarketingPath(example.beforeSrc)) &&
    fs.existsSync(publicMarketingPath(example.afterSrc))
  );
}

export function getHeroProof(): ProofExample | null {
  return proofPairExists(HERO_PROOF) ? HERO_PROOF : null;
}

export function getFeaturedProof(): ProofExample | null {
  return proofPairExists(FEATURED_PROOF) ? FEATURED_PROOF : null;
}

export function getAvailableGalleryProofs(): ProofExample[] {
  return GALLERY_PROOF_EXAMPLES.filter(proofPairExists);
}

/** For README / ops: gallery entries defined but files not yet on disk */
export function getMissingGalleryProofFilenames(): string[] {
  const missing = new Set<string>();
  for (const ex of GALLERY_PROOF_EXAMPLES) {
    const beforeFile = path.basename(ex.beforeSrc);
    const afterFile = path.basename(ex.afterSrc);
    if (!fs.existsSync(publicMarketingPath(ex.beforeSrc))) {
      missing.add(beforeFile);
    }
    if (!fs.existsSync(publicMarketingPath(ex.afterSrc))) {
      missing.add(afterFile);
    }
  }
  return [...missing].sort();
}
