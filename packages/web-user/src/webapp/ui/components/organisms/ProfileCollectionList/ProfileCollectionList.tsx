import type { CollectionCardProps } from '@moodlenet/collection/ui'
import { CollectionCard } from '@moodlenet/collection/ui'
import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { LibraryAdd } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import './ProfileCollectionList.scss'

export type ProfileCollectionListProps = {
  collectionCardPropsList: { key: string; collectionCardProps: ProxyProps<CollectionCardProps> }[]
  createCollection(): void
  canEdit: boolean
}

export const ProfileCollectionList: FC<ProfileCollectionListProps> = ({
  collectionCardPropsList,
  createCollection,
  canEdit,
}) => {
  // const [windowWidth, /* _isShowingSmallCard */ setIsShowingSmallCard] = useState<boolean>(false)

  // const setIsShowingSmallCardHelper = () => {
  //   setIsShowingSmallCard(window.innerWidth < 550 ? true : false)
  // }

  // useLayoutEffect(() => {
  //   window.addEventListener('resize', setIsShowingSmallCardHelper)
  //   return () => {
  //     window.removeEventListener('resize', setIsShowingSmallCardHelper)
  //   }
  // }, [])

  const listCard = (
    <ListCard
      className="profile-collection-list"
      header={`Curated collections`}
      content={useMemo(
        () =>
          collectionCardPropsList.map(({ collectionCardProps, key }) => (
            <CollectionCard key={key} {...collectionCardProps} />
          )),
        [collectionCardPropsList],
      )}
      actions={
        canEdit
          ? {
              element: (
                <PrimaryButton className="action" onClick={createCollection}>
                  <LibraryAdd />
                  New collection
                </PrimaryButton>
              ),
              position: 'end',
            }
          : undefined
      }
    ></ListCard>
  )

  return (canEdit || collectionCardPropsList.length > 0) && window.innerWidth ? listCard : null
}

ProfileCollectionList.defaultProps = {}

export default ProfileCollectionList
