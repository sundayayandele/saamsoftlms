import type { ResourceFormProps } from '@moodlenet/ed-resource/common'
import type { ResourceProps } from '@moodlenet/ed-resource/ui'
import { Resource } from '@moodlenet/ed-resource/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { useResourceStoryProps } from './ResourceProps.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['NewResourceProps', 'useResourceForm'],
}

type ResourceStory = ComponentStory<typeof Resource>

export const LoggedOut: ResourceStory = () => {
  const props: ResourceProps = useResourceStoryProps({
    data: {},
    state: {},
    actions: {},
    access: {},
    isAuthenticated: false,
  })

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      contentType: 'link',
      contentUrl: 'https://www.google.com',
    },
    state: {},
    actions: {},
    access: {},
    likeButtonProps: {
      liked: true,
    },
    bookmarkButtonProps: {
      bookmarked: true,
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps: Partial<ResourceFormProps> = {
  title: '',
  description: '',
  subject: '',
  license: '',
  language: '',
  level: '',
  month: '',
  year: '',
  type: '',
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    isEditingAtStart: true,
    data: {
      downloadFilename: undefined,
      contentUrl: undefined,
      image: null,
      // numLikes: 0,
    },
    resourceForm: NewResourceProps,

    state: {
      isPublished: false,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
      canPublish: true,
      canDelete: true,
    },
  })
  return <Resource {...props} />
}

export const Creator: ResourceStory = () => {
  const [isPublished, setIsPublished] = useState(true)
  const [isSaving, setIsSaving] = useState(true)
  const props = useResourceStoryProps({
    isSaving: isSaving,
    data: {},
    state: {
      isPublished: isPublished,
    },
    actions: {
      editData: () => {
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
        }, 1000)
      },
      publish: () => {
        setIsPublished(true)
      },
      unpublish: () => {
        console.log('unpublish')
        setIsPublished(false)
      },
    },
    access: {
      isCreator: true,
      canEdit: true,
      canPublish: true,
      canDelete: true,
    },
    likeButtonProps: {
      liked: false,
    },
    bookmarkButtonProps: {
      bookmarked: false,
    },
  })
  return <Resource {...props} />
}

export const Admin: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {},
    state: {},
    actions: {},

    access: {
      canEdit: true,
      canPublish: true,
    },
  })
  return <Resource {...props} />
}

export default meta
