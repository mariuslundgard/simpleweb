// @flow

export type GraphQLError = {
  message: string
}

export type GraphQLResult = {
  data: any | null,
  errors: GraphQLError[] | null
}

export type GraphQLClient = {
  query: (q: string) => Promise<GraphQLResult>
}
