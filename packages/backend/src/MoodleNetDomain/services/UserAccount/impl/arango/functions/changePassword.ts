import { aql } from 'arangojs'
import { UserAccountDB } from '../env'
import { Messages } from '../types'

export const changeAccountPassword = async ({
  db: { UserAccount, db },
  accountId,
  currentPassword,
  newPassword,
}: {
  db: UserAccountDB
  currentPassword: string
  newPassword: string
  accountId: string
}) => {
  const cursor = await db.query(aql`
    FOR userAccount IN ${UserAccount}
    FILTER userAccount._id == ${accountId} 
        && userAccount.password == ${currentPassword}
    LIMIT 1
    UPDATE userAccount WITH { 
      password: ${newPassword}
    } IN ${UserAccount}
    RETURN NEW
  `)
  const doc = await cursor.next()
  if (!doc) {
    return Messages.NotFound
  }
  return null
}
