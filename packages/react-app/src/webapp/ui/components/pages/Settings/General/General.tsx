import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC } from 'react'
import { OrganizationDataType } from '../../../../../context/OrganizationCtx.js'
import './General.scss'

export type GeneralProps = {
  form: ReturnType<typeof useFormik<OrganizationDataType>>
}

export const GeneralMenu = <span>General</span>

export const General: FC<GeneralProps> = ({ form }) => {
  const canSubmit = !form.isSubmitting && !form.isValidating
  // const setCtx = useContext(SettingsCtx)

  // const form = useFormik<OrganizationData>({
  //   initialValues: setCtx.organizationData,
  //   async onSubmit(data) {
  //     setCtx.saveOrganization(data)
  //     // console.log('save data')
  //   },
  // })
  // useEffect(() => {
  //   form.setValues(setCtx.organizationData)
  // }, [form, setCtx.organizationData])

  return (
    <div className="general" key="general">
      <Card>
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
          <PrimaryButton className="save-btn" type="submit">
            Save
          </PrimaryButton>
        </div>
        <form onSubmit={canSubmit ? form.handleSubmit : undefined}>
          <div className="parameter">
            <div className="name">Site name</div>
            <div className="actions">
              <InputTextField
                className="instance-name"
                placeholder="Give a name to your site"
                value={form.values.instanceName}
                onChange={form.handleChange}
                name="instanceName"
                edit
                // error={shouldShowErrors && editForm.errors.displayName}
              />
            </div>
          </div>
          <div className="parameter">
            <div className="name">Landing page title</div>
            <div className="actions">
              <InputTextField
                textarea={true}
                className="landing-title"
                placeholder="Give a title to the landing page"
                value={form.values.landingTitle}
                onChange={form.handleChange}
                name="landingTitle"
                edit
                // error={shouldShowErrors && editForm.errors.displayName}
              />
            </div>
          </div>
          <div className="parameter">
            <div className="name">Landing page subtitle</div>
            <div className="actions">
              <InputTextField
                textarea={true}
                className="landing-subtitle"
                placeholder="Give a subtitle to the landing page"
                value={form.values.landingSubtitle}
                onChange={form.handleChange}
                name="landingSubtitle"
                edit
                // error={shouldShowErrors && editForm.errors.displayName}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
