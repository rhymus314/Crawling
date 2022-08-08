import puppeteer from "puppeteer-core";
import os from 'os'
import fs from 'fs'
// branch test
const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const currentOs = os.type()
const launchConfig = {
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
  executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}

let browser = null
let page = null
let finalData = []


const launch = async function( ) {
    
    browser = await puppeteer.launch(launchConfig);
    const pages = await browser.pages();
    page = pages[0]
}

const goto = async function(url) {
    return await page.goto(url)
}
const alertClose = async function () {
    await page.on('dialog', async function(dialog){
        await dialog.accept()
    })
}

const evalCode = async function() {

    await page.evaluate(function(){
        document.querySelector("#gnb_menu > ul:nth-child(1) > li.nth1 > a").click()
    })
}
const getData = async function () {
    
    await page.waitForSelector("#lst50")
    const infoArr = await page.evaluate(function(){

        var trArr = document.querySelectorAll("#frm > div > table > tbody > tr")
        var returnData = []

        for(var i=0; i < trArr.length; i++) {
    
            var currentTr = trArr[i]
    
            var rank = currentTr.querySelector('td')[2]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
            var address = currentTr.querySelectorAll('td')[5]?.innerText .replaceAll('\n', '').replaceAll('\t', '')
            var album = currentTr.querySelectorAll('td')[6]?.innerText .replaceAll('\n', '').replaceAll('\t', '')
            var like = currentTr.querySelectorAll('td')[7]?.innerText .replaceAll('\n', '').replaceAll('\t', '')

            var jsonData = {
                rank,
                address,
                album,
                like
            }

            if(jsonData.address != undefined) {
                returnData.push(jsonData)
            }
            
        }
        return returnData
        

        
    })
    finalData = finalData.concat(infoArr)

    browser.close()

}


const writeFile = async function () {
    const stringData = JSON.stringify(finalData)

    const exist = fs.existsSync(`./json/tem`)

    if(!exist) {

        fs.mkdir(`./json/tem`, {rescursive: true}, function (err) {
            console.log(err)
        } )
    }
    const filePath = './json/temp1.json'

    await fs.writeFileSync(filePath, stringData)

}


export {
    launch,
    goto,
    alertClose,
    evalCode,
    getData,
    writeFile
}