import { HTMLAttributes, SyntheticEvent } from 'react'
import { Resizable, ResizeCallbackData, ResizeHandle } from 'react-resizable'

import styles from '../UserSocialsTable/UserSocialsTable.module.less'





export const ResizableHeadCell = (
  props: HTMLAttributes<any> & {
    onResize: (e: SyntheticEvent, data: ResizeCallbackData) => void
    width: number
    dataIndex: string
  },
) => {
  const { onResize, dataIndex, width, ...restProps } = props

  if (!width) {
    return <th {...restProps} />
  }

  const resizeHandlers: ResizeHandle[] = dataIndex?.includes(
    'monthly',
  )
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
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}