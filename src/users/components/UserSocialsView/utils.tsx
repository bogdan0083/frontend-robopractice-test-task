import { ColumnType, ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { Duration } from 'dayjs/plugin/duration'

import { PreparedUser, RawUser } from '../../../types'

const DEFAULT_TIME_FORMAT = 'HH-mm'

/*
 * Converts users from RawUser[] to PreparedUser[] type to
 * work with users more comfortably. Here's what it does:
 * Adds daysByDay object with days as keys and duration properties as values (formatted, in ms)
 * Adds monthly socials duration (formatted, in ms)
 * @param {Array<RawUser>} array of raw users
 * @return {Array<PreparedUser>} array of prepared users
 */
export const prepareUsers = (rawUsers: RawUser[]): PreparedUser[] => {
  return rawUsers.map(({ id, Fullname, Days }) => {
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
          acc[0] = acc[0].add(duration)
        }

        const parsedDay = dayjs(dayData.Date).date() as number

        acc[1][parsedDay] = {
          durationFormatted: duration.format('HH:mm'),
          durationInMs: duration.asMilliseconds(),
        }

        return acc
      },
      [null as Duration | null, {} as PreparedUser['daysByDay']],
    )

    const totalHours = monthlySocialsDuration
      ? Math.floor(monthlySocialsDuration.asHours())
      : '0'
    const monthlyDurationFormatted = `${totalHours}:${
      monthlySocialsDuration?.minutes() || '0'
    }`

    return {
      id,
      fullName: Fullname,
      daysByDay: daysByDay,
      monthlyDurationFormatted,
      monthlyDurationInMs: monthlySocialsDuration?.asMilliseconds() || 0,
    }
  })
}

export const filterUsersByQuery = (users: PreparedUser[], query: string) =>
  users.filter((u) => u.fullName.toLowerCase().includes(query))

export const prepareColumns = (
  daysInMonth: number,
): ColumnsType<PreparedUser> => {
  const titleColumn = {
    title: 'Users',
    key: 'fullName',
    dataIndex: 'fullName',
    fixed: 'left',
    width: 120,
    sortDirections: ['descend'],
    sorter: (a, b) => {
      return a.fullName.localeCompare(b.fullName)
    },
  } as ColumnType<PreparedUser>

  const monthlyColumns = {
    title: 'Monthly',
    key: 'monthly',
    dataIndex: 'monthlyDurationFormatted',
    fixed: 'right',
    width: 120,
    sorter: (a, b) => {
      return a.monthlyDurationInMs - b.monthlyDurationInMs
    },
  } as ColumnType<PreparedUser>

  const dayColumns = Array.from({ length: daysInMonth }, (v, day) => ({
    title: day + 1,
    key: day + 1,
    dataIndex: `day${day}`,
    width: 90,
    sorter: (a, b) => {
      const dayA = a.daysByDay[day + 1]
      const dayB = b.daysByDay[day + 1]
      const durationInMsA = dayA ? dayA.durationInMs : 0
      const durationInMsB = dayB ? dayB.durationInMs : 0
      return durationInMsA - durationInMsB
    },
    render: (a, { daysByDay }: PreparedUser) => {
      return (
        <>{daysByDay[day + 1] ? daysByDay[day + 1].durationFormatted : '0'}</>
      )
    },
  })) as ColumnsType<PreparedUser>
  return [titleColumn, ...dayColumns, monthlyColumns]
}
