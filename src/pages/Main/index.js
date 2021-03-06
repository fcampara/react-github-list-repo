import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../service/api'

import Container from '../../components/Container'

import { Form, SubmitButton, List } from './styles'

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false
  }

  componentDidMount () {
    const repositories = localStorage.getItem('repositories')

    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories)
      })
    }
  }

  componentDidUpdate (_, prevState) {
    const { repositories } = this.state
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const { newRepo, repositories } = this.state
    if (repositories.some(repo => repo.name === newRepo)) return false

    this.setState({ loading: true })
    api(`/repos/${newRepo}`).then(({ data }) => {
      const repositorie = {
        name: data.full_name
      }

      this.setState({
        repositories: [...repositories, repositorie],
        newRepo: ''
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })

  }

 render () {
   const { newRepo, loading, repositories } = this.state
   return (
     <Container>
       <h1>
         <FaGithubAlt />
         Repositórios
      </h1>
       <Form onSubmit={this.handleSubmit}>
         <input
           type="text"
           placeholder="Adicionar repositório"
           value={newRepo}
           onChange={this.handleInputChange}
         />

         <SubmitButton loading={loading ? 1 : 0}>
           { !loading ?
            <FaPlus color="#FFF" size={14} /> :
            <FaSpinner color="#FFF" size={14}/>
          }
         </SubmitButton>
       </Form>
       <List>
         {
           repositories.map((repository, index) => (
             <li key={index}>
               <span>{repository.name}</span>
               <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
             </li>
           ))
         }
       </List>
     </Container>
   )
 }
}

