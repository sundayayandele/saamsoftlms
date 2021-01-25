import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { LookupEventType } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Role, User } from '../ContentGraph.graphql.gen'
import { ROOTUserId, ShallowNode } from '../persistence/types'

export type CreateUserPersistence = (_: {
  username: string
  role: Role
  creatorId: string
}) => Promise<ShallowNode<User>>

export type UserCreateForNewAccountApi = Api<
  LookupEventType<
    MoodleNetDomain,
    'UserAccount.RegisterNewAccount.NewAccountActivated'
  >,
  { newUser: ShallowNode<User> | null }
>

export const UserCreateForNewAccountApiHandler = async () => {
  const { createUser } = await getContentGraphPersistence()

  const handler: RespondApiHandler<UserCreateForNewAccountApi> = async ({
    req: { username },
  }) => {
    const newUser = await createUser({
      username,
      role: Role.User,
      creatorId: ROOTUserId,
    })
    return { newUser }
  }

  return handler
}
