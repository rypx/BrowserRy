'use strict'

const fs = require('fs')
const Express = require('express')

const browserSession = () => {
    return (fs.readFileSync('.browser-session')).toString()
}

Express()
    .get('/', (req, res) => {
        res.end('BrowserRy - Puppeteer Services')
    })
    .listen(process.env.PORT || 3300, () => console.log(`[ # ] BrowserRy Server is Online. [ http://${(require('ip').address())}:${process.env.PORT || 3300} ]`))