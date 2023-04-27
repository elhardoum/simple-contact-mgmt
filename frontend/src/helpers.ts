export const apiurl = (path: string): string => {
  // some webpack magic which ts wouldn't recognize
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const base = process.env.API_BASE_URL || '/api'
  return `${base}/${path}`.replace(/([^:])\/{2,}/g, '$1/')
}

export const assertJson2xx = (res: Response) => {
  if (!String(res.status).startsWith('2')) {
    throw new Error(`non 2xx response (${res.statusText})`)
  }

  return res.json()
}
