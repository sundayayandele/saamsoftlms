import { Card, Loading, PrimaryButton, TertiaryButton } from '@moodlenet/react-app/ui.mjs'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { FC, ReactNode, ReactPortal, useCallback, useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
// import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { searchNpmExtensionInfo } from '../../../../../helpers/utilities'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { CoreExt } from '@moodlenet/core'
import rehypeRaw from 'rehype-raw'
import { SearchPackagesResObject } from '../../types/data.mjs'
import { mandatoryPackages } from '../fakeData.js'
import { MainContext } from '../MainComponent.js'
import './ExtensionInfo.scss'

export type ExtensionInfoProps = {
  isInstalling: boolean
  toggleIsInstalling(): unknown
  searchPackagesResObject: SearchPackagesResObject
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({
  isInstalling,
  toggleIsInstalling,
  searchPackagesResObject,
  onClickBackBtn,
}) => {
  const { pkgs } = useContext(MainContext)
  const [myPkg] = pkgs
  const [readme, setReadme] = useState('')
  useEffect(() => {
    fetch(
      `${searchPackagesResObject.registry}/${searchPackagesResObject.pkgName}` /* ${
        searchPackagesResObject.version ? `/${searchPackagesResObject.version}` : ''
      }` */,
    )
      .then(_ => _.json())
      .then(({ readme }) => setReadme(readme))
  }, [searchPackagesResObject.registry, searchPackagesResObject.pkgName, searchPackagesResObject.version])
  // const stateContext = useContext(StateContext)

  // const modulesList = extension?.modules.map(
  //   (module: Module, i) =>
  //     (!module.mandatory || stateContext?.devMode) && (
  //       <div className="module" key={i}>
  //         <div className="name">{module.name}</div>
  //         <Switch enabled={module.enabled} mandatory={module.mandatory} />
  //       </div>
  //     ),
  // )

  const install_uninstall = useCallback(() => {
    toggleIsInstalling()
    searchPackagesResObject.installed
      ? myPkg.call('uninstall')({
          pkgId: searchPackagesResObject.pkgId,
        })
      : myPkg.call('install')({
          installPkgReq: searchPackagesResObject.installPkgReq,
        })

    // promise.finally(toggleIsInstalling)
  }, [searchPackagesResObject])

  type CodeBlockProps = {
    node: any
    children: ReactNode & ReactNode[]
    inline?: boolean | undefined
    className?: string | undefined
  }
  const CodeBlock = {
    code({ node, inline, className, children, ...props }: CodeBlockProps) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter /* style={vscDarkPlus} */ language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        ((
          <code className={className} {...props}>
            {children}
          </code>
        ) as ReactPortal)
      )
    },
  }

  return (
    <div className="extension-info">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {searchPackagesResObject.description.split('\n')[0]}
          </div>
          <PrimaryButton
            className={`install-btn ${isInstalling ? 'loading' : ''}`}
            noHover={isInstalling}
            disabled={mandatoryPackages.includes(searchPackagesResObject.pkgName)}
            onClick={install_uninstall}
          >
            <div className="loading" style={{ visibility: isInstalling ? 'visible' : 'hidden' }}>
              <Loading color="white" />
            </div>
            <div className="label" style={{ visibility: isInstalling ? 'hidden' : 'visible' }}>
              {searchPackagesResObject.installed ? 'Uninstall' : 'Install'}
            </div>
          </PrimaryButton>
        </div>

        <div>{searchPackagesResObject.pkgName}</div>
      </Card>
      {readme && (
        <Card>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
            {readme}
          </ReactMarkdown>
        </Card>
      )}
    </div>
  )
}
ExtensionInfo.displayName = 'ExtensionInfo'
export default ExtensionInfo
