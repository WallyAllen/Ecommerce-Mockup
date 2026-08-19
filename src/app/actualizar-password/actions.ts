'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect(`/actualizar-password?error=${encodeURIComponent('Las contraseñas no coinciden')}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/actualizar-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/perfil?message=Contraseña actualizada correctamente.')
}
