import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Img } from '@react-email/img'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import type React from 'react'

export type EmailActionBtnProps = {
  title: string
  url: string
  buttonStyle?: React.CSSProperties
}

export type EmailOrganizationProps = {
  name: string
  logoOnClickUrl: string
  logoSrc: string
  location?: {
    address: string
    url: string
  }
  copyright?: string
}

export type EmailContentProps = {
  subject: string
  receiverEmail: string
  title: React.ReactNode
  body: React.ReactNode
  hideIgnoreMessage?: boolean
  action?: EmailActionBtnProps
}
export type EmailLayoutProps = {
  organization: EmailOrganizationProps
  content: EmailContentProps
}

export const EmailLayout = ({ organization, content }: EmailLayoutProps) => {
  return (
    <Html lang="en" className="html">
      <Head />
      <Preview>{content.subject}</Preview>
      <div className="body" style={bodyStyle}>
        <Container className="container" style={containerStyle}>
          <Section className="logo-header">
            <a href={organization.logoOnClickUrl} target="_blank" rel="noreferrer" style={logo}>
              <Img width={162} src={organization.logoSrc} />
            </a>
          </Section>
          <Section className="title" style={titleSection}>
            <Text style={titleText}>{content.title}</Text>
          </Section>
          <Section className="content" style={contentSection}>
            <div style={contentText}>{content.body}</div>
          </Section>
          {content?.action && (
            <Section className="action" style={{ ...actionSection }}>
              <Button
                className="action-button"
                href={content.action.url}
                target="_blank"
                style={{ ...actionButton, ...content.action.buttonStyle }}
              >
                {content.action.title}
              </Button>
            </Section>
          )}
          {content?.hideIgnoreMessage ? (
            <div style={separatorStyle} />
          ) : (
            <div style={ignoreMessage}>Not you? Just ignore this message</div>
          )}
        </Container>
        <Container style={containerBottom}>
          {organization.location && (
            <a
              href={organization.location.url}
              target="_blank"
              rel="noopener noreferrer"
              style={addressButton}
            >
              {organization.location.address}
            </a>
          )}
          <div style={copyrightStyle}>
            {organization.copyright}
            <br />
            This email was intended for {content.receiverEmail}. This is a service email.
          </div>
        </Container>
      </div>
    </Html>
  )
}

export default EmailLayout

const bodyStyle: React.CSSProperties = {
  minHeight: '100%',
  backgroundColor: '#f1f1f1',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '32px 10px',
}

const containerStyle: React.CSSProperties = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  backgroundColor: '#ffffff',
  borderRadius: '8px 8px 0 0',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 16px 48px',
  textAlign: 'center',
}

const containerBottom: React.CSSProperties = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  borderRadius: '0 0 8px 8px',
  backgroundColor: '#f7fafa',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 48px 48px',
}

const logo: React.CSSProperties = {
  width: 'fit-content',
  margin: '0 auto 16px auto',
  display: 'block',
}

const titleSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '14px 0',
}

const titleText: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
}

const contentSection: React.CSSProperties = {
  background: '#f5f5f5',
  padding: '28px',
  color: '#282828',
  borderRadius: '18px',
  boxShadow: '2px 2px #0000003b',
  textAlign: 'center',
}

const contentText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '28px',
}

const actionSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0 0 0',
}

const actionButton: React.CSSProperties = {
  padding: '14px 20px',
  display: 'inline-block',
  borderRadius: '48px',
  background: '#f88012',
  color: '#ffffff',
  fontSize: '15px',
}

const ignoreMessage: React.CSSProperties = {
  textAlign: 'center',
  color: '#999999',
  fontSize: '12px',
  lineHeight: '150%',
  margin: '58px 0 10px 0',
  padding: '0',
}

const separatorStyle: React.CSSProperties = {
  padding: '25px',
}

const addressButton: React.CSSProperties = {
  display: 'block',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'center',
  color: '#17bebb',
  margin: '10px 0',
  padding: '0',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  lineHeight: '150%',
}

const copyrightStyle: React.CSSProperties = {
  margin: '10px 0',
  padding: '0',
  color: '#656565',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  lineHeight: '150%',
  textAlign: 'center',
}
