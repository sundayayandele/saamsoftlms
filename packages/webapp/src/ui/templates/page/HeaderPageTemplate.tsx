import { FC } from 'react'
import PageHeader, { PageHeaderProps } from '../../pages/PageHeader/PageHeader'
import '../../styles/view.scss'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  pageHeaderProps: PageHeaderProps
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ pageHeaderProps, children }) => {
  return (
    <MainPageWrapper>
      <PageHeader {...pageHeaderProps} />
      <div className={`view ${pageHeaderProps.headerProps.me ? "logged-in" : "logged-out"}`}>{children}</div>
    </MainPageWrapper>
  )
}
