"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// Avatars are circles, the one round shape in Rezi UI besides Button. That is
// safe because an avatar stands for a person and is never a control on its
// own; wrap it in a Button or link when it should do something.
//
// Size sets the font size too, so the fallback initials scale with the circle.
const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full select-none", {
  variants: {
    size: {
      sm: "size-6 text-[10px]",
      default: "size-8 text-xs",
      lg: "size-10 text-sm",
    },
  },
  defaultVariants: { size: "default" },
});

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>;

function Avatar({ className, size, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size ?? "default"}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

// A 1px outline at 10% black (white in dark) gives light photos an edge
// against light surfaces. It is an outline drawn inside the image, not an
// inset box-shadow, because an <img> paints its pixels over its own shadow.
function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10",
        className,
      )}
      {...props}
    />
  );
}

// Six pastel gradients for seeded fallbacks. Hues stay at least 15° away from
// the brand blue (which means "interactive") and from the four status hues, so
// a coloured avatar never reads as a link or a warning. Initials are a dark
// shade of the same hue: 6.6:1 or more on both stops in light, 7.3:1 in dark.
// The palette lives here, not in the theme: no other component uses it.
const gradients = {
  peach:
    "from-[oklch(0.92_0.048_55)] to-[oklch(0.84_0.09_70)] text-[oklch(0.36_0.07_70)] dark:from-[oklch(0.4_0.08_55)] dark:to-[oklch(0.32_0.07_70)] dark:text-[oklch(0.93_0.03_55)]",
  lime: "from-[oklch(0.92_0.06_125)] to-[oklch(0.84_0.09_140)] text-[oklch(0.36_0.07_140)] dark:from-[oklch(0.4_0.08_125)] dark:to-[oklch(0.32_0.08_140)] dark:text-[oklch(0.93_0.03_125)]",
  teal: "from-[oklch(0.92_0.06_190)] to-[oklch(0.84_0.09_205)] text-[oklch(0.36_0.062_205)] dark:from-[oklch(0.4_0.068_190)] dark:to-[oklch(0.32_0.054_205)] dark:text-[oklch(0.93_0.03_190)]",
  violet:
    "from-[oklch(0.92_0.04_285)] to-[oklch(0.84_0.09_300)] text-[oklch(0.36_0.07_300)] dark:from-[oklch(0.4_0.08_285)] dark:to-[oklch(0.32_0.08_300)] dark:text-[oklch(0.93_0.03_285)]",
  orchid:
    "from-[oklch(0.92_0.058_318)] to-[oklch(0.84_0.09_333)] text-[oklch(0.36_0.07_333)] dark:from-[oklch(0.4_0.08_318)] dark:to-[oklch(0.32_0.08_333)] dark:text-[oklch(0.93_0.03_318)]",
  rose: "from-[oklch(0.92_0.05_345)] to-[oklch(0.84_0.09_358)] text-[oklch(0.36_0.07_358)] dark:from-[oklch(0.4_0.08_345)] dark:to-[oklch(0.32_0.08_358)] dark:text-[oklch(0.93_0.03_345)]",
} as const;

type AvatarGradient = keyof typeof gradients;
const gradientNames = Object.keys(gradients) as AvatarGradient[];

/**
 * The gradient a seed maps to. FNV-1a over the UTF-16 code units: stable
 * across server and client renders (no randomness), and it spreads similar
 * seeds such as "ana@x.com" and "ana@y.com" apart, which a plain character
 * sum would not.
 */
function avatarGradient(seed: string): AvatarGradient {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return gradientNames[(hash >>> 0) % gradientNames.length];
}

// Shown while the image loads and when it fails or is missing. By default:
// initials on the accent surface with the same 1px edge as the default Badge,
// the quiet choice for dense UI. With a seed (a name or email), one of the six
// gradients instead, so a person keeps the same colour wherever they appear.
function AvatarFallback({
  className,
  seed,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  /** A stable value such as an email; picks the gradient. Omit for the neutral fallback. */
  seed?: string;
}) {
  const gradient = seed === undefined ? undefined : avatarGradient(seed);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-gradient={gradient}
      className={cn(
        "flex size-full items-center justify-center rounded-full font-medium ring ring-border ring-inset",
        gradient ? cn("bg-linear-135", gradients[gradient]) : "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

// Overlapping avatars with a 2px ring in the page colour so the circles stay
// separate. The overlap is 4px, not the usual 8px: with the ring, an 8px
// overlap starts covering a 32px avatar at 22px, which clips the second
// letter of centred 12px initials; at 4px the cover starts at 26px. On a card,
// pass `*:data-[slot=avatar]:ring-card` (or any surface) through className so
// the ring matches what is behind it.
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-1 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", className)}
      {...props}
    />
  );
}

/**
 * The "+N" circle at the end of a group. Add screen-reader text such as
 * `+3<span className="sr-only"> more people</span>`: "+3" alone is ambiguous,
 * and an aria-label on a plain span is ignored.
 */
function AvatarGroupCount({ className, size, ...props }: React.ComponentProps<"span"> & VariantProps<typeof avatarVariants>) {
  return (
    <span
      data-slot="avatar"
      data-size={size ?? "default"}
      className={cn(
        avatarVariants({ size }),
        // The 1px edge is an outline: the group's 2px separating ring is a
        // box-shadow on this same element, and ring-inset would turn it inward.
        "items-center justify-center bg-accent font-medium text-accent-foreground tabular-nums outline-1 -outline-offset-1 outline-(--border)",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, avatarGradient, AvatarGroup, AvatarGroupCount, AvatarImage, avatarVariants };
export type { AvatarGradient };
