import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bodyTextVariants = cva("font-sans leading-relaxed", {
  variants: {
    variant: {
      base: "text-base text-gray-700",
      lg: "text-lg text-gray-700",
      caption: "text-sm text-gray-500",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

interface BodyTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyTextVariants> {}

export function BodyText({ variant, className, children, ...props }: BodyTextProps) {
  return (
    <p className={cn(bodyTextVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
}
