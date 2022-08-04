import { Subject } from 'rxjs'
import { PackageInfo } from '../pkg-mng/types'
import type { Ext, ExtDef, ExtDeployment, Shell } from './ext'
import { DataMessage } from './message'
// export type PkgInfo = {
//   name: string
//   version: string
// }

export type RegItem<Def extends ExtDef = ExtDef> = ExtDeployment<Def> & {
  shell: Shell<Def>
  ext: Ext<Def>
  $msg$: Subject<DataMessage<any>>
  at: Date
  pkgInfo: PackageInfo
}
