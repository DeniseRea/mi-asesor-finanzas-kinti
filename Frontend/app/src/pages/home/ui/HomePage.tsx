import { Header } from '@widgets/header';

export function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-6 animate-pulse">
          ✨ Asistencia Financiera Inteligente
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent mb-6">
          Mi Asesor Finanzas Kinti
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Toma el control absoluto de tus finanzas personales con análisis predictivos, 
          presupuestos dinámicos y recomendaciones personalizadas impulsadas por IA.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]">
            Comenzar Gratis
          </button>
          <button className="px-8 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold transition-all hover:scale-[1.02]">
            Ver Demo
          </button>
        </div>
      </section>
    </main>
  );
}
