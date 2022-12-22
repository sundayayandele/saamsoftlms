import { CSSProperties, FC, ReactNode } from 'react'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import {
  MinimalisticHeader,
  MinimalisticHeaderProps,
} from '../../organisms/Header/Minimalistic/MinimalisticHeader.js'
import './SimpleLayout.scss'
// import { StateContext } from './Providers'

export type SimpleLayoutProps = {
  headerProps: MinimalisticHeaderProps
  style?: CSSProperties
  contentStyle?: CSSProperties
  children?: ReactNode
}

export const SimpleLayout: FC<SimpleLayoutProps> = ({
  headerProps,
  style,
  contentStyle,
  children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)

  return (
    <div className="simple-layout" style={style}>
      <MinimalisticHeader {...headerProps} />
      {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
      <div style={contentStyle} className="content">
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

SimpleLayout.defaultProps = {}
export default SimpleLayout