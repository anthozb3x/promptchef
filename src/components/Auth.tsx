'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success('Connexion réussie !')
        router.push('/')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        toast.success('Inscription réussie ! Vérifiez votre email.')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Fade in={!!error}>
            <Box>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Fade>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Se connecter' : 'Créer un compte'
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ou
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
            onClick={handleGoogleLogin}
          >
            Continuer avec Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
} 