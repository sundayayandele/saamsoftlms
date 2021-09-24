import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
// import { ActivationRoute } from './ActivateNewUserRoute'
import { BookmarksRoute } from './BookmarksRoute'
import { CategoryRoute } from './CategoryRoute'
import { CollectionRoute } from './CollectionRoute'
import { CookiesPoliciesRoute } from './CookiesPolicyRoute'
import { FollowingRoute } from './FollowingRoute'
import { LandingRoute } from './LandingRoute'
import { LMSMoodleLandingRoute } from './LMSMoodleLandingRoute'
import { LoginRoute } from './LoginRoute'
import { NewCollectionRoute } from './NewCollectionRoute'
import { NewPasswordRoute } from './NewPasswordRoute'
import { NewResourceRoute } from './NewResourceRoute'
import { ProfileRoute } from './ProfileRoute'
import { RecoverPasswordRoute } from './RecoverPasswordRoute'
import { ResourceRoute } from './ResourceRoute'
import { SearchRoute } from './SearchRoute'
import { SignupRoute } from './SignUpRoute'
import { UserAgreementRoute } from './UserAgreementRoute'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...LMSMoodleLandingRoute} />
      <Route {...SearchRoute} />
      <Route {...NewResourceRoute} />
      <Route {...NewCollectionRoute} />
      <Route {...BookmarksRoute} />
      <Route {...FollowingRoute} />
      <Route {...ProfileRoute} />
      <Route {...CategoryRoute} />
      <Route {...ResourceRoute} />
      <Route {...CollectionRoute} />
      <Route {...RecoverPasswordRoute} />
      <Route {...NewPasswordRoute} />
      <Route {...LoginRoute} />
      <Route {...SignupRoute} />
      {/* <Route {...ActivationRoute} /> */}
      <Route {...LandingRoute} />
      <Route {...CookiesPoliciesRoute} />
      <Route {...UserAgreementRoute} />
    </Switch>
  )
}