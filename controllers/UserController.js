let users = require('../mocks/users')

module.exports = {
  listUser(Request,Response){
    const { order} = Request.query

    const sortedUsers = users.sort((a,b) =>{
      if (order === 'desc'){
        return a.id < b .id ? 1 : -1 
      }

      return a.id>b.id ? 1 : -1
    })
    
    Response.send(200,sortedUsers)
  },
  getUserById(Request,Response){
    const{id} = Request.params;

    const user = users.find((user) => user.id === Number(id))

    if(!user){
    return  Response.send(400,{error:'User not found'})
    }
    Response.send(200,user)
  },
  createUser(Request,Response){
    const {body} = Request

      const lastUserId =  users[users.length -1].id

      const newUser= {
        id: lastUserId +1,
        name:body.name,
      }

      users.push(newUser)

      Response.send(200,newUser)
    },

    updateUser(Request, Response) {
      let {id} = Request.params
      const {name} = Request.body

      id = Number(id)

      const userExists = users.find((user) => user.id ===id)

      if (!userExists){
        return Response.send(400, {error: 'User not found'})
      }

      users = users.map((user) => {
        if(user.id === id){
          return{
            ...user,
            name,
          }
        }
        return user
      })

      Response.send(200,{id,name})
    },

    deleteUser(Request,Response){
      let {id} = Request.params
      id = Number(id)

      users = users.filter((user) => user.id !=id)
      Response.send(200, {deleted: true})
    }
}