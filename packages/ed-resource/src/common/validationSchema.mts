import { mixed, object, SchemaOf, string } from 'yup'
import { ResourceFormProps } from './types.mjs'
export const maxUploadSize = 1024 * 1024 * 50

export const validationSchema: SchemaOf<ResourceFormProps> = object({
  subject: string().required(/* t */ `Please select a subject`),
  // content: string().required(/* t */ `Please upload a content`),

  license: string().required('Please select a license'),
  // license: string().when('isFile', (isFile, schema) => {
  //   return isFile ? schema.required(/* t */ `Select a license`) : schema.optional()
  // }),
  // isFile: boolean().required(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
  // image: mixed()
  //   .test((v, { createError }) =>
  //     v instanceof Blob && v.size > maxUploadSize
  //       ? createError({
  //           message: /* t */ `The file is too big, reduce the size or provide a url`,
  //         })
  //       : true,
  //   )
  //   .optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(/* t */ `Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
  }),
})

export const contentValidationSchema: SchemaOf<{ content: File | string | undefined | null }> =
  object({
    content: string().required(`Please upload a content or a link`),
  })
