import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  backTo?: string;
}

export function Header({ title, backTo }: HeaderProps) {
  if (backTo) {
    return (
      <header className="header header--with-back">
        <Link className="header__back" to={backTo}>
          ← 戻る
        </Link>
        <h1 className="header__title">{title}</h1>
        <span className="header__spacer" aria-hidden="true" />
      </header>
    );
  }

  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
    </header>
  );
}
