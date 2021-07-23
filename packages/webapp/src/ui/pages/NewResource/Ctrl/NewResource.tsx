import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { defaultOrganization } from '../../../lib/static-data'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewResourceProps } from '../NewResource'
import { useNewResourcePageUserDataQuery } from './NewResourceCtrl.gen'

export type NewResourceCtrlProps = { id: Id }
export const useNewResourceCtrl: CtrlHook<NewResourceProps, NewResourceCtrlProps> = ({ id }) => {
  const profileQ = useNewResourcePageUserDataQuery({ variables: { profileId: id } })

  const collectionCardPropsList = useMemo(
    () =>
      (profileQ.data?.node?.collections.edges || [])
        .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
        .filter(isJust)
        .map(({ id }) => ctrlHook(useCollectionCardCtrl, { id })),
    [profileQ.data?.node?.collections.edges],
  )

  const resourceCardPropsList = useMemo(
    () =>
      (profileQ.data?.node?.resources.edges || [])
        .map(edge => (edge.node.__typename === 'Resource' ? edge.node : null))
        .filter(isJust)
        .map(({ id }) => ctrlHook(useResourceCardCtrl, { id })),
    [profileQ.data?.node?.resources.edges],
  )
  const profile = profileQ.data?.node?.__typename === 'NewResource' ? profileQ.data?.node : null
  const profileProps = useMemo<NewResourceProps | null>(
    () =>
      profile
        ? {
            headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
            resourceCardPropsList,
            collectionCardPropsList,
            overallCardProps: {
              followers: profile.followersCount,
              resources: profile.resourcesCount,
              years: 1,
              kudos: 10,
            },
            profileCardProps: {
              avatarUrl:
                getMaybeAssetRefUrl(profile.icon) ?? `https://picsum.photos/seed/${id.split('/')[1]}_avatar/200/300`,

              backgroundUrl: `https://picsum.photos/seed/${id.split('/')[1]}_bg/600/400`,
              description: profile.summary,
              firstName: profile.name,
              lastName: profile.name,
              location: 'Barcelona',
              organizationName: defaultOrganization.name,
              siteUrl: 'www.juanito.example',
              username: profile.name,
            },
            username: profile.name,
          }
        : null,
    [collectionCardPropsList, id, profile, resourceCardPropsList],
  )
  return profileProps && [profileProps]
}
