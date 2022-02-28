function bodyParser(Request,callback){
  let body=' '


  Request.on('data',(chunk) =>{
    body += chunk
  })

  Request.on('end',() =>{
    body=JSON.parse(body)
    Request.body = body
    callback()
  })
}

module.exports = bodyParser