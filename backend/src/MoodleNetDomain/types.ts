import { Flow } from '../lib/domain/types/path'
import { Role } from './services/ContentGraph/ContentGraph.graphql.gen'
import { Id } from './services/ContentGraph/graphDefinition/types'

export type MoodleNetExecutionAuth = {
  accountId: string
  username: string
  email: string
  displayName: string
  role: Role
  userId: Id
}

export type MoodleNetExecutionContext = {
  auth: MoodleNetExecutionAuth | null
  flow: Flow
}