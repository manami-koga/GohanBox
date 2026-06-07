interface FabProps {
  onClick: () => void;
  label?: string;
}

export function Fab({ onClick, label = "食材をかんたん追加" }: FabProps) {
  return (
    <button type="button" className="fab" onClick={onClick} aria-label={label}>
      <svg
        className="fab__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 5c.55 0 1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1z"
        />
      </svg>
    </button>
  );
}
