import { OverallCardStories } from '@moodlenet/react-app/stories'
import { OverallCard } from '@moodlenet/react-app/ui'
import { ProfileProps, useProfileCardStoryProps } from '@moodlenet/web-user/ui'

// const editForm: ProfileFormValues = {
//   displayName: 'Alberto Curcella',
//   description: '',
//   avatarImage:
//     'https://moodle.net/assets/01F/T/N/3/X/3CGXZ0TQRN1EX27D7WY/01FTN3X3CGXZ0TQRN1EX27D7WY.jpg',
//   backgroundImage:
//     'https://images.unsplash.com/photo-1450045439515-ff27c2f2e6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHw1fHx3aGFsZXxlbnwwfDB8fHwxNjU0NzU2NzU3&ixlib=rb-1.2.1&q=80&w=1080',
//   location: 'San Felipe, Mexico',
//   organizationName: 'Moodle Pty Ltd',
//   siteUrl: 'https://moodle.com',
// }

import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'

export const useProfileStoryProps = (overrides?: {
  props?: Partial<ProfileProps>
  isAuthenticated?: boolean
  // editFormValues?: Partial<ProfileFormValues>
}): ProfileProps => {
  const isAuthenticated = overrides?.isAuthenticated ?? true
  const ProfileCardStoryProps = useProfileCardStoryProps({
    props: { isAuthenticated },
    // editFormValues: overrides?.editFormValues,
  })

  const overallCard = {
    Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
    key: 'overall-card',
  }

  return {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    sideColumnItems: [overallCard],
    profileCardProps: ProfileCardStoryProps,
    // editForm: ProfileCardStoryProps.editForm,
    // sendEmailForm: useFormik<{ text: string }>({
    //   initialValues: { text: '' },
    //   onSubmit: action('submit send Email Form'),
    // }),
    // reportForm: useFormik<{ comment: string }>({
    //   initialValues: { comment: '' },
    //   onSubmit: action('submit report Form'),
    // }),
    // newResourceHref: href('Pages/New Resource/Default'),
    // newCollectionHref: href('Pages/New Collection/Start'),
    // headerPageTemplateProps: {
    //   headerPageProps: HeaderPageLoggedInStoryProps,
    //   isAuthenticated,
    //   mainPageWrapperProps: {
    //     userAcceptsPolicies: null,
    //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    //   },
    // },
    // overallCardProps: OverallCardStoryProps,
    // collectionCardPropsList: [
    //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    // ],
    // resourceCardPropsList: [
    //   ResourceCardLoggedInStoryProps,
    //   ResourceCardLoggedInStoryProps,
    //   ResourceCardLoggedInStoryProps,
    // ],
    ...overrides?.props,
  }
}