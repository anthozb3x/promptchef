'use client'

import { useEffect, useState } from 'react'
import { AppBar, Toolbar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'état de l'authentification au chargement
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/auth')
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', px: { xs: 2, sm: 4 }, minHeight: 56 }}>
        {user ? (
          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Se déconnecter
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => router.push('/auth')}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Se connecter
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
} 