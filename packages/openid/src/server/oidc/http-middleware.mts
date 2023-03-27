import { addMiddleware } from '@moodlenet/http-server/server'
import { WebUserProfile } from '@moodlenet/react-app/init'
import { EntityUser, setCurrentUserFetch } from '@moodlenet/system-entities/server'
import { shell } from '../shell.mjs'
import { openIdProvider } from './provider.mjs'

const OPENID_HEADER = 'Authorization'
const HEADER_PREFIX = 'Bearer '
const HEADER_PREFIX_REGEXP = new RegExp(`^${HEADER_PREFIX}`)
await shell.call(addMiddleware)({
  handlers: [
    async (req, _resp, next) => {
      const authHeader = req.header(OPENID_HEADER)
      if (!(authHeader && HEADER_PREFIX_REGEXP.test(authHeader))) {
        return next()
      }
      const jtiAuthHeader = authHeader.replace(HEADER_PREFIX_REGEXP, '')
      const AccessToken = await openIdProvider.AccessToken.find(jtiAuthHeader)
      // console.log({ AccessTokenAuthBearerHeader: AccessToken })
      if (AccessToken) {
        await setCurrentUserFetch(async () => {
          const entityUser: EntityUser = {
            type: 'entity',
            entityIdentifier: {
              entityClass: WebUserProfile.entityClass,
              _key: AccessToken.accountId,
            },
            restrictToScopes: [...AccessToken.scopes],
          }
          return entityUser
        })
      }

      next()
    },
  ],
})