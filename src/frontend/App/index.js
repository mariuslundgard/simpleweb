// @flow @jsx h

import { Component, h } from 'preact'
import { parse as parseQuery, stringify as stringifyQuery } from 'qs'
import { matchRoute } from '../routes'

import Footer from '../components/Footer'
import Nav from '../components/Nav'

type Props = {
  data: any,
  errors: any,
  Screen: any,
  baseUrl: string,
  mode: 'browser' | 'server',
  params: any,
  query: any,

  importScreenModule: Function
}

type State = {
  data: any,
  errors: any,
  params: any,
  query: any,
  Screen: any,
  isLoadingScreen: boolean
}

class Root extends Component<Props, State> {
  screen: any

  constructor (props: Props) {
    super()
    this.state = {
      isLoadingScreen: false,
      Screen: props.Screen,
      data: props.data,
      errors: props.errors,
      params: props.params,
      query: props.query
    }
  }

  componentDidMount () {
    window.addEventListener('popstate', this.handlePopstate)
  }

  componentWillUnmount () {
    window.removeEventListener('popstate', this.handlePopstate)
  }

  getChildContext () {
    return {
      baseUrl: this.props.baseUrl,
      onLinkClick: (evt: any) => {
        evt.preventDefault()

        const target = evt.target.closest('a')
        const query = parseQuery(target.search.substr(1))

        if (this.state.query.up !== undefined) {
          query.up = 'true'
        }

        const queryString = stringifyQuery(query)

        window.history.pushState(
          null,
          null,
          target.pathname + (queryString ? `?${queryString}` : '')
        )

        this.handleNavigate(target.pathname, query)
      }
    }
  }

  handleNavigate (pathname: string, query: any) {
    const route = matchRoute(pathname)

    this.setState({ isLoadingScreen: true })

    this.props.importScreenModule(route.name).then(mod => {
      const Screen = mod.default

      if (Screen.query) {
        this.setState({
          data: null,
          errors: null,
          params: route.params,
          query,
          Screen
        })

        fetch(`/api/graphql?query=${Screen.query(route.params, query)}`)
          .then(res => res.json())
          .then(state =>
            this.setState({
              ...state,
              isLoadingScreen: false
            })
          )
      } else {
        this.setState({
          data: null,
          errors: null,
          params: route.params,
          query,
          isLoadingScreen: false,
          Screen
        })
      }
    })
  }

  handlePopstate = () => {
    const query = parseQuery(window.location.search.substr(1))

    this.handleNavigate(window.location.pathname, query)
  }

  render () {
    const { mode } = this.props
    const { data, errors, params, query, isLoadingScreen, Screen } = this.state
    const className = `ml-app ml-app--is-${mode}${
      isLoadingScreen ? ' ml-app--is-loading-screen' : ''
    }`

    return (
      <div class={className}>
        <Nav />
        <Screen data={data} errors={errors} params={params} query={query} />
        <Footer />
      </div>
    )
  }
}

export default Root
