const fs = require ('fs');
const http = require('http');
const url = require('url')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FILES SYSTEMS

// //BLOCKING SYNCHRONUS WAY
// const textIn = fs.readFileSync('.txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('.txt/output.txt', textOut)
// console.log('File Written') 

// //NON-BLOCKING ASYNCHRONUS WAY.
// fs.readFile('.txt/star.txt','utf-8', (err, data1) => {
//     if (err) return console.log("ërror!!!!")
//     fs.readFile(`.txt/${data1}.txt`,'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('.txt/appended.txt','utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('.txt/final.txt', `${data1}\n${data2}`,'utf-8', (err) => {
//                 console.log('your file has been writen')
//             })
//         })
//     })
// })
// console.log('will read!')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGES%}/g, product.image)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not organic")
    return output;
}

const templateOverview = fs.readFileSync (`${__dirname}/templates/template-overview.html`, 'utf-8')
const templateCard = fs.readFileSync (`${__dirname}/templates/template-card.html`, 'utf-8')
const templateProduct = fs.readFileSync (`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync (`${__dirname}/dev-data/data.json`, 'utf-8')
const productData = JSON.parse (data)
   
const server = http.createServer ((req,res) => {
const { query, pathname }  = url.parse(req.url, true)

//overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead (200, {"content-type" : "text/html"})

        const cardsHtml = productData.map (el => { return replaceTemplate (templateCard, el)}).join('')
        const output = templateOverview.replace ('{%PRODUCT_CARD%}', cardsHtml)
        res.end(output)
//products page
    } else if (pathname === "/productid"){
        console.log(query)
        res.end("hello from the product")
//api
    }else if (pathname === "/api") {
        res.writeHead (200, {"content-type" : "application/jason"},
        res.end (data) ) 
//not found page
    }else {
        res.writeHead ( 404, {
        'Contet-type' : 'text/html',
        'My-own-header' : 'Hello World'
    })
        res.end ('<h1> page not found </h1>') 
    }
    })
   
server.listen(8000, '127.0.0.1', () => {
    console.log("server is running")
})
