import { ContentBackupImages } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PartialDeep } from 'type-fest'
import { CollectionCardData } from '../../../../common.mjs'
import { CollectionCard, CollectionCardProps } from './CollectionCard.js'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Molecules/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'CollectionCardStoryProps',
    'CollectionCardLoggedInStoryProps',
    'CollectionCardLoggedOutStoryProps',
    'CollectionCardfollowedStoryProps',
    'CollectionCardBookmarkedStoryProps',
    'CollectionCardOwnerStoryProps',
    'CollectionCardOwnerPrivateStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const getCollectionCardStoryProps = (
  overrides?: PartialDeep<CollectionCardProps>,
): CollectionCardProps => {
  const data: CollectionCardData = {
    collectionId: `${Math.floor(Math.random() * ContentBackupImages.length)}`,
    title: 'Such a great collection',
    imageUrl: 'https://picsum.photos/300/200',
    collectionHref: href('Pages/Collection/Logged In'),
  }

  const state = {
    bookmarked: false,
    followed: false,
    numFollowers: 32,
    numResource: 5,
    isPublished: true,
  }

  const actions = {
    publish: action('publish resource'),
    setIsPublished: action('set is published'),
    toggleFollow: linkTo('Molecules/CollectionCard', 'followed'),
    toggleBookmark: linkTo('Molecules/CollectionCard', 'Bookmarked'),
  }

  const access = {
    isAuthenticated: true,
    isCreator: false,
    canEdit: false,
  }

  return overrideDeep<CollectionCardProps>(
    {
      mainColumnItems: [],
      data: data,
      state: state,
      actions: actions,
      access: access,
    },
    overrides,
  )
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps(),
}

export const CollectionCardfollowedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      followed: true,
    },
    actions: {
      toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardBookmarkedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      bookmarked: true,
    },
    actions: {
      toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Logged Out'),
    },
    state: {},
    actions: {},
    access: {
      isAuthenticated: false,
    },
  }),
}

export const CollectionCardOwnerStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Owner'),
    },
    state: {
      followed: true,
      isPublished: true,
    },
    actions: {},
    access: {
      isCreator: true,
    },
  }),
}

export const CollectionCardOwnerPrivateStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardOwnerStoryProps,
    data: {},
    state: {
      isPublished: false,
    },
    actions: {},
    access: {},
  }),
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => (
  <CollectionCard {...args} />
)

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps

export const followed = CollectionCardStory.bind({})
followed.args = CollectionCardfollowedStoryProps

export const Bookmarked = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps

export const Owner = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps

export const Public = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps

export const Private = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps

export default meta