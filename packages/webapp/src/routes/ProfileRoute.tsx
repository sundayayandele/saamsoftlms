import { nodeSlugId } from 'my-moodlenet-common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from 'my-moodlenet-common/lib/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from 'my-moodlenet-common/lib/webapp/sitemap/helpers'
import { ctrlHook } from '../ui/lib/ctrl'
import { useProfileCtrl } from '../ui/pages/Profile/Ctrl/ProfileCtrl'
import { Profile } from '../ui/pages/Profile/Profile'
import { MNRouteProps, RouteFC } from './lib'

export const ProfileRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('Profile', slug)
  const props = ctrlHook(useProfileCtrl, { id }, `route-${id}`)
  return <Profile {...props} />
}

export const ProfileRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: ProfileRouteComponent,
  path: getContentNodeHomePageRoutePath('Profile'),
  exact: true,
}
