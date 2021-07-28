import { VersionedDB } from '../../../lib/helpers/arango/migrate/types'

export type UserAuthDB = VersionedDB<'0.0.1'>

// ^ Document Collections
export const USER = 'User'
export const CONFIG = 'Config'
