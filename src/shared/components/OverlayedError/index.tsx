import { Alert } from 'antd'
import { ReactNode } from 'react'

import styles from './OverlayedError.module.css'

interface OverlayedErrorProps<T> {
  error?: T
  children: ReactNode | ReactNode[]
}

export default function OverlayedError<T extends Error>({
  error,
  children,
}: OverlayedErrorProps<T>) {
  return (
    <div className={styles.OverlayedError}>
      {error && (
        <div className={styles.OverlayedErrorContent}>
          <Alert
            type={'error'}
            message={'Whoops! Error happened'}
            description={error.message}
          />
        </div>
      )}
      {children}
    </div>
  )
}
