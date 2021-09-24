import { t, Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { MainPageWrapper, MainPageWrapperProps } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type NewPasswordFormValues = { newPassword: string }
export type NewPasswordProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<NewPasswordFormValues>
  newPasswordErrorMessage: string | null
}

export const NewPassword = withCtrl<NewPasswordProps>(
  ({ mainPageWrapperProps, accessHeaderProps, newPasswordErrorMessage, formBag }) => {
    const [form, attrs] = formBag
    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        <div className="new-password-page">
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div className="main-content">
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Update password</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <input
                    className="password"
                    type="password"
                    placeholder={t`New password`}
                    {...attrs.newPassword}
                    onChange={form.handleChange}
                  />
                  {newPasswordErrorMessage && <div className="error">{newPasswordErrorMessage}</div>}
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton onClick={form.submitForm}>
                      <Trans>Change password</Trans>
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  },
)
NewPassword.displayName = 'SignUpPage'