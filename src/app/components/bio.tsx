
export function Bio({ title, items, className }: { title: string, items: { title: string, href: string, label: string, date: string }[], className?: string }) {
  return (
    <div className={`relative  ${className}`} >
      <h2 style={{ paddingInlineEnd: "1rem",
        top: "auto",
        transform: "translateX(-100%)"
        }} 
        className="absolute left-0 text-neutral-400">{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <div className="flex flex-row justify-between my-1">
              <div className="flex justify-between grow">
                <a href={item.href}>{item.title}</a>
                <hr role="separator" className="border-t border-neutral-300 my-2 flex-grow self-center mx-4" />
                <span>{item.label}</span>
              </div>
              <div className="flex justify-end shrink tabular-nums text-neutral-600 self-center text-sm w-16">
                <span>{item.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}