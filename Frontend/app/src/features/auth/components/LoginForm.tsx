'use client';

import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { loginUser } from '../api/login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email);
    setLoading(false);
    alert('Sesión Iniciada con: ' + email);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-md">
      <h3 className="text-xl font-bold text-slate-100">Ingresar</h3>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@ejemplo.com"
          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          required
        />
      </div>
      <Button type="submit">
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}
