function create (opts) {
  return store => next => action => {
    return next(action)
  }
}

export default { create }
