interface ClickBarProps {
  text: string;
  className?: string;
  selected: boolean;
  focusColor: string;
  onClick: () => void;
}

export function ClickStrokeBar({
  text,
  className = "",
  onClick,
  selected,
  focusColor,
}: ClickBarProps) {
  return (
    <div className="relative w-full" onClick={onClick}>
      <div
        className={`
          w-full h-[56px] flex rounded-[8px] items-center px-4 cursor-pointer justify-between
         bg-[#F2F4F7] border
          ${selected ? `border-[${focusColor}]` : ""}
          ${className}
        `}
      >
        <span>{text}</span>
      </div>
    </div>
  );
}
