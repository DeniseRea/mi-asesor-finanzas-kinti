import { config } from '@shared/config/env';

export function Header() {
  return (
    <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20">
            K
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {config.appName}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
            Características
          </a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
            Precios
          </a>
          <button className="px-4 py-1.5 rounded-md bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-sm font-medium transition-all">
            Ingresar
          </button>
        </div>
      </div>
    </header>
  );
}
