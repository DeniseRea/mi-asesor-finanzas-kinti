import Image from 'next/image';
import { Header } from '@widgets/header';
import homeIcon from '../assets/home-icon.svg';
import '../assets/home.css';

export function HomePage() {
  return (
    <main className="home-container">
      <Header />
      
      <section className="hero-section">
        <div className="badge">
          <Image 
            src={homeIcon} 
            alt="Trend Icon" 
            width={20} 
            height={20} 
            className="opacity-90"
          />
          <span>Asistencia Financiera Inteligente</span>
        </div>
        
        <h1 className="title">
          Mi Asesor Finanzas Kinti
        </h1>
        
        <p className="description">
          Toma el control absoluto de tus finanzas personales con análisis predictivos, 
          presupuestos dinámicos y recomendaciones personalizadas impulsadas por IA.
        </p>

        <div className="button-group">
          <button className="btn-primary">
            Comenzar Gratis
          </button>
          <button className="btn-secondary">
            Ver Demo
          </button>
        </div>
      </section>
    </main>
  );
}
