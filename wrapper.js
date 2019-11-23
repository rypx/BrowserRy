'use strict'

const fs = require('fs')
const Puppeteer = require('puppeteer-core')

module.exports = {
    browserSession() {
        return (fs.readFileSync('.browser-session')).toString()
    },

    async domScreenshot(url, selector, transparent = false, mode = 'networkidle0', width = 1920, height = 1080) {
        let session = this.browserSession()
        let browser = await Puppeteer.connect({
            browserWSEndpoint: session,
            ignoreHTTPSErrors: true
        })

        let page = await browser.newPage()
        if ( transparent ) {
            page._emulationManager._client.send(
                'Emulation.setDefaultBackgroundColorOverride',
                { color: { r: 0, g: 0, b: 0, a: 0 } }
            )
        }

        await page.setViewport({ width: width, height: height, devicechange: 1 })
        try {
            await page.goto(url, { waitUntil: mode })
        } catch (err) {
            console.error(err)
            await page.close()
            return false
        }

        await page.evaluateOnNewDocument( () => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            })
            Object.defineProperty(navigator, "languages", {
                get: function() {
                    return ["en-US", "en"];
                }
            })
            Object.defineProperty(navigator, 'plugins', {
                get: function() {
                    return [1, 2, 3, 4, 5];
                }
            })
        })

        async function screenshotDOMElement(opts = {}) {
            const padding = 'padding' in opts ? opts.padding : 0;
            const selector = opts.selector;

            if (!selector)
                throw Error('Please provide a selector.');

            const rect = await page.evaluate(selector => {
                const element = document.querySelector(selector);
                if (!element)
                    return null;
                const {x, y, width, height} = element.getBoundingClientRect();
                return {left: x, top: y, width, height, id: element.id};
            }, selector);

            if (!rect)
                throw Error(`Could not find element that matches selector: ${selector}.`);

            return await page.screenshot({
                encoding: 'binary',
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2
                }
            })
        }

        let screenshotData = await screenshotDOMElement({
            selector: selector,
            padding: 0
        })

        await page.close()
        return screenshotData
    }
}