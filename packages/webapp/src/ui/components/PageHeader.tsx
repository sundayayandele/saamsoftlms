import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import logo from '../static/img/logo.jpg'

export type PageHeaderProps = {
  homeLink: LinkDef
  loginLink: LinkDef
  logout(): unknown
  username: null | string
}

export const PageHeader: FC<PageHeaderProps> = ({ homeLink, loginLink, logout, username }) => {
  const Link = useLink()
  return (
    <Menu fixed="top">
      <Link href={homeLink}>
        <Menu.Item header>
          <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
          MoodleNet
        </Menu.Item>
      </Link>
      <Menu.Item header position="right">
        {username ? (
          <>
            <Icon circular name="user circle" size="large" color="orange" />
            <Dropdown item text={username} header simple icon={false}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout}>
                  <Trans>Logout</Trans>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <Link href={loginLink}>
            <Icon circular name="user circle outline" size="large" color="orange" />
            <Trans>Sign in</Trans>
          </Link>
        )}
      </Menu.Item>
    </Menu>
  )
}
