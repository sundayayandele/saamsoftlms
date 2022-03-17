import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import FilterNoneIcon from '@material-ui/icons/FilterNone'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import PersonIcon from '@material-ui/icons/Person'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { Href, Link } from '../../../../elements/link'
import { withCtrl } from '../../../../lib/ctrl'
import defaultBackgroud from '../../../../static/img/default-background.svg'
import '../../../../styles/tags.scss'
import Card from '../../../atoms/Card/Card'
import { Visibility } from '../../../atoms/VisibilityDropdown/VisibilityDropdown'
import './styles.scss'

export type CollectionCardProps = {
  toggleVisible?(): unknown
  imageUrl: string | null
  title: string
  visibility: Visibility
  collectionHref: Href
  isAuthenticated: boolean
  isOwner: boolean
  bookmarked: boolean
  following: boolean
  numFollowers: number
  numResource: number
  isEditing?: boolean
  toggleFollow?: () => unknown
  toggleBookmark?: () => unknown
}

export const CollectionCard = withCtrl<CollectionCardProps>(
  ({
    imageUrl,
    title,
    toggleVisible,
    visibility,
    isAuthenticated,
    isOwner,
    bookmarked,
    following,
    numFollowers,
    numResource,
    toggleBookmark,
    toggleFollow,
    collectionHref,
  }) => {
    const background = {
      background:
        'linear-gradient(1deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 37%, rgba(0, 0, 0, 0.54) 100%), url(' +
        (imageUrl || defaultBackgroud) +
        ')',
      backgroundSize: 'cover',
    }

    return (
      <Card
        className={`collection-card ${
          isOwner && visibility === 'Private' ? 'is-private' : ''
        }`}
        style={{ ...background }}
        hover={true}
      >
        <div className={`collection-card-header`}>
          <div className="left">
            <div className="num-resources">
              <FilterNoneIcon />
              {numResource}
              {/* <Trans>{numResource} items</Trans> */}
            </div>
          </div>
          <div className="right">
            {isOwner && (
              <abbr
                onClick={toggleVisible}
                className={`visibility ${
                  visibility === 'Public' ? 'public' : 'private'
                }`}
                title={visibility}
              >
                {visibility === 'Public' ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </abbr>
            )}
            {isAuthenticated && (
              <div
                className={`bookmark ${bookmarked ? 'bookmarked' : ''}`}
                onClick={toggleBookmark}
              >
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </div>
            )}
            <div
              className={`follow ${following ? 'following' : ''} ${
                !isAuthenticated || isOwner ? 'disabled' : ''
              }`}
              {...(isAuthenticated && !isOwner && { onClick: toggleFollow })}
            >
              {following ? <PersonIcon /> : <PermIdentityIcon />}
              <span>{numFollowers}</span>
            </div>
          </div>
        </div>
        <Link href={collectionHref}>
          <abbr className="title" title={title}>
            {title}
          </abbr>
        </Link>
      </Card>
    )
  }
)
CollectionCard.displayName = 'CollectionCard'
CollectionCard.defaultProps = {}
