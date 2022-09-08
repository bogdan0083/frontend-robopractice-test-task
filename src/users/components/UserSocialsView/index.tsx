import {Input, Space} from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import {useMemo, useState} from 'react'

import {PreparedUser} from '../../../types'
import useUsers from '../../hooks/useUsers'
import UserSocialsTable from '../UserSocialsTable'

dayjs.extend(customParseFormat)
dayjs.extend(duration)

const USERS_PER_PAGE = 12
const DEFAULT_TIME_FORMAT = 'HH-mm'

const UserSocialsView = () => {
  const [query, setQuery] = useState<string>('')
  const {users, error, isLoading} = useUsers()

  const preparedUsers = useMemo<PreparedUser>(() => {
    if (users) {
      return users.map(({id, Fullname, Days}) => {
        // @TODO: Add comments about function details
        const [monthlySocialsDuration, daysByDay] = Days.reduce(
          (acc, dayData) => {
            const startDate = dayjs(dayData.Start, DEFAULT_TIME_FORMAT)
            const endDate = dayjs(dayData.End, DEFAULT_TIME_FORMAT)
            const duration = dayjs.duration(endDate.diff(startDate))

            if (!acc[0]) {
              // fill the initial value with first duration
              acc[0] = duration
            } else {
              // accumulate all the durations to get monthly total
              // @TODO: just acc[0].add ?
              acc[0] = acc[0].add(duration)
            }

            const parsedDay = dayjs(dayData.Date).date()

            acc[1][parsedDay] = {
              durationFormatted: duration.format('HH:mm'),
              durationInMs: duration.asMilliseconds(),
            }

            return acc
          },
          [null, {}],
        )

        const totalHours = parseInt(monthlySocialsDuration.asHours())
        const monthlyDurationFormatted = `${totalHours}:${monthlySocialsDuration.minutes()}`

        return {
          id,
          Fullname,
          daysByDay: daysByDay,
          monthlyDurationFormatted,
          monthlyDurationInMs: monthlySocialsDuration.asMilliseconds(),
        }
      })
    }
    return undefined
  }, [users])

  const filteredAndPreparedUsers = useMemo(
    () => {
      if (preparedUsers && !!query) {
        return preparedUsers.filter((u) => u.Fullname.toLowerCase().includes(query))
      } else {
        return preparedUsers
      }
    },
    [query, preparedUsers]
  )

  console.log(filteredAndPreparedUsers)

  return (
    <>
      <Space direction={'vertical'}>
        <Input.Search
          size={'large'}
          placeholder={'Start typing...'}
          onSearch={(v) => setQuery(v.toLowerCase())}
          // @NOTE Ideally we would throttle onInput event to prevent updating data too often
          onInput={e => setQuery(e.target.value.toLowerCase())}
        />
        <UserSocialsTable users={filteredAndPreparedUsers}/>
      </Space>
    </>
  )
}

export default UserSocialsView
