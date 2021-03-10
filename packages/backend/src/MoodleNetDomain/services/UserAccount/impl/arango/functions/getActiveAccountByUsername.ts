import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { UserAccountDB } from '../env'
import { ActiveUserAccount, UserAccountStatus } from '../types'

export const getActiveAccountByUsername = async ({
  username,
  db: { UserAccount, db },
}: {
  username: string
  db: UserAccountDB
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
    FILTER userAccount.username == ${username}
          && userAccount.status == ${UserAccountStatus.Active}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<ActiveUserAccount> = await cursor.next()
  return mAccount
}
