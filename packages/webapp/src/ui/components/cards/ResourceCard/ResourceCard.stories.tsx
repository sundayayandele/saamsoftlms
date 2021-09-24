import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { TagListStory } from '../../../elements/tags'
import { ResourceCard, ResourceCardProps } from './ResourceCard'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Components/Organisms/Cards/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'ResourceCardStoryProps',
    'ResourceCardLoggedOutStoryProps',
    'ResourceCardLoggedInStoryProps',
    'ResourceCardOwnerStoryProps',
    'ResourceCardOwnerBookmarkedStoryProps'
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const ResourceCardStoryProps: ResourceCardProps = {
  tags: TagListStory,
  isOwner: false,
  title: 'Best resource ever forever',
  image: 'https://picsum.photos/200/100',
  type: 'Video',
  resourceHomeHref: href('Pages/Resource/Logged In'),
  isAuthenticated: true,
  bookmarked: false,
  liked: false,
  numLikes: 23,
}

export const ResourceCardLoggedInStoryProps: ResourceCardProps = {
  ...ResourceCardStoryProps,
}

export const ResourceCardLoggedOutStoryProps: ResourceCardProps = {
  ...ResourceCardStoryProps,
  isAuthenticated: false,
}

export const ResourceCardOwnerStoryProps: ResourceCardProps = {
  ...ResourceCardLoggedInStoryProps,
  isOwner: true,
}

export const ResourceCardOwnerBookmarkedStoryProps: ResourceCardProps = {
  ...ResourceCardOwnerStoryProps,
  bookmarked: true,
}

const ResourceCardStory: ComponentStory<typeof ResourceCard> = args => <ResourceCard {...args} />

export const LoggedIn = ResourceCardStory.bind({})
LoggedIn.args = ResourceCardLoggedInStoryProps

export const LoggedOut = ResourceCardStory.bind({})
LoggedOut.args = ResourceCardLoggedOutStoryProps

export const Owner = ResourceCardStory.bind({})
Owner.args = ResourceCardOwnerStoryProps

export default meta