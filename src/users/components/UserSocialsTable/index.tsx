import {Grid, Table} from 'antd'
import {SizeType} from 'antd/lib/config-provider/SizeContext'
import {ColumnsType, ColumnType} from 'antd/lib/table'
import dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import {HTMLAttributes, SyntheticEvent, useCallback, useEffect, useState,} from 'react'
import {Resizable, ResizeCallbackData} from 'react-resizable'

import OverlayedError from '../../../shared/components/OverlayedError'
import {PreparedUser} from '../../../types'
import styles from './UserSocialsTable.module.css'

dayjs.extend(duration)

const {useBreakpoint} = Grid

interface UserSocialsTableProps {
  users: PreparedUser[]
  loading?: boolean
  error?: Error
}

// @TODO: calculate based on user days
const DAYS_IN_MONTH = 31

const ResizableTitle = (
  props: HTMLAttributes<any> & {
    onResize: (e: SyntheticEvent<Element>, data: ResizeCallbackData) => void
    width: number
  },
) => {
  const {onResize, width, ...restProps} = props

  if (!width) {
    return <th {...restProps} />
  }

  const resizeHandlers = restProps['aria-label']?.includes('Monthly')
    ? ['w']
    : ['e']

  return (
    <Resizable
      width={width}
      height={0}
      className={styles.Resizable}
      minConstraints={[80, 100]}
      resizeHandles={resizeHandlers}
      handle={
        <span
          className={styles.ResizableHandle}
          onClick={(e) => {
            e.stopPropagation()
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{enableUserSelectHack: false}}
    >
      <th {...restProps} />
    </Resizable>
  )
}

const UserSocialsTable = ({
                            users,
                            loading = false,
                            error,
                          }: UserSocialsTableProps) => {
  const [pageSize, setPageSize] = useState(12)
  const [tableSize, setTableSize] = useState<SizeType>('large')
  const [columns, setColumns] = useState<ColumnsType<RecordType>>(() => {
    {
      const titleColumn = {
        title: 'Users',
        key: 'Fullname',
        dataIndex: 'Fullname',
        fixed: 'left',
        width: tableSize === 'small' ? 80 : 120,
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
        width: tableSize === 'small' ? 80 : 120,
        sorter: (a, b) => {
          return a.monthlyDurationInMs - b.monthlyDurationInMs
        },
      }

      const dayColumns = Array.from({length: DAYS_IN_MONTH}, (v, day) => ({
        title: day + 1,
        key: day + 1,
        dataIndex: `day${day}`,
        width: tableSize === 'small' ? 70 : 90,
        sorter: (a, b) => {
          const dayA = a.daysByDay[day + 1]
          const dayB = b.daysByDay[day + 1]
          const durationInMsA = dayA ? dayA.durationInMs : 0
          const durationInMsB = dayB ? dayB.durationInMs : 0
          return durationInMsA - durationInMsB
        },
        render: (a, {daysByDay}: PreparedUser) => {
          return (
            <>
              {daysByDay[day + 1] ? daysByDay[day + 1].durationFormatted : '0'}
            </>
          )
        },
      }))
      return [titleColumn, ...dayColumns, monthlyColumns]
    }
  })

  const screens = useBreakpoint()

  useEffect(() => {
    if (screens.xs) {
      setTableSize('small')
      // @TODO: make it pretty
      setColumns((prev) =>
        prev.map((c) => {
          if (c.key === 'Fullname') {
            c.width = 68
          } else if (c.key === 'monthly') {
            c.width = 70
            c.fixed = false
          } else {
            c.width = 50
          }
          return c
        }),
      )
    } else {
      setTableSize('large')
    }
  }, [screens])

  const handleResize =
    (index: number) =>
      (_: SyntheticEvent<Element>, {size}: ResizeCallbackData) => {
        const newColumns = [...columns]
        newColumns[index] = {
          ...newColumns[index],
          width: size.width,
        }
        setColumns(newColumns)
      }

  const mergeColumns: ColumnsType<DataType> = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: (column as ColumnType<DataType>).width,
      onResize: handleResize(index),
    }),
  }))

  const handlePaginationChange = useCallback((page, size) => {
    if (size !== pageSize) {
      setPageSize(size)
    }
  }, [])

  return (
    <OverlayedError error={error}>
      <Table
        dataSource={users}
        columns={mergeColumns}
        className={styles.UserSocialsTable}
        scroll={{x: 2800}}
        rowKey={'id'}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        pagination={{
          responsive: true,
          pageSize,
          onChange: handlePaginationChange,
        }}
        size={tableSize}
        loading={loading}
      />
    </OverlayedError>
  )
}

export default UserSocialsTable
