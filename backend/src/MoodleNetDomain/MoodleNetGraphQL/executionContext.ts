import { Executor } from '@graphql-tools/delegate/types'
import { GraphQLError } from 'graphql'
import { IncomingMessage } from 'http'
import { Id } from '../services/ContentGraph/graphDefinition/types'
import { INVALID_TOKEN } from './JWT'
import { getJwtVerifier } from './MoodleNetGraphQL.env'
import { graphQLRequestFlow } from './schemaHelpers'
import {
  MoodleNetExecutionContext,
  MoodleNetExecutionAuth,
  RootValue,
} from './types'

export function loggedUserOnly(_: { context: MoodleNetExecutionContext }) {
  const { context } = _
  if (!context.auth) {
    throw new GraphQLError('Logged in users only')
  }
  return context.auth
}

export function getExecutionGlobalValues(
  ...args: Parameters<Executor>
): {
  context: MoodleNetExecutionContext
  root: RootValue
} {
  const verifyJwt = getJwtVerifier()
  const { context } = args[0]
  const jwtHeader = (context as IncomingMessage)?.headers?.bearer
  const jwtToken =
    jwtHeader && (typeof jwtHeader === 'string' ? jwtHeader : jwtHeader[0])
  const auth = verifyJwt(jwtToken)
  return {
    context: {
      auth: auth === INVALID_TOKEN ? null : auth,
      flow: graphQLRequestFlow(),
    },
    root: {},
  }
}

//FIXME: implement proper typeguard
export const isMoodleNetExecutionAuth = (
  _obj: object
): _obj is MoodleNetExecutionAuth => true

export const getAuthUserId = ({
  accountUsername,
}: {
  accountUsername: string
}) => `User/${accountUsername}` as Id // BEWARE: hardcoded userId generation