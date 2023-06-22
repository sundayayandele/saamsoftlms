import { ContentBackupImages } from '../assets/data/images.js'

export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  },
): boolean => {
  const boundingClient = el.getBoundingClientRect()
  const { left, right, bottom } = boundingClient
  let { top } = boundingClient

  const height = bottom - top
  const width = right - left
  if (options?.marginTop) {
    top = top - options.marginTop
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  )
}

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const fileExceedsMaxUploadSize = (size: number, max: number | null) =>
  max === null ? false : size > max

export const isPositionedItem = <T extends { position: number }>(
  toBeDetermined: unknown,
): toBeDetermined is T => {
  const toDetermine = (toBeDetermined as T).position
  if (toDetermine || toDetermine === 0) {
    return true
  }
  return false
}

export const isItem = (
  toBeDetermined: object | undefined | false | null,
): toBeDetermined is object => {
  const toDetermine = toBeDetermined as object
  if (toDetermine || toDetermine === 0) {
    return true
  }
  return false
}

export const getNumberFromString = (s: string) =>
  parseInt(
    s
      .split('')
      .map(l => {
        return l.charCodeAt(0)
      })
      .join(''),
    10,
  )

export const getBackupImage = (id: string): string | undefined => {
  const numId = getNumberFromString(id)
  // console.log('IMAGE', ContentBackupImages[numId % ContentBackupImages.length])
  const location = ContentBackupImages[numId % ContentBackupImages.length]?.location
  return typeof location === 'string' ? location : undefined
}

export const downloadOrOpenURL = (url: string, filename: string | null) => {
  const link = document.createElement('a')
  link.href = url
  if (filename) {
    link.download = filename
  }
  link.target = '_blank'
  link.rel = 'noreferrer'
  console.log('link: ', link)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  link.remove()
}

export const checkIfURL = (possibleUrl: string): boolean => {
  let url
  try {
    url = new URL(possibleUrl)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const validURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(str)
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const transformPropsToObjectWithKey = <T,>(
  element: T,
  key: number | string,
): { props: T; key: string } => {
  return { props: element, key: key.toString() }
}

// export const isAddonItem = (
//   toBeDetermined: AddonItem | undefined | false | null,
// ): toBeDetermined is AddonItem => {
//   const toDetermine = toBeDetermined as AddonItem
//   if (toDetermine || toDetermine === 0) {
//     return true
//   }
//   return false
// }

// export const isAddonPositionedItem = (
//   toBeDetermined: AddonItem | undefined | false | null,
// ): toBeDetermined is AddonPositionedItem => {
//   const toDetermine = toBeDetermined as AddonPositionedItem
//   if (toDetermine || toDetermine === 0) {
//     return true
//   }
//   return false
// }

// const iterateIndex = (list: number[], index: number): number =>
//   list.includes(index) ? iterateIndex(list, index + 1) : index

// // type WithProperty<T> = T & { [key: string]: unknown }
// type WithPosition<T> = T & { position: number }

// export const positionItems = <T extends object>(items: T[]): WithPosition<T>[] => {
//   const positions: number[] = items
//     .map(item => isPositionedItem(item) && item.position)
//     .filter((pos): pos is number => Number.isInteger(pos))
//   let index = 0
//   return items.map(item => {
//     if (isPositionedItem(item)) {
//       return item
//     } else {
//       const newIndex = iterateIndex(positions, index)
//       index = newIndex + 1
//       return { ...item, position: newIndex }
//     }
//   })
// }

// export const positionAddonItems = (items: AddonItem[]): AddonPositionedItem[] => {
//   const positions: number[] = items
//     .map(item => isPositionedItem(item) && item.position)
//     .filter((pos): pos is number => Number.isInteger(pos))
//   let index = 0
//   return items.map(item => {
//     if (isPositionedItem(item)) {
//       return item
//     } else {
//       const newIndex = iterateIndex(positions, index)
//       index = newIndex + 1
//       return { Item: item, position: newIndex }
//     }
//   })
// }

// export const sortItems = <T extends { position: number }>(items: T[]): T[] => {
//   return items.sort((a, b) => a.position - b.position)
// }

// export const addonPositionedItemToReactElements = (
//   items: AddonPositionedItem[],
// ): ReactElement[] => {
//   return items.map(item => item.Item)
// }

// export const addonItemToReactElements = (items: AddonItem[]): ReactElement[] => {
//   console.log('convert items:', items)
//   return items.map(item => {
//     // isAddonPositionedItem(item)
//     if (isAddonPositionedItem(item)) {
//       return item.Item
//     } else if (isAddonItem(item)) {
//       return item
//     } else {
//       return <></>
//     }
//   })
// }

// export const sortAnyItems = <T extends object>(items: T[]): WithPosition<T>[] => {
//   return sortItems(positionItems(items.filter(isItem)))
// }

// export const sortAddonItems = (items: (AddonItem | undefined | false | null)[]): ReactElement[] => {
//   return addonPositionedItemToReactElements(
//     sortItems(positionAddonItems(items.filter(isAddonItem))),
//   )
// }
