import {Table} from 'antd'
import dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import {useMemo} from 'react'

import {PreparedUser} from '../../../types'

dayjs.extend(duration)

interface UserSocialsTableProps {
  users: PreparedUser[]
  query: string
}

// @TODO: calculate based on user days
const DAYS_IN_MONTH = 31

const UserSocialsTable = ({ users }: UserSocialsTableProps) => {
  const columns = useMemo(() => {
    const titleColumn = {
      title: 'Users',
      key: 'Fullname',
      dataIndex: 'Fullname',
      fixed: 'left',
      width: 120,
      sortDirections: ['descend'],
      sorter: (a, b) => {
        return a.Fullname.localeCompare(b.Fullname)
      },
    }

    const monthlyColumns = {
      title: 'Monthly',
      key: 'monthly',
      dataIndex: 'monthlyDurationFormatted',
      fixed: 'right',
      width: 120,
      sorter: (a, b) => {
        return a.monthlyDurationInMs - b.monthlyDurationInMs
      },
    }

    const dayColumns = Array.from({ length: DAYS_IN_MONTH }, (v, day) => ({
      title: day + 1,
      key: day + 1,
      dataIndex: `day${day}`,
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
    }))

    return [titleColumn, ...dayColumns, monthlyColumns]
  }, [])

  return (
    <>
      <Table
        dataSource={users}
        columns={columns}
        scroll={{ x: '200%' }}
        rowKey={'id'}
        pagination={{ pageSize: 12 }}
      />
    </>
  )
}

export default UserSocialsTable
