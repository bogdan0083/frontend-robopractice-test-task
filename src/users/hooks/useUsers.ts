import useSWR from 'swr'

import {RawUser} from '../../types'
import {fetcher} from '../../utils'

const USERS_API_URL = '/api/users'

type UseUsersResponse = {
  users: RawUser[]
  isLoading: boolean
  error: Error
  isError: boolean
}

// @TODO: I don't like error handling. Fix this
const useUsers = (): UseUsersResponse => {
  const { data, error } = useSWR(USERS_API_URL, fetcher)

  return {
    users: data?.status === 'error' ? undefined : data,
    isLoading: !error && !data,
    error: data?.status === 'error' ? new Error(data.message) : error,
    isError: error,
  }
}

export default useUsers
