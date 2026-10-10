type PastBookLimitBadgeProps = {
  className?: string;
};

export function PastBookLimitBadge({ className = "" }: PastBookLimitBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 ${className}`.trim()}
      title="This photo is beyond your template's page count and will not be printed in the book."
    >
      Past book limit — won&apos;t print on this template
    </span>
  );
}
