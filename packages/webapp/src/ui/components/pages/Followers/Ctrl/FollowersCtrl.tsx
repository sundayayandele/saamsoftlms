import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useSmallProfileCardCtrl } from '../../../molecules/cards/SmallProfileCard/Ctrl/SmallProfileCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowersProps } from '../Followers'
import { useFollowersPageLazyQuery } from './Followers.gen'

export const useFollowersCtrl: CtrlHook<FollowersProps, {}> = () => {
  // const [sortBy, setSortBy] = useState<GlobalFollowersSort>('Popularity')
  const { session } = useSession()
  const [queryFollowers, followersQ] = useFollowersPageLazyQuery({
    fetchPolicy: 'cache-and-network',
  })
  useEffect(() => {
    if (!session?.profile.id) {
      return
    }
    queryFollowers({
      variables: {
        profileId: session.profile.id,
      },
    })
  }, [queryFollowers, session?.profile.id])

  const profileNode = narrowNodeType(['Profile', 'Organization'])(
    followersQ.data?.node
  )

  const followers = useMemo(
    () =>
      (profileNode?.followers.edges || [])
        .filter(isEdgeNodeOfType(['Profile']))
        .map(({ node }) => node),
    [profileNode?.followers.edges]
  )

  const followersUIProps = useMemo(() => {
    const props: FollowersProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),

      browserProps: {
        smallProfileCardPropsList: followers.map((profile) =>
          ctrlHook(
            useSmallProfileCardCtrl,
            { id: profile.id },
            `Profile's Followers ${profile.id} Card`
          )
        ),
        collectionCardPropsList: null,
        resourceCardPropsList: null,
        subjectCardPropsList: null,
        setSortBy: null,
        setFilters: null,
      },
    }
    return props
  }, [followers])
  return [followersUIProps]
}