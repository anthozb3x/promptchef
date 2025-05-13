'use client'

import { useState, useEffect } from 'react'
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  IconButton,
  CircularProgress,
  Fade,
  Card,
  CardHeader,
  CardContent
} from '@mui/material'
import { 
  AutoAwesome as SparklesIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const useCases = [
  { id: 'text', name: 'Texte (GPT, Claude, etc.)', icon: '📝' },
  { id: 'image', name: 'Image (DALL·E, Midjourney)', icon: '🎨' },
  { id: 'code', name: 'Code (GitHub Copilot, etc.)', icon: '💻' },
  { id: 'summary', name: 'Résumé de texte', icon: '📋' },
]

const categories = [
  { id: 'marketing', name: 'Marketing' },
  { id: 'seo', name: 'SEO' },
  { id: 'communication', name: 'Communication' },
  { id: 'formation', name: 'Formation' },
  { id: 'support', name: 'Support client' },
  { id: 'data', name: 'Data' },
  { id: 'uxui', name: 'UX/UI' },
  { id: 'strategie', name: 'Stratégie' },
  { id: 'social', name: 'Social Media' },
  { id: 'recherche', name: 'Recherche' },
  { id: 'traduction', name: 'Traduction' },
  { id: 'juridique', name: 'Juridique' },
  { id: 'finance', name: 'Finance' },
  { id: 'sante', name: 'Santé' },
  { id: 'education', name: 'Éducation' },
  { id: 'science', name: 'Science' },
  { id: 'voyage', name: 'Voyage' },
  { id: 'immobilier', name: 'Immobilier' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'code', name: 'Code' },
  { id: 'rh', name: 'Ressources humaines' },
  { id: 'produit', name: 'Produit' },
  { id: 'autre', name: 'Autre' },
]

const styles = [
  { id: 'pro', name: 'Professionnel' },
  { id: 'decontracte', name: 'Décontracté' },
  { id: 'amical', name: 'Amical' },
  { id: 'serieux', name: 'Sérieux' },
  { id: 'humoristique', name: 'Humoristique' },
]

function isValidJWT(token: string | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  return parts.length === 3
}

export default function PromptForm({ onPromptGenerated }: { onPromptGenerated?: () => void }) {
  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0])
  const [category, setCategory] = useState(categories[0])
  const [style, setStyle] = useState(styles[0])
  const [prompt, setPrompt] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Pour MVP, pas de preferences avancées
  const preferences = undefined

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null)
    })
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data?.session?.access_token || null)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('accessToken:', accessToken)
    if (!isValidJWT(accessToken)) {
      toast.error("Utilisateur non authentifié. Veuillez vous reconnecter.")
      return
    }
    setIsGenerating(true)
    setGeneratedPrompt('')
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          useCase: selectedUseCase.name,
          input_prompt: prompt,
          userId,
          category: category.name,
          style: style.name,
        })
      })
      const data = await res.json()
      if (res.ok && data.prompt) {
        setGeneratedPrompt(data.prompt)
        toast.success('Prompt généré avec succès !')
        if (onPromptGenerated) onPromptGenerated()
      } else {
        toast.error(data.error || 'Erreur lors de la génération du prompt')
      }
    } catch (error) {
      console.error('Erreur lors de la génération du prompt:', error)
      toast.error('Erreur lors de la génération du prompt')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    toast.success('Prompt copié dans le presse-papier !')
  }

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SparklesIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" component="h2" color="text.primary">
              Générateur de prompts IA
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Sélectionnez votre cas d'usage et décrivez ce que vous souhaitez obtenir. Notre IA vous aidera à créer le prompt parfait.
          </Typography>
        </Paper>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="use-case-label">Type de prompt</InputLabel>
            <Select
              labelId="use-case-label"
              value={selectedUseCase.id}
              label="Type de prompt"
              onChange={(e) => {
                const useCase = useCases.find(uc => uc.id === e.target.value)
                if (useCase) setSelectedUseCase(useCase)
              }}
            >
              {useCases.map((useCase) => (
                <MenuItem key={useCase.id} value={useCase.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>{useCase.icon}</span>
                    <span>{useCase.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select
              labelId="category-label"
              value={category.id}
              label="Catégorie"
              onChange={(e) => {
                const cat = categories.find(c => c.id === e.target.value)
                if (cat) setCategory(cat)
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="style-label">Style de réponse</InputLabel>
            <Select
              labelId="style-label"
              value={style.id}
              label="Style de réponse"
              onChange={(e) => {
                const s = styles.find(st => st.id === e.target.value)
                if (s) setStyle(s)
              }}
            >
              {styles.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Votre demande"
            multiline
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez ce que vous souhaitez obtenir..."
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isGenerating || !prompt.trim()}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <SparklesIcon />}
            fullWidth
            sx={{ 
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)'
              }
            }}
          >
            {isGenerating ? 'Génération en cours...' : 'Générer le prompt'}
          </Button>

          <Fade in={!!generatedPrompt}>
            <Box>
              {generatedPrompt && (
                <Card elevation={3} sx={{ mt: 2, borderRadius: 3, maxWidth: 600, mx: 'auto', boxShadow: 4 }}>
                  <CardHeader
                    avatar={<SparklesIcon sx={{ color: 'primary.main' }} />}
                    title={<Typography variant="h6">Prompt généré</Typography>}
                    action={
                      <IconButton onClick={handleCopy} aria-label="Copier le prompt" sx={{ color: 'primary.main' }}>
                        <CopyIcon />
                      </IconButton>
                    }
                    sx={{ pb: 0, alignItems: 'center' }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        background: '#f7f7fa',
                        fontFamily: 'monospace',
                        p: 2,
                        borderRadius: 2,
                        maxHeight: 220,
                        overflow: 'auto',
                        fontSize: '1.1rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        boxShadow: 'none',
                        borderColor: 'divider',
                        color: 'text.primary',
                      }}
                    >
                      {generatedPrompt}
                    </Paper>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  )
} 