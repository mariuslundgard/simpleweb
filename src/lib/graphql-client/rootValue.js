// @flow

export default {
  clients: (params: any, db: any, info: any) => {
    return db.clients.findAll(params, db, info.fieldNodes[0])
  },
  features: (params: any, db: any, info: any) => {
    return db.features.find(params, db, info.fieldNodes[0])
  },
  modifiedTime: (params: any, db: any, info: any) => {
    return db.modifiedTime.findOne(params, db, info.fieldNodes[0])
  },
  post: (params: any, db: any, info: any) => {
    return db.posts.findOne(params, db, info.fieldNodes[0])
  },
  posts: (params: any, db: any, info: any) => {
    return db.posts.findAll(params, db, info.fieldNodes[0])
  },
  task: (params: any, db: any, info: any) => {
    return db.tasks.findOne(params, db, info.fieldNodes[0])
  },
  tasks: (params: any, db: any, info: any) => {
    return db.tasks.findAll(params, db, info.fieldNodes[0])
  }
}
