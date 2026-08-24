type CloseButtonProps = {
  onClick: () => void;
  label?: string;
};

export function CloseButton({ onClick, label = '닫기' }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
    >
      ×
    </button>
  );
}
