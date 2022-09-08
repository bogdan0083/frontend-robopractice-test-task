import {Layout} from 'antd'

import AppHeader from './shared/components/AppHeader'
import Container from './shared/components/Container'
import UserSocialsView from './users/components/UserSocialsView'

const { Content } = Layout

const App = () => {
  return (
    <Layout>
      <AppHeader />
      <Content>
        <Container fluid={true}>
          <UserSocialsView />
        </Container>
      </Content>
    </Layout>
  )
}

export default App
