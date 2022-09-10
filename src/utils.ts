import { Fetcher } from 'swr'

import { RawUser } from './types'

export const fetcher: Fetcher<RawUser> = (
  input: RequestInfo,
  init?: RequestInit,
) => fetch(input, init).then((res) => res.json())
