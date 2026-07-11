import { config } from '@shared/config/env';

export function Header() {
  return (
    <header>
      <nav>
        <span>{config.appName}</span>
      </nav>
    </header>
  );
}
