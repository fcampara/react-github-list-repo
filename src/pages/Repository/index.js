import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from '../../service/api'

import { FaSpinner } from 'react-icons/fa'
import { Loading, Owner, IssuesList } from './styles'

import Container from '../../components/Container'
export default class Repository extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired
  }

  state = {
    repository: {},
    issues: [],
    loading: true
  }

  async componentDidMount () {
    const { match } = this.props

    const repoName = decodeURIComponent(match.params.repository)

    console.log(repoName)
    Promise.all([
      api(`repos/${repoName}`),
      api(`repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5
        }
      })
    ]).then(([{ data: repository }, { data: issues }]) => {
      this.setState({ repository, issues })
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { repository, issues, loading } = this.state

    if (loading) {
      return (
        <Loading loading={loading ? 1 : 0}>
          <div>Carregando...</div>
          <div> <FaSpinner fontSize={'3rem'} /> </div>
        </Loading>
      )
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar ao repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssuesList>
          {
            issues.map((issue, index) => (
              <li key={index}>
                <img src={issue.user.avatar_url} alt={issue.user.login}/>
                <div>
                  <strong>
                    <a href={issue.html_url}>{issue.title}</a>
                    {
                      issue.labels.map((label, indexLabel) => (
                        <span key={`${index}-${indexLabel}`}>{label.name}</span>
                      ))
                    }
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))
          }
        </IssuesList>
      </Container>
    )
  }
}
