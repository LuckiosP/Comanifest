import Image from "next/image";

type ComanifestLogoMarkProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/** Seven-star constellation mark — silver on dark surfaces, midnight on light. */
export function ComanifestLogoMark({
  size = 32,
  className = "size-8 shrink-0",
  priority = false,
}: ComanifestLogoMarkProps) {
  return (
    <>
      <Image
        src="/brand/comanifest-logo-mark-on-light.svg"
        alt=""
        width={size}
        height={size}
        className={`${className} dark:hidden`}
        priority={priority}
      />
      <Image
        src="/brand/comanifest-logo-mark-on-dark.svg"
        alt=""
        width={size}
        height={size}
        className={`${className} hidden dark:block`}
        priority={priority}
      />
    </>
  );
}
