import { login, signup } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const { error, message } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center max-w-md">
      <div className="w-full bg-[#0a0a0a] p-8 border border-[#333]">
        <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider text-white mb-6 text-center">
          Ingresar
        </h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-6 text-sm font-bold text-center">
            {error === 'true' ? 'Credenciales inválidas o email sin confirmar.' : error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 mb-6 text-sm font-bold text-center">
            {message}
          </div>
        )}
        
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="tu@email.com"
              className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors"
            />
          </div>

          <button 
            formAction={login} 
            className="w-full bg-[#E60000] text-white font-black py-4 uppercase tracking-widest hover:bg-white hover:text-black hover:border-white border border-[#E60000] transition-colors"
          >
            Iniciar Sesión
          </button>
          
          <button 
            formAction={signup} 
            className="w-full bg-transparent text-white font-black py-4 uppercase tracking-widest hover:bg-[#111] border border-[#333] transition-colors mt-2"
          >
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  )
}
