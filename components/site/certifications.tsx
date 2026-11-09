import Image from "next/image";
import { order } from "@/components/site/motion";
import { certificationImages } from "@/lib/brand-assets";

// Badges keep their original colors, so they sit on white in both themes.
export function Certifications({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, index) => {
        const image = certificationImages[item];
        return (
          <li key={item} data-reveal="" style={order(index)} className="flex">
            <div className="plaque flex min-h-44 w-full flex-col items-center justify-center gap-3 p-4 text-center">
              {image && (
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="160px"
                  className="h-auto max-h-20 w-auto max-w-[80%] object-contain"
                />
              )}
              <p className={image ? "text-[0.8125rem] font-medium leading-snug" : "text-[1.0625rem] font-medium leading-snug"}>
                {item}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
