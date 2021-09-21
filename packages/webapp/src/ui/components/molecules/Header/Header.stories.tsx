import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { Header, HeaderPropsIdle } from './Header'

const meta: ComponentMeta<typeof Header> = {
  title: 'Components/Organisms/Headers/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'HeaderLoggedInStoryProps',
    'HeaderLoggedOutStoryProps',
    'HeaderLoggedInOrganizationStoryProps',
    'HeaderLoggedOutOrganizationStoryProps',
  ],
}

export const HeaderLoggedInStoryProps: HeaderPropsIdle = {
  status: 'idle',
  organization: {
    name: 'MoodleNet',
    url: 'https://www.moodle.com/',
    logo: '',
  },
  homeHref: href('Pages/Landing/Logged In'),
  me: {
    bookmarksHref: href('Pages/Bookmarks/Logged In'),
    followingHref: href('Pages/Following/Logged In'),
    myProfileHref: href('Pages/Profile/Logged In'),
    logout: action('logout'),
    avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
    name: 'username',
  },
  loginHref: href('Pages/Login/Login Page'),
  signUpHref: href('Pages/SignUp/Sign Up Page'),
  newResourceHref: href('Pages/New Resource/Start'),
  newCollectionHref: href('Pages/New Collection/Start'),
  searchText: '',
  setSearchText: action('setSearchText'),
}

export const HeaderLoggedOutStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInStoryProps,
  me: null,
}

export const HeaderLoggedInOrganizationStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInStoryProps,
  organization: {
    ...HeaderLoggedInStoryProps.organization,
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  },
}

export const HeaderLoggedOutOrganizationStoryProps: HeaderPropsIdle = {
  ...HeaderLoggedInOrganizationStoryProps,
  me: null,
}

const HeaderStory: ComponentStory<typeof Header> = args => <Header {...args} />

export const LoggedIn = HeaderStory.bind({})
LoggedIn.args = HeaderLoggedInStoryProps
LoggedIn.parameters = { layout: 'fullscreen' }

export const LoggedOut = HeaderStory.bind({})
LoggedOut.args = HeaderLoggedOutStoryProps
LoggedOut.parameters = { layout: 'fullscreen' }

export const LoggedInOrganization = HeaderStory.bind({})
LoggedInOrganization.args = HeaderLoggedInOrganizationStoryProps
LoggedInOrganization.parameters = { layout: 'fullscreen' }

export const LoggedOutOrganization = HeaderStory.bind({})
LoggedOutOrganization.args = HeaderLoggedOutOrganizationStoryProps
LoggedOutOrganization.parameters = { layout: 'fullscreen' }

export default meta
