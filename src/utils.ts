import { Fetcher } from 'swr'

import { RawUser } from './types'





export const fetcher: Fetcher<RawUser[]> = async (
  input: RequestInfo,
  init?: RequestInit,
) => {
  const res = await fetch(input, init)

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.message)
  }

  return res.json()
}