export const apiurl = (path: string) : string => {
  // @ts-ignore
  const base = process.env.API_BASE_URL || '/api'
  return `${base}/${path}`.replace(/\/{2,}/g, '/')
}

export const assertJson2xx = (res: Response) => {
  if (!String(res.status).startsWith('2')) {
    throw new Error(`non 2xx response (${res.statusText})`)
  }

  return res.json()
}
