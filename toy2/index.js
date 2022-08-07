import { launch, goto, evalCode, alertClose, getData, writeFile } from './modules/crawl.js'

async function main () {
    await launch()

    await goto('https://www.melon.com/')

    await alertClose()

    await evalCode()

    await getData()

    await writeFile()

    process.exit(1)
}

main()