import axios from 'axios'

const BASE_URL = 'http://localhost:8000'
const TOKEN_KEY = 'cv_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (!token) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, token)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function pickRisk(score) {
  if (score >= 70) return 'High'
  if (score >= 35) return 'Moderate'
  return 'Safe'
}

function riskMeta(risk) {
  switch (risk) {
    case 'High':
      return { label: 'High Risk', tone: 'danger' }
    case 'Moderate':
      return { label: 'Moderate', tone: 'warn' }
    default:
      return { label: 'Safe', tone: 'safe' }
  }
}

function lsJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function setLsJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const MOCK_DB_KEY = 'cv_mock_db'

function getMockDb() {
  return lsJson(MOCK_DB_KEY, {
    users: [{ id: 'u_demo', email: 'demo@clearaller.ai', password: 'demo123' }],
    profiles: [
      {
        id: 'p1',
        name: 'Me',
        allergies: ['milk', 'peanut'],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      },
      {
        id: 'p2',
        name: 'Mom',
        allergies: ['gluten'],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
    ],
  })
}

function saveMockDb(db) {
  setLsJson(MOCK_DB_KEY, db)
}

const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Dairy Milk Chocolate',
    ingredients:
      'Sugar, milk solids, cocoa butter, cocoa mass, emulsifiers (soy lecithin), flavours',
  },
  {
    id: 'prod_2',
    name: 'Dark Chocolate 70%',
    ingredients: 'Cocoa mass, sugar, cocoa butter, emulsifier (sunflower lecithin)',
  },
  {
    id: 'prod_3',
    name: 'Protein Bar - Peanut',
    ingredients:
      'Peanuts, whey protein concentrate (milk), oats (gluten), cocoa, natural flavours',
  },
  {
    id: 'prod_4',
    name: 'Oat Cookies',
    ingredients: 'Wheat flour (gluten), oats, sugar, palm oil, raising agents, salt',
  },
  {
    id: 'prod_5',
    name: 'Almond Milk Unsweetened',
    ingredients: 'Water, almonds, calcium carbonate, sea salt, stabilizers',
  },
]

function normalizeAllergen(a) {
  return String(a || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
}

function scoreMatch(query, name) {
  const q = tokenize(query)
  const n = tokenize(name)
  if (!q.length) return 0
  const set = new Set(n)
  let hits = 0
  for (const t of q) if (set.has(t)) hits += 1
  const raw = (hits / q.length) * 100
  return clamp(Math.round(raw), 0, 100)
}

function buildSearchResults(q) {
  const enriched = MOCK_PRODUCTS.map((p) => {
    const score = scoreMatch(q, p.name)
    const seeded = (hashString(q + '::' + p.id) % 35) - 10
    const finalScore = clamp(score + seeded, 0, 100)
    const risk = pickRisk(finalScore)
    return {
      id: p.id,
      name: p.name,
      risk,
      score: finalScore,
      ingredients_preview: p.ingredients.split(',').slice(0, 3).join(', ') + '…',
    }
  })
    .filter((r) => r.score > 15)
    .sort((a, b) => b.score - a.score)

  return enriched.slice(0, 3)
}

function analyzeFromProduct(product, userAllergies = []) {
  const ingredientsRaw = product.ingredients
  const ingredients = ingredientsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const normalized = ingredients.map((i) => i.toLowerCase())
  const allergies = userAllergies.map(normalizeAllergen)

  const detected = []
  for (const a of allergies) {
    const hit = normalized.some((ing) => ing.includes(a))
    if (hit) detected.push(a)
  }

  const seed = hashString(product.name + '::' + detected.join('|'))
  const base = (seed % 101) | 0
  const bump = detected.length ? 35 + detected.length * 10 : -10
  const riskScore = clamp(base + bump, 0, 100)
  const risk = pickRisk(riskScore)

  const safer = MOCK_PRODUCTS.filter((p) => p.id !== product.id)
    .map((p) => {
      const score = clamp((hashString(p.id + '::safer') % 60) + 10, 0, 100)
      return { id: p.id, name: p.name, risk: pickRisk(score), score }
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  return {
    product: { id: product.id, name: product.name },
    ingredients,
    normalized_ingredients: normalized,
    detected_allergens: detected,
    risk_score: riskScore,
    risk_level: risk,
    suggestions: [
      risk === 'High'
        ? 'Avoid this product for your selected profile.'
        : 'Looks generally safe, but double-check cross-contamination warnings.',
      detected.length ? `Detected: ${detected.join(', ')}.` : 'No direct allergen match detected.',
    ],
    similar_safer_products: safer,
    confidence: clamp(55 + (hashString(product.id) % 40), 50, 95),
    meta: riskMeta(risk),
  }
}

function buildChatReply(message, allergies = []) {
  const m = String(message || '').toLowerCase()
  const a = allergies.map(normalizeAllergen)

  if (m.includes('arachis') || m.includes('arachis oil')) {
    return 'Arachis oil is peanut oil. If you have a peanut allergy, it is generally unsafe unless highly refined and confirmed safe by your clinician.'
  }
  if (m.includes('list') && (m.includes('allergen') || m.includes('allergy'))) {
    return a.length ? `Your saved allergens: ${a.join(', ')}.` : 'You have no saved allergens yet.'
  }
  if (m.includes('peanut-free') || m.includes('peanut free')) {
    return 'For peanut-free options, look for products labeled “peanut-free” and processed in peanut-free facilities. I can also suggest alternatives if you tell me what you’re craving (snack, dessert, meal).'
  }
  if (m.includes('safe')) {
    return 'I can help evaluate safety. Share the ingredient list (or scan/upload), and tell me which profile you’re checking for.'
  }
  return 'Got it. Ask me about ingredients, allergens, or request safer alternatives. You can also use the quick buttons below.'
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const enableMock = import.meta.env.VITE_MOCK_API !== 'false'
const baseAdapter = api.defaults.adapter

api.defaults.adapter = async (config) => {
  if (!enableMock) return baseAdapter(config)

  const method = String(config.method || 'get').toLowerCase()
  const url = String(config.url || '')
  const delayMs = 900 + (hashString(method + url) % 700)

  const respond = async (status, data) => {
    await sleep(delayMs)
    return {
      data,
      status,
      statusText: String(status),
      headers: {},
      config,
      request: {},
    }
  }

  const body = (() => {
    try {
      if (!config.data) return {}
      return typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    } catch {
      return {}
    }
  })()

  if (method === 'post' && url === '/auth/register') {
    const db = getMockDb()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (!email || password.length < 4) return respond(400, { message: 'Invalid email or password.' })
    const exists = db.users.some((u) => u.email === email)
    if (exists) return respond(409, { message: 'User already exists.' })
    const user = { id: `u_${Date.now()}`, email, password }
    db.users.push(user)
    saveMockDb(db)
    const token = `mock.${hashString(email)}.${Date.now()}`
    return respond(200, { token, user: { id: user.id, email: user.email } })
  }

  if (method === 'post' && url === '/auth/login') {
    const db = getMockDb()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const user = db.users.find((u) => u.email === email && u.password === password)
    if (!user) return respond(401, { message: 'Invalid credentials.' })
    const token = `mock.${hashString(email)}.${Date.now()}`
    return respond(200, { token, user: { id: user.id, email: user.email } })
  }

  if (method === 'get' && url === '/profiles') {
    const db = getMockDb()
    return respond(200, { profiles: db.profiles })
  }

  if (method === 'post' && url === '/profiles') {
    const db = getMockDb()
    const name = String(body.name || '').trim()
    if (!name) return respond(400, { message: 'Profile name is required.' })
    const profile = {
      id: `p_${Date.now()}`,
      name,
      allergies: [],
      createdAt: Date.now(),
    }
    db.profiles.unshift(profile)
    saveMockDb(db)
    return respond(200, { profile })
  }

  const allergyMatch = url.match(/^\/profiles\/([^/]+)\/allergies$/)
  if (method === 'post' && allergyMatch) {
    const db = getMockDb()
    const id = allergyMatch[1]
    const profile = db.profiles.find((p) => p.id === id)
    if (!profile) return respond(404, { message: 'Profile not found.' })
    const allergies = Array.isArray(body.allergies) ? body.allergies : []
    profile.allergies = allergies.map(normalizeAllergen).filter(Boolean)
    saveMockDb(db)
    return respond(200, { profile })
  }

  if (method === 'get' && url.startsWith('/product/search')) {
    const q = String((config.params && config.params.q) || '')
    const results = buildSearchResults(q)
    return respond(200, { results })
  }

  if (method === 'post' && url === '/scan/barcode') {
    const barcode = String(body.barcode || '')
    const idx = hashString(barcode) % MOCK_PRODUCTS.length
    const product = MOCK_PRODUCTS[idx]
    return respond(200, { product })
  }

  if (method === 'post' && url === '/scan/image') {
    const idx = hashString('image' + Date.now()) % MOCK_PRODUCTS.length
    const product = MOCK_PRODUCTS[idx]
    return respond(200, { product })
  }

  if (method === 'post' && url === '/analysis') {
    const productId = String(body.product_id || body.productId || '')
    const productName = String(body.product_name || body.productName || '')
    const ingredientText = String(body.ingredients_text || body.ingredientsText || '')
    const allergies = Array.isArray(body.user_allergies) ? body.user_allergies : []

    const product =
      MOCK_PRODUCTS.find((p) => p.id === productId) ||
      (productName
        ? { id: productId || `prod_custom_${Date.now()}`, name: productName, ingredients: ingredientText }
        : MOCK_PRODUCTS[0])

    const analysis = analyzeFromProduct(product, allergies)
    return respond(200, analysis)
  }

  if (method === 'post' && url === '/chat') {
    const msg = String(body.message || '')
    const allergies = Array.isArray(body.user_allergies) ? body.user_allergies : []
    const reply = buildChatReply(msg, allergies)
    return respond(200, { reply })
  }

  return baseAdapter(config)
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function getProfiles() {
  const { data } = await api.get('/profiles')
  return data
}

export async function createProfile(payload) {
  const { data } = await api.post('/profiles', payload)
  return data
}

export async function setProfileAllergies(profileId, payload) {
  const { data } = await api.post(`/profiles/${profileId}/allergies`, payload)
  return data
}

export async function searchProducts(q) {
  const { data } = await api.get('/product/search', { params: { q } })
  return data
}

export async function scanBarcode(barcode) {
  const { data } = await api.post('/scan/barcode', { barcode })
  return data
}

export async function scanImage(formData) {
  const { data } = await api.post('/scan/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function analyzeProduct(payload) {
  const { data } = await api.post('/analysis', payload)
  return data
}

export async function chatWithBot(payload) {
  const { data } = await api.post('/chat', payload)
  return data
}

