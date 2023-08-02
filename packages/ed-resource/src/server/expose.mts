import { shell } from './shell.mjs'

import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import {
  assertRpcFileReadable,
  readableRpcFile,
  RpcStatus,
  setRpcStatusCode,
} from '@moodlenet/core'
import { defaultImageUploadMaxSize, getWebappUrl } from '@moodlenet/react-app/server'
import {
  creatorUserInfoAqlProvider,
  getCurrentSystemUser,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import { boolean, object } from 'yup'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { ResourceRpc } from '../common/types.mjs'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { env } from './init/env.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { getImageAssetInfo, getImageUrl } from './lib.mjs'
import {
  createResource,
  delResource,
  delResourceFile,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getResourceLogicalFilename,
  getResourcesCountInSubject,
  incrementResourceDownloads,
  patchResource,
  RESOURCE_DOWNLOAD_ENDPOINT,
  searchResources,
  setPublished,
  setResourceContent,
  setResourceImage,
} from './services.mjs'

export type FullResourceExposeType = PkgExposeDef<ResourceExposeType & ServerResourceExposeType>

const validationsConfig: ValidationsConfig = {
  contentMaxUploadSize: env.resourceUploadMaxSize,
  imageMaxUploadSize: defaultImageUploadMaxSize,
}
const {
  contentValidationSchema,
  // imageValidationSchema,
  draftResourceValidationSchema,
  // publishedResourceValidationSchema,
} = getValidationSchemas(validationsConfig)

export const expose = await shell.expose<FullResourceExposeType>({
  rpc: {
    'webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        return { validations: validationsConfig }
      },
    },
    'webapp/set-is-published/:_key': {
      guard: _ =>
        object({
          publish: boolean().required(),
        }).isValid(_),
      fn: async ({ publish }, { _key }) => {
        const patchResult = await setPublished(_key, publish)
        if (!patchResult) {
          return
        }
        return
      },
    },
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const found = await getResource(_key, {
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!found) {
          return null
        }
        const image = getImageAssetInfo(found.entity.image)

        const contentUrl = !found.entity.content
          ? null
          : found.entity.content.kind === 'file'
          ? await getResourceFileUrl({ _key, rpcFile: found.entity.content.fsItem.rpcFile })
          : found.entity.content.url

        const resourceRpc: ResourceRpc = {
          contributor: {
            avatarUrl: found.contributor.iconUrl,
            creatorProfileHref: {
              url: found.contributor.homepagePath,
              ext: false,
            },
            displayName: found.contributor.name,
            timeSinceCreation: found.meta.created,
            // avatarUrl: found.contributor?.iconUrl ?? null,
            // creatorProfileHref: {
            //   url: 'google.it',
            //   ext: true,
            // },
            // displayName: 'contributor.name',
            // timeSinceCreation: shell.now().toString(),
          },
          resourceForm: {
            description: found.entity.description,
            title: found.entity.title,
            license: found.entity.license,
            subject: found.entity.subject,
            language: found.entity.language,
            level: found.entity.level,
            month: found.entity.month,
            year: found.entity.year,
            type: found.entity.type,
          },
          data: {
            contentType: found.entity.content?.kind ?? 'link',
            contentUrl,
            downloadFilename:
              found.entity.content?.kind === 'file'
                ? found.entity.content.fsItem.rpcFile.name
                : null,
            id: found.entity._key,
            mnUrl: getWebappUrl(getResourceHomePageRoutePath({ _key, title: found.entity.title })),
            image,
            subjectHref: found.entity.subject
              ? href(
                  getSubjectHomePageRoutePath({
                    _key: found.entity.subject,
                    title: found.entity.subject,
                  }),
                )
              : null,
          },
          state: { isPublished: found.entity.published },
          access: {
            canDelete: !!found.access.d,
            canEdit: !!found.access.u,
            canPublish: found.canPublish,
            isCreator: found.isCreator,
          },
        }

        return resourceRpc
      },
    },
    'webapp/edit/:_key': {
      guard: body =>
        (body.values = draftResourceValidationSchema.validateSync(body.values, {
          stripUnknown: true,
        })),
      fn: async ({ values }, { _key }) => {
        const patchResult = await patchResource(_key, values)
        if (!patchResult) {
          return //throw ?
        }
        return
      },
    },
    'basic/v1/create': {
      guard: body => {
        contentValidationSchema.validateSync({ content: body?.resource })
        draftResourceValidationSchema.validateSync({
          description: body.description,
          title: body.name,
        })
      },
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }

        const createResult = await createResource({
          title: name,
          description,
        })

        if (!createResult) {
          throw RpcStatus('Unauthorized')
        }

        const setResourceResult = await setResourceContent(createResult._key, resourceContent)

        if (!setResourceResult) {
          await delResource(createResult._key)
          throw RpcStatus('Unauthorized')
        }

        setRpcStatusCode('Created')
        return {
          _key: createResult._key,
          description: createResult.description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: createResult._key, title: createResult.title }),
          ),
          name: createResult.title,
          url: setResourceResult.contentUrl,
        }
      },
      bodyWithFiles: {
        fields: {
          '.resource': 1,
        },
        maxSize: env.resourceUploadMaxSize,
      },
    },
    'webapp/create': {
      guard: () => void 0,
      fn: async () => {
        const createResult = await createResource({})
        if (!createResult) {
          throw RpcStatus('Unauthorized')
        }
        return {
          _key: createResult._key,
        }
      },
    },
    'webapp/delete/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const delResult = await delResource(_key)
        if (!delResult) {
          return
        }
        const imageLogicalFilename = getImageLogicalFilename(_key)
        await publicFiles.del(imageLogicalFilename)
        if (delResult.entity.content?.kind === 'file') {
          await delResourceFile(_key)
        }
        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: () => void 0,
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const updateRes = await setResourceImage(_key, uploadedRpcFile)
        const imageUrl = updateRes?.patched.image && getImageUrl(updateRes.patched.image)
        return imageUrl ?? null
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
        maxSize: defaultImageUploadMaxSize,
      },
    },
    'webapp/upload-content/:_key': {
      guard: () => void 0,
      async fn({ content: [uploadedContent] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        // shell.log('info', { uploadedContent })
        if (!uploadedContent) {
          await delResourceFile(_key)
          await patchResource(_key, {
            content: null,
          })
          return null
        }
        const storeContentResult = await setResourceContent(_key, uploadedContent)
        if (!storeContentResult) {
          throw RpcStatus('Unauthorized')
        }
        return storeContentResult.contentUrl
      },
      bodyWithFiles: {
        fields: {
          '.content': 1,
        },
        maxSize: env.resourceUploadMaxSize,
      },
    },
    'webapp/get-resources-count-in-subject/:subjectKey': {
      guard: () => void 0,
      async fn(_, { subjectKey }) {
        const count = await getResourcesCountInSubject({ subjectKey })
        return count ?? { count: 0 }
      },
    },
    [RESOURCE_DOWNLOAD_ENDPOINT]: {
      guard: () => void 0,
      async fn(_, { _key }: { _key: string }) {
        const resourceLogicalFilename = getResourceLogicalFilename(_key)
        const fsItem = await resourceFiles.get(resourceLogicalFilename)
        if (!fsItem) {
          throw RpcStatus('Not Found')
        }
        const readable = await assertRpcFileReadable(fsItem.rpcFile)

        readable.on('end', async () => {
          const currentSysUser = await getCurrentSystemUser()
          shell.events.emit('resource:downloaded', { resourceKey: _key, currentSysUser })
          incrementResourceDownloads({ _key })
        })
        return readableRpcFile({ ...fsItem.rpcFile }, () => readable)
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(body = {}, __, { limit, sortType, text, after }) {
        const { filters } = body
        const { endCursor, list } = await searchResources({
          limit,
          sortType,
          text,
          after,
          filters,
        })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})

type ServerResourceExposeType = {
  rpc: {
    [RESOURCE_DOWNLOAD_ENDPOINT](
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
    'basic/v1/create'(body: {
      name: string
      description: string
      resource: string | [RpcFile]
    }): Promise<{
      _key: string
      name: string
      description: string
      url: string
      homepage: string
    }>
  }
}
