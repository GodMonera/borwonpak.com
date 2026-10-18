import type { ReactNode } from "react";
import type { Skin } from "@/lib/skins";
import { Fret } from "@/components/neck/fret";
import { Band } from "@/components/hud/band";
import { Leaf } from "@/components/palm/leaf";

/**
 * One homepage section, titled in whichever visual language is live.
 *
 * `position` is a fret number and `index` a sequence number — the same section
 * is "fret 5" on the neck and "02" on the readout, and those are different
 * numbers on purpose, so the caller supplies both.
 */
export function SectionDivider({
  skin,
  position,
  index,
  title,
  meta,
  id,
  children,
}: {
  skin: Skin;
  position: number;
  index: string;
  title: string;
  meta?: string;
  id?: string;
  children: ReactNode;
}) {
  if (skin === "hud") {
    return (
      <Band index={index} title={title} meta={meta} id={id}>
        {children}
      </Band>
    );
  }

  if (skin === "palm") {
    return (
      <Leaf index={index} title={title} meta={meta} id={id}>
        {children}
      </Leaf>
    );
  }

  return (
    <Fret position={position} title={title} meta={meta} id={id}>
      {children}
    </Fret>
  );
}
