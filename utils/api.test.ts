import { fetchPhotos, DEFAULT_PAGE_LIMIT } from './api' // <-- adjust path

const mockFetchOk = (data: unknown, status = 200) => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    status,
    json: async () => data
  })
}

const mockFetchNotOk = (status: number) => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({})
  })
}

describe('api.fetchPhotos', () => {
  afterEach(() => {
    jest.resetAllMocks()
    ;(global as any).fetch = undefined
  })

  it('exports DEFAULT_PAGE_LIMIT = 8', () => {
    expect(DEFAULT_PAGE_LIMIT).toBe(8)
  })

  it('uses the default limit when not provided and returns parsed JSON', async () => {
    const data = [{ id: '1' }]
    mockFetchOk(data)

    const res = await fetchPhotos({ page: 2 })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://picsum.photos/v2/list?page=2&limit=8'
    )
    expect(res).toBe(data)
  })

  it('uses a custom limit when provided', async () => {
    const data = [{ id: 'x' }]
    mockFetchOk(data)

    const res = await fetchPhotos({ page: 5, limit: 12 })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://picsum.photos/v2/list?page=5&limit=12'
    )
    expect(res).toBe(data)
  })

  it('throws an error with status when the response is not ok', async () => {
    mockFetchNotOk(503)

    await expect(fetchPhotos({ page: 1 })).rejects.toMatchObject({
      message: 'HTTP 503',
      status: 503
    })
  })
})
