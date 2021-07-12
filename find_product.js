const https = require('https')
console.log("usage :")
console.log("node ./find_product [keyword]")
var dstr = ""
const data = JSON.stringify({
})

const options = {
  hostname: 'www.shopdisney.co.uk',
  port: 443,
  path: '/search?q='+process.argv[2],
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}


function analysis(html_data,cb) {
      var products = []
      var name_poses = html_data.split('<h4 class="product__tilename no-transform">')
      var price_poses = html_data.split('<span class="price__current js-price-current" data-price="')


      name_poses.forEach(function(line,index){
        var endpos = line.indexOf('</h4>');
        var name = line.substring(0,endpos)
        var obj ={}
        obj.name =name
        obj.price=0.0
        products.push(obj)
        if(index>= (name_poses.length-1)){
          price_poses.forEach(function(line,index){
            var endpos = line.indexOf('"');
            var price = line.substring(0,endpos)
            products[index].price =price
          })
          products.shift()
          cb(products)
        }
      })
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {

     dstr +=d.toString() 
  })
  res.on("end",err=>{
        analysis(dstr,function(results){
          console.log(results)
        })
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()


