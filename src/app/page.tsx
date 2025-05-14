'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PromptForm from '@/components/PromptForm'
import PromptSearchHistorySidebar from '@/components/PromptSearchHistorySidebar'
import { Box, Typography } from '@mui/material'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (!user) {
    return null
  }

  return (
    <>
      <PromptSearchHistorySidebar historyRefreshKey={historyRefreshKey} />
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: 6,
          px: 2,
          width: '100%',
          maxWidth: 700,
          mx: 'auto',
          ml: { md: '520px' },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            <span role="img" aria-label="chef">👨‍🍳</span> PromptChef
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Créez des prompts efficaces et personnalisés pour vos outils d&apos;IA préférés.
          </Typography>
        </Box>
        <PromptForm onPromptGenerated={() => setHistoryRefreshKey(k => k + 1)} />
      </Box>
    </>
  )
}
