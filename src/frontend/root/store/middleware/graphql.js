function create ({ client }) {
  return store => next => action => {
    if (action.type === 'graphql/QUERY') {
      store.dispatch({ type: action.types[0] })
      client
        .query(action.query)
        .then(result => {
          store.dispatch({
            type: action.types[1],
            ...result
          })
        })
        .catch(err => {
          store.dispatch({
            type: action.types[2],
            error: {
              message: err.message,
              stack: err.stack
            }
          })
        })
    }

    return next(action)
  }
}

export default { create }
