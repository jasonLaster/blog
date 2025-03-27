export function Bio({
  title,
  items,
  className,
}: {
  title: string;
  items: { title: string; href: string; label: string; date: string }[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Desktop version */}
      <div className="hidden md:block">
        <h2
          style={{
            paddingInlineEnd: "1rem",
            top: "auto",
            transform: "translateX(-100%)",
          }}
          className="absolute left-0 text-neutral-400"
        >
          {title}
        </h2>
        <ul>
          {items.map((item) => (
            <li key={item.title}>
              <div className="flex flex-row justify-between my-1">
                <div className="flex justify-between grow">
                  <a href={item.href}>{item.title}</a>
                  <hr
                    role="separator"
                    className="border-t border-neutral-300 dark:border-neutral-700 my-2 flex-grow self-center mx-4"
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex justify-end shrink tabular-nums text-neutral-600 dark:text-neutral-400 self-center text-sm w-16">
                  <span>{item.date}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile version */}
      <div className="block md:hidden">
        <h2 className="text-neutral-400 mb-4">{title}</h2>
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item.title} className="space-y-1">
              <a href={item.href} className="font-medium block">
                {item.title}
              </a>
              <div className="flex gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="tabular-nums">{item.date}</span>
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
