import { Typography, TypographyProps } from 'antd'

import Container from '../Container'
import styles from './AppHeader.module.less'

const { Title } = Typography as TypographyProps

const AppHeader = () => {
  return (
    <Container>
      <header className={styles.AppHeader}>
        <h1 style={{ marginBottom: 0 }} className={styles.Title}>
          RedMadRobot Frontend Challenge
        </h1>
      </header>
    </Container>
  )
}

export default AppHeader
