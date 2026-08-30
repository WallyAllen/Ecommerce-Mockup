'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/actualizar-password`,
  })

  if (error) {
    redirect(`/recuperar-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/recuperar-password?message=Revisa tu correo para el enlace de recuperación.')
}
