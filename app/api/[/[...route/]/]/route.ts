import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createClient } from '@supabase/supabase-js'

const app = new Hono().basePath('/api')

export const runtime = 'edge'

// สร้าง Supabase Client สำหรับฝั่ง Server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 🛡️ Schema สำหรับตรวจสอบการบันทึกประวัติการดู
const watchHistorySchema = z.object({
  user_id: z.string().uuid(),
  movie_id: z.string().uuid(),
  episode_id: z.string().uuid().nullable().optional(),
  last_position: z.number().min(0),
  duration: z.number().min(0)
})

// 🚀 Route สำหรับบันทึกประวัติการดู (พร้อม Validation)
app.post(
  '/watch-history',
  zValidator('json', watchHistorySchema),
  async (c) => {
    const { user_id, movie_id, episode_id, last_position, duration } = c.req.valid('json')

    const { data, error } = await supabase
      .from('watch_history')
      .upsert({
        user_id,
        movie_id,
        episode_id: episode_id || null,
        last_position,
        duration,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,movie_id,episode_id' })
      .select()

    if (error) {
      return c.json({ success: false, error: error.message }, 400)
    }

    return c.json({ success: true, data })
  }
)

// สุ่มข้อความ Hello สำหรับทดสอบ
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono.js!',
    status: 'Ready with Zod Validation'
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
