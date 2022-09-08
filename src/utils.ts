import {Fetcher} from 'swr'

import {UserSocialData} from './types'

export const fetcher: Fetcher<UserSocialData> = (
  input: RequestInfo,
  init?: RequestInit,
) => fetch(input, init).then((res) => res.json())
