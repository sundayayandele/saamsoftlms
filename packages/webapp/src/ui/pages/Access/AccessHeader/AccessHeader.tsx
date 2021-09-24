import { Trans } from '@lingui/macro'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import HeaderTitle from '../../../components/molecules/Header/HeaderTitle/HeaderTitle'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import { Organization } from '../../../types'
import './styles.scss'

export type AccessHeaderProps = {
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  homeHref: Href
  signupHref: Href
  loginHref: Href
  page: 'login' | 'signup' | 'activation'
}

export const AccessHeader = withCtrl<AccessHeaderProps>(
  ({ organization, homeHref, signupHref, loginHref, page }) => {
    return (
      <div className="access-header">
        <div className="content">
          <HeaderTitle organization={organization} homeHref={homeHref} />
          {page !== 'activation' ? (
            <div className="buttons">
              {page === 'login' ? (
                <Link href={signupHref}>
                  {' '}
                  {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange"><Trans>Sign up</Trans></SecondaryButton>
                </Link>
              ) : (
                <Link href={loginHref}>
                  {' '}
                  {/* TODO Implement on Controller */}
                  <SecondaryButton color="orange"><Trans>Log in</Trans></SecondaryButton>
                </Link>
              )}
              <a href="https://moodle.com/moodlenet/" target="__blank">
                <PrimaryButton><Trans>Learn more</Trans></PrimaryButton>
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  },
)
AccessHeader.displayName = 'AccessHeader'
export default AccessHeader