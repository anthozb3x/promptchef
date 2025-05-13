import { NextRequest, NextResponse } from 'next/server'
import { PromptService, PromptRequest } from '@/lib/PromptService'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { useCase, input_prompt, userId, category, style } = body

    // Récupère le JWT de l'utilisateur connecté
    const authHeader = req.headers.get('authorization')
    const jwt = authHeader?.replace('Bearer ', '')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    )

    const promptService = new PromptService()
    const generated_prompt = await promptService.generatePrompt({
      useCase,
      context: input_prompt,
      preferences: { category, style }
    } as PromptRequest)

    // Insère dans la table prompts
    const { error } = await supabase.from('prompts').insert([{
      user_id: userId,
      use_case: useCase,
      input_prompt,
      generated_prompt,
      category,
      style
    }])

    if (error) throw error

    return NextResponse.json({ prompt: generated_prompt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 