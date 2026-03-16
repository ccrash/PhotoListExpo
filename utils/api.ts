export const DEFAULT_PAGE_LIMIT = 8
const API_BASE = 'https://picsum.photos/v2'

type HttpError = Error & { status?: number }

async function fetchJson(url: string) {
  const resp = await fetch(url)
  if (!resp.ok) {
    const err = new Error(`HTTP ${resp.status}`) as HttpError
    err.status = resp.status
    throw err
  }
  return await resp.json()
}

export async function fetchPhotos(params: { page: number; limit?: number }) {
  const { page, limit = DEFAULT_PAGE_LIMIT } = params
  const url = `${API_BASE}/list?page=${page}&limit=${limit}`
  return fetchJson(url)
}
