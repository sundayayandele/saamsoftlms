import cookieParser from 'cookie-parser'
import express from 'express'
import gracefulShutdown from 'http-graceful-shutdown'
import { BASE_PKG_URL, SESSION_TOKEN_COOKIE_NAME } from '../common/pub-lib.mjs'
import { makeExtPortsApp } from './ext-ports-app/make.mjs'
import { env } from './init.mjs'
import { mountedApps } from './lib.mjs'

export let shutdownGracefullyLocalServer: () => Promise<void>

process.on('SIGTERM', () => shutdownGracefullyLocalServer())
const app = express()
  .use(cookieParser())
  .all('*', (req, __, next) => {
    // shell.initiateCall(async () => {

    const cookieSessionTokenAny = req.cookies[SESSION_TOKEN_COOKIE_NAME]
    const maybeCookieSessionToken =
      'string' === typeof cookieSessionTokenAny ? cookieSessionTokenAny : undefined
    // await setCurrentClientSessionToken(maybeCookieSessionToken)
    req.mnSessionToken = maybeCookieSessionToken
    next()
    // })
  })

const pkgAppContainer = express()
app.use(`${BASE_PKG_URL}/`, pkgAppContainer)

const extPortsApp = makeExtPortsApp()
app.use(`${BASE_PKG_URL}/`, extPortsApp)

mountedApps.forEach(({ getApp, mountOnAbsPath, pkgId }) => {
  const pkgApp = getApp(express)
  if (mountOnAbsPath) {
    console.log(`HTTP: mounting ${mountOnAbsPath} for ${pkgId.name}`)
    app.use(mountOnAbsPath, pkgApp)
  } else {
    const pkgBaseRoute = `/${pkgId.name}`
    console.log(`HTTP: mounting ${BASE_PKG_URL}/${pkgBaseRoute}/ for ${pkgId.name}`)
    pkgAppContainer.use(pkgBaseRoute, pkgApp)
  }
})
await new Promise<void>((resolve, reject) => {
  console.info(`HTTP: starting server on port ${env.port}`)
  const server = app.listen(env.port, (...args: any[]) => (args[0] ? reject(args[0]) : resolve()))
  server.on('error', err => console.error('HTTP: server error:', err))
  shutdownGracefullyLocalServer = gracefulShutdown(server, {
    development: false,
    forceExit: false,
    timeout: 1000,
  })
  console.info(`HTTP: listening on port ${env.port} :)`)
})