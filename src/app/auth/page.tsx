import { Metadata } from 'next'
import Auth from '@/components/Auth'
import { Box, Typography, Container } from '@mui/material'

export const metadata: Metadata = {
  title: 'Authentification - PromptChef',
  description: 'Connectez-vous ou créez un compte pour accéder à PromptChef.',
}

export default function AuthPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <Typography variant="h3" component="span">
              👨‍🍳
            </Typography>
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #000000 30%, #666666 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            PromptChef
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Créez des prompts efficaces et personnalisés pour vos outils d'IA préférés.
          </Typography>
        </Box>

        <Auth />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            En continuant, vous acceptez nos{' '}
            <Box
              component="a"
              href="/terms"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              conditions d'utilisation
            </Box>{' '}
            et notre{' '}
            <Box
              component="a"
              href="/privacy"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              politique de confidentialité
            </Box>
            .
          </Typography>
        </Box>
      </Container>
    </Box>
  )
} 