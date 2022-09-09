import clsx from 'clsx';
import { ReactNode } from 'react';



import styles from './SiteLayoutcontent.module.css'





interface SiteLayoutContentProps {
  className?: string
  children: ReactNode | ReactNode[]
}

const SiteLayoutContent = ({ children }: SiteLayoutContentProps) => {
  return <div className={clsx(styles.SiteLayoutContent)}>{children}</div>
}

export default SiteLayoutContent