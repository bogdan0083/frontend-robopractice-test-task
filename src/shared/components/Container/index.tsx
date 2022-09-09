import clsx from 'clsx'
import { ReactNode } from 'react'

import styles from './Container.module.less'

interface ContainerProps {
  className?: string
  children: ReactNode | ReactNode[]
  fluid?: boolean
}

const Container = ({ className, fluid = false, children }: ContainerProps) => {
  return (
    <div
      className={clsx(
        className,
        styles.Container,
        fluid && styles.ContainerFluid,
      )}
    >
      {children}
    </div>
  )
}

export default Container