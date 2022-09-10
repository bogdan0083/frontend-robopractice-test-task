import { Grid, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'

import OverlayedError from '../../../shared/components/OverlayedError'
import { PreparedUser } from '../../../types'
import { ResizableHeadCell } from '../UserSocialsView/ResizableHeadCell'
import styles from './UserSocialsTable.module.less'

dayjs.extend(duration)

const { useBreakpoint } = Grid

interface UserSocialsTableProps {
  users?: PreparedUser[]
  loading?: boolean
  error?: Error
  pageSize: number
  columns: ColumnsType<PreparedUser>
  onPaginationChange?: (page: number, size: number) => void
}

const UserSocialsTable = ({
  users,
  loading = false,
  error,
  pageSize,
  onPaginationChange,
  columns,
}: UserSocialsTableProps) => {
  return (
    <OverlayedError error={error}>
      <Table
        dataSource={users}
        columns={columns}
        className={styles.UserSocialsTable}
        scroll={{ x: 2800 }}
        rowKey={'id'}
        components={{
          header: {
            cell: ResizableHeadCell,
          },
        }}
        pagination={{
          responsive: true,
          pageSize,
          onChange: onPaginationChange,
        }}
        size={'large'}
        loading={loading}
      />
    </OverlayedError>
  )
}

export default UserSocialsTable
