const http = require('http')

const {URL} = require('url')

const bodyParser = require('./helpers/bodyParser')
const routes = require('./routes')

const server = http.createServer((Request,Response) => {
  const parsedUrl = new URL(`http://localhost:200${Request.url}`)
  console.log(`Method: ${Request.method} || Endpoint: ${parsedUrl.pathname}`)

  let {pathname} = parsedUrl
  let id = null

  const splitEndPoint = pathname.split('/').filter(Boolean)
  
  if(splitEndPoint.length > 1){
    pathname = `/${splitEndPoint[0]}/:id` 
    id=splitEndPoint[1]
  }

  const route = routes.find((routeObj)=>(
    routeObj.endpoint === pathname && routeObj.method===Request.method
  ))

  if (route) {
    Request.query= Object.fromEntries(parsedUrl.searchParams)
    Request.params= { id }

    Response.send = (statusCode,body) =>{
      Response.writeHead(statusCode, {'Content-Type':'application/json'})
      Response.end(JSON.stringify(body))
    }

    if(['POST', 'PUT', 'PATCH'].includes(Request.method)){
      bodyParser(Request, ()=>  route.handler(Request, Response))
    }else{
    route.handler(Request, Response)
    }
  }else{
    Response.writeHead(404, {'Content-Type':'text/html'})
    Response.end(`Cannot connect with ${Request.method} ${parsedUrl.pathname}`)
  }

})

server.listen(200, () => console.log('Server started at http://localhost:200'))