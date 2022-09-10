import { Grid, Input } from 'antd'
import { ColumnType, ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ResizeCallbackData } from 'react-resizable'

import { PreparedUser } from '../../../types'
import useUsers from '../../hooks/useUsers'
import UserSocialsTable from '../UserSocialsTable'
import styles from './UserSocialsView.module.css'
import { filterUsersByQuery, prepareColumns, prepareUsers } from './utils'





dayjs.extend(customParseFormat)
dayjs.extend(duration)

const { useBreakpoint } = Grid

const USERS_PER_PAGE = 12

const UserSocialsView = () => {
  const [daysInMonth, setDaysInMonth] = useState<number | undefined>(undefined)
  const [pageSize, setPageSize] = useState(USERS_PER_PAGE)
  const [query, setQuery] = useState<string>('')
  const [columns, setColumns] = useState<ColumnsType<PreparedUser>>([])
  const { users, error, isLoading } = useUsers()

  const preparedUsers = useMemo<PreparedUser[] | undefined>(
    () => (users ? prepareUsers(users) : undefined),
    [users],
  )

  // calculate days in month based on user date
  useEffect(() => {
    if (users) {
      const daysInMonth1 = dayjs(users[0].Days[0].Date).daysInMonth()
      setDaysInMonth(daysInMonth1)
    }
  }, [users])

  const filteredAndPreparedUsers = useMemo(
    () =>
      preparedUsers && !!query // if users are prepared and query is not empty
        ? filterUsersByQuery(preparedUsers, query)
        : preparedUsers,
    [query, preparedUsers],
  )

  const handlePaginationChange = useCallback(
    (page: number, size: number) => {
      if (size !== pageSize) {
        setPageSize(size)
      }
    },
    [pageSize],
  )

  useEffect(
    () => (daysInMonth ? setColumns(prepareColumns(daysInMonth)) : undefined),
    [daysInMonth],
  )

  const screens = useBreakpoint()

  useEffect(() => {
    if (screens.xs) {
      setColumns((prev) =>
        prev.map((c) => {
          if (c.key === 'monthly') {
            c.fixed = false
          }
          return c
        }),
      )
    }
  }, [screens, columns])

  const handleResize =
    (index: number) =>
    (_: SyntheticEvent, { size }: ResizeCallbackData) => {
      setColumns((prevColumns) => {
        return prevColumns.map((c, idx) => {
          if (idx === index) {
            return {...c, width: size.width}
          } else {
            return c
          }
        })
      })
    }

  const mergedColumns: ColumnsType<PreparedUser> = columns.map(
    (col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: (column as ColumnType<PreparedUser>).width,
        dataIndex: (column as ColumnType<PreparedUser>).dataIndex,
        onResize: handleResize(index),
      }),
    }),
  )

  const usersLoaded = useMemo(
    () => preparedUsers && !isLoading && (mergedColumns.length > 0),
    [preparedUsers, isLoading, mergedColumns],
  )

  return (
    <div className={styles.UserSocialsView} data-testid={'UserSocialsView'}>
      <Input.Search
        size={'large'}
        placeholder={'Start typing...'}
        onSearch={(v) => setQuery(v.toLowerCase())}
        // @NOTE Ideally we would throttle onInput event to prevent updating data too often
        onInput={(e) => setQuery(e.currentTarget.value.toLowerCase())}
        data-testid={'SearchInput'}
      />
      <UserSocialsTable
        users={filteredAndPreparedUsers}
        loading={!usersLoaded}
        error={error}
        pageSize={pageSize}
        onPaginationChange={handlePaginationChange}
        columns={mergedColumns}
      />
    </div>
  )
}

export default UserSocialsView