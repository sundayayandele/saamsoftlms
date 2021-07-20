import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ProfileCardStoryProps } from '../../components/cards/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { ScoreCardStoryProps } from '../../components/cards/ScoreCard/ScoreCard.stories'
import { HeaderMoodleStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['ProfileStoryProps', 'ProfileLoggedOutStoryProps', 'ProfileLoggedInStoryProps'],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageStoryProps,
    isAuthenticated: true,
  },
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
  username: 'Juanito',
}

export const ProfileLoggedOutStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      headerProps: {
        ...HeaderMoodleStoryProps,
        me: null,
      },
      subHeaderProps: null,
    },
  },
}

export const ProfileLoggedInStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: true,
    headerPageProps: {
      headerProps: HeaderMoodleStoryProps,
      subHeaderProps: SubHeaderStoryProps,
    },
  },
}

export const LoggedOut = ProfileStory.bind({})
LoggedOut.args = ProfileLoggedOutStoryProps

export const LoggedIn = ProfileStory.bind({})
LoggedIn.args = ProfileLoggedInStoryProps

export default meta
