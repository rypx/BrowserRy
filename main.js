'use strict'

const process = require('process')
const Express = require('express')
const Wrapper = require('./wrapper')

Express()
    .use(require('helmet')())
    .get('/', (req, res) => {
        res.end('BrowserRy - Puppeteer Services')
    })

    .get('/test', async (req, res) => {
        let data = await Wrapper.domScreenshot('https://google.com', 'body')

        if ( !data ) {
            res.end('Something went wrong.. You want chocolate?')
            return
        }

        res.contentType('png').send(data)
    })

    .get('/screenshot', async (req, res) => {
        let Queries = {
            url: req.query.url || null,
            selector: req.query.selector || 'body',
            transparent: req.query.transparent || false,
            mode: req.query.mode || 'networkidle0',
            width: req.query.width || 1920,
            height: req.query.height || 1080
        }

        if ( Queries.url === null ) {
            res.end('URL must be filled!')
            return
        }

        let RequestTypes
        await Object.keys(Queries).forEach(x => {
            let v = Queries[x]
            RequestTypes = (RequestTypes || '') + `${x}: ${v} - `
        })

        console.log('[ # ] New screenshot Request:', RequestTypes)
        let data = await Wrapper.domScreenshot(Queries.url, Queries.selector, Queries.transparent, Queries.mode, parseInt(Queries.width), parseInt(Queries.height))
        if ( !data ) {
            res.end('Something went wrong.. You want chocolate?')
            return
        }

        res.contentType('png').send(data)
    })
    .listen(process.env.PORT || 3300, () => console.log(`[ # ] BrowserRy Server is Online. [ http://${(require('ip').address())}:${process.env.PORT || 3300} ]`))