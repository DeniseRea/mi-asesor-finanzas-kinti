// Bridge: Next.js App Router → FSD pages layer
// Este archivo solo delega al componente FSD correspondiente
import { HomePage } from '@pages/home';

export default function Page() {
  return <HomePage />;
}
