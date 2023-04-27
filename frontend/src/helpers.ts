export const assertJson2xx = (res: Response) => {
  if (!String(res.status).startsWith('2')) {
    throw new Error(`non 2xx response (${res.statusText})`)
  }

  return res.json()
}
