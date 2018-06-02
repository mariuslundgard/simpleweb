// @flow

export function navigate (path: string, query: any) {
  return {
    type: 'route/NAVIGATE',
    path,
    query
  }
}
