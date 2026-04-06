import { Send, Sparkles, ShieldCheck, ListChecks, Wand2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ChatBubble } from '../components/ChatBubble'
import { Input } from '../components/Input'
import { useProfiles } from '../context/ProfileContext'
import { chatWithBot } from '../services/api'

const STORAGE_KEY = 'cv_chat_history'

function lsLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function lsSave(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export default function Chatbot() {
  const { selected } = useProfiles()
  const allergies = useMemo(() => selected?.allergies || [], [selected?.allergies])
  const loc = useLocation()

  const [messages, setMessages] = useState(() => {
    const saved = lsLoad()
    if (Array.isArray(saved) && saved.length) return saved
    return [
      {
        id: makeId(),
        role: 'bot',
        text: 'Hi — I’m AllerGuard. Ask me about ingredients, allergens, or safer alternatives.',
      },
    ]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    lsSave(messages.slice(-60))
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  useEffect(() => {
    const seed = loc.state?.seed
    if (seed) setInput(seed)
  }, [loc.state])

  async function send(text) {
    const msg = String(text || '').trim()
    if (!msg || typing) return

    const userMsg = { id: makeId(), role: 'user', text: msg }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const data = await chatWithBot({ message: msg, user_allergies: allergies })
      const botMsg = { id: makeId(), role: 'bot', text: data.reply }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Chat failed.')
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'bot', text: 'Sorry — I had trouble responding. Try again.' },
      ])
    } finally {
      setTyping(false)
    }
  }

  function quickSafety() {
    try {
      const raw = localStorage.getItem('cv_last_analysis')
      const a = raw ? JSON.parse(raw) : null
      if (!a?.product?.name) return toast.error('No recent analysis found. Scan/search a product first.')
      send(`Is ${a.product.name} safe for ${selected?.name || 'me'}?`)
    } catch {
      toast.error('No recent analysis found.')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-ocean-300" />
              AllerGuard AI Chat
            </div>
            <div className="mt-1 text-xs text-ink-2">
              Profile: <span className="font-semibold text-ink-1">{selected?.name || '—'}</span>
              {allergies.length ? ` • Allergies: ${allergies.join(', ')}` : ' • No allergies saved'}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setMessages([
                {
                  id: makeId(),
                  role: 'bot',
                  text: 'Chat cleared. Ask me anything about allergens and ingredients.',
                },
              ])
              toast.success('Chat cleared.')
            }}
          >
            Clear
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="secondary" size="sm" className="justify-start" onClick={quickSafety}>
            <ShieldCheck className="h-4 w-4" />
            Safety
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="justify-start"
            onClick={() => send('List my allergens.')}
          >
            <ListChecks className="h-4 w-4" />
            Allergens
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="justify-start"
            onClick={() => send('Suggest peanut-free foods.')}
          >
            <Wand2 className="h-4 w-4" />
            Ideas
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="h-[52vh] overflow-y-auto pr-1 space-y-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role} text={m.text} />
          ))}
          {typing ? <ChatBubble role="bot" isTyping /> : null}
          <div ref={endRef} />
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <Input
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ingredients, allergens, alternatives…"
          />
          <Button size="icon" type="submit" disabled={!input.trim() || typing}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </Card>
    </div>
  )
}

