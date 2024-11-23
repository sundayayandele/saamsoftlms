import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/webapp'
import { loginPageRoutePath } from '@moodlenet/web-user/common'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { shell } from '../../shell.mjs'
import type { NewPasswordProps } from './NewPassword.js'

export function useNewPasswordProps({ token }: { token: string }) {
  const nav = useNavigate()
  const footerProps = useFooterProps()
  const headerProps = useMinimalisticHeaderProps()
  const changePassword = useCallback(
    (password: string) => {
      shell.rpc
        .me('webapp/change-password-using-token')({ password, token })
        .then(({ success }) => {
          if (success) {
            nav(loginPageRoutePath())
          }
        })
    },
    [nav, token],
  )
  const props: NewPasswordProps = {
    footerProps,
    changePassword,
    headerProps,
  }
  return props
}
