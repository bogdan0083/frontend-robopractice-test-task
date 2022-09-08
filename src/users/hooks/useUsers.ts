import useSWR from 'swr'

import {RawUser} from '../../types'
import {fetcher} from '../../utils'

const USERS_API_URL = import.meta.env.VITE_BASE_API_URL + '/api/users'

type UseUsersResponse = {
  users: RawUser[]
  isLoading: boolean
  error: Error
  isError: boolean
}

const useUsers = (): UseUsersResponse => {
  const { data, error } = useSWR(USERS_API_URL, fetcher)

  return {
    users: data,
    isLoading: !error && !data,
    error,
    isError: error,
  }
}

export default useUsers
