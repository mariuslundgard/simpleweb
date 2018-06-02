// @flow

type Route = {
  name: 'home' | 'blog' | 'article' | 'project' | null,
  params: any
}

export function matchRoute (pathname: string): Route {
  const parts = pathname.split('/')

  switch (true) {
    case pathname === '/':
      return { name: 'home', params: {} }
    case pathname === '/blog':
      return { name: 'blog', params: {} }
    case pathname.startsWith('/article/') && parts.length === 3:
      return { name: 'article', params: { id: parts[2] } }
    case pathname.startsWith('/project/') && parts.length === 3:
      return { name: 'project', params: { id: parts[2] } }
    default:
      return { name: null, params: {} }
  }
}
