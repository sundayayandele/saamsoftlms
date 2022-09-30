import { defApi } from '@moodlenet/core'
import { getAppearance, setAppearance, setupPlugin } from './lib.mjs'
import { WebappPluginDef } from './types.mjs'
import { AppearanceData } from './types/data.mjs'
import { WebPkgDepList } from './webapp/web-lib.mjs'

export default {
  getAppearance: defApi(
    _ctx => async () => {
      return getAppearance()
    },
    () => true,
  ),
  setAppearance: defApi(
    _ctx =>
      async ({ appearanceData }: { appearanceData: AppearanceData }) => {
        return setAppearance({ appearanceData })
      },
    () => true,
  ),
  plugin: defApi(
    ctx =>
      async <Deps extends WebPkgDepList = never>(pluginDef: WebappPluginDef<Deps>) => {
        return await setupPlugin({ pluginDef, pkgInfo: ctx.caller.pkgInfo })
      },
    () => true,
  ),
}
