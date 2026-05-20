import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-display font-bold leading-tight tracking-tight", {
  variants: {
    size: {
      h1: "text-4xl md:text-5xl lg:text-6xl",
      h2: "text-3xl md:text-4xl",
      h3: "text-2xl md:text-3xl",
      h4: "text-xl font-sans",
    },
  },
  defaultVariants: {
    size: "h2",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4";

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export function Heading({ as, size, className, children, ...props }: HeadingProps) {
  const resolvedSize = size ?? "h2";
  const Tag = (as ?? resolvedSize) as HeadingTag;

  return (
    <Tag
      className={cn(headingVariants({ size: resolvedSize }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Subheading({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-sans text-lg md:text-xl text-gray-600 leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
