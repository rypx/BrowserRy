(async () => {
    'use strict'
    const fs = require('fs')
    const Puppeteer = require('puppeteer')

    let Browser
    let BrowserEndpoint

    if ( !fs.existsSync('browser-data') ) {
        fs.mkdirSync('browser-data')
    }

    try {
        Browser = await Puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--user-data-dir=browser-data',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3738.0 Safari/537.36"'
            ],
            ignoreHTTPSErrors: true
        }).then( output => {
            BrowserEndpoint = output.wsEndpoint()
        })
    } catch (err) {
        console.error(err)
    } finally {
        if ( fs.existsSync('.browser-session') ) {
            await fs.unlinkSync('.browser-session')
            await fs.writeFileSync('.browser-session', BrowserEndpoint)
            console.log('[ # ] Browser Session Refreshed.')
        } else {
            await fs.writeFileSync('.browser-session', BrowserEndpoint)
            console.log('[ # ] Browser Session Created.')
        }
    }
})()