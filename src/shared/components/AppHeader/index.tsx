import {Typography, TypographyProps} from 'antd'

import Container from '../Container'
import styles from './AppHeader.module.css'

const { Title } = Typography as TypographyProps

const AppHeader = () => {
  return (
    <Container>
      <header className={styles.AppHeader}>
        <Title style={{ marginBottom: 0 }}>
          RedMadRobot Frontend Challenge
        </Title>
      </header>
    </Container>
  )
}

export default AppHeader
