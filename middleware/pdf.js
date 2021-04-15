const express = require('express')
const puppeteer = require('puppeteer')
const path = require('path')

module.exports = async function pdf(url, req) {
  const filename = 'reportOne'
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/api/raport/' + url, {
    waitUntil: 'networkidle2',
  })
  await page.pdf({
    path: filename,
    format: 'A4',
    landscape: true,
    printBackground: true,
  })

  await browser.close()
  return filename
}
