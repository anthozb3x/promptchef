import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  List, ListItem, ListItemText, Box, Typography, IconButton, Tooltip, InputBase, Divider
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SearchIcon from '@mui/icons-material/Search'
import toast from 'react-hot-toast'

type Prompt = {
  id: string
  use_case: string
  input_prompt: string
  generated_prompt: string
  created_at: string
  // add other fields as needed
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function PromptSearchHistorySidebar({ historyRefreshKey }: { historyRefreshKey?: number }) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchPrompts() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error && data) setPrompts(data)
    }
    fetchPrompts()
  }, [historyRefreshKey])

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast.success('Prompt copié dans le presse-papier !')
  }

  const filteredPrompts = prompts.filter(
    (p) =>
      p.use_case.toLowerCase().includes(search.toLowerCase()) ||
      p.input_prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.generated_prompt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{
      width: 320,
      bgcolor: 'background.paper',
      height: '100vh',
      borderRight: '1px solid #eee',
      p: 0,
      pt: 0,
      boxSizing: 'border-box',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1200,
      display: { xs: 'none', md: 'block' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>Historique</Typography>
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 1, px: 1 }}>
          <SearchIcon fontSize="small" sx={{ color: 'grey.500', mr: 1 }} />
          <InputBase
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 110px)' }}>
        <List dense>
          {filteredPrompts.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Aucun prompt trouvé.
            </Typography>
          )}
          {filteredPrompts.map((prompt) => (
            <ListItem
              key={prompt.id}
              alignItems="flex-start"
              sx={{ py: 1, px: 1.5, minHeight: 56 }}
              secondaryAction={
                <Tooltip title="Copier le prompt généré">
                  <IconButton edge="end" onClick={() => handleCopy(prompt.generated_prompt)} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {prompt.use_case}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(prompt.created_at)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 0.5 }}>
                      {prompt.input_prompt.slice(0, 40) + (prompt.input_prompt.length > 40 ? '...' : '')}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: 13 }}>
                      {prompt.generated_prompt.slice(0, 60) + (prompt.generated_prompt.length > 60 ? '...' : '')}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
} 