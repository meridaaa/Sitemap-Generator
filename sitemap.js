const express = require('express')
const app  =express()
const SitemapGenerator = require('sitemap-generator');
const fs = require('fs')
app.set('view engine','ejs')
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('xmlsitemapgenerator', {title: 'XML Sitemap Generator Online'})
})

app.post('/', (req, res) => {
    var url = req.body.url
    
    var outputfile = Date.now() + "output.xml"

    // create generator
    const generator = SitemapGenerator(url, {
    stripQuerystring: false,
    filepath: outputfile
    });
    
    // register event listeners
    generator.on('done', () => {
        res.download(outputfile,(err) => {
            if (err) {
                fs.unlinkSync(outputfile)
                res.send(err)
            }
            fs.unlinkSync(outputfile)
        })
    });
    
    // start the crawler
    generator.start();
})



app.listen(3000)