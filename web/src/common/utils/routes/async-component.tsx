import React, { createElement } from 'react'
import { Spin } from 'antd'
import type { RouteProps } from 'react-router-dom'

// /* webpackPrefetch: true */告诉浏览器闲置时加载，适用于将来某些导航下可能需要的资源，比如路由组件
// /* webpackPreload: true */告诉浏览器并行加载，适用当前页面需要但又不要求第一时间同步加载的资源，比如富文本组件

// LazyComponent 用函数组件，会出现这样的报错，只能改为class组件
// Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: <div />. Did you accidentally export a JSX literal instead of a component?

// export function asyncComponent<T = RouteProps['component']>(importedComponent: () => Promise<{ default: T }>): T {
//   const LazyComponent: FC<any> = (props) => {
//     const [component, setComponent] = useState<T>(null)

//     useEffect(() => {
//       ;(async () => {
//         const componentRes = await importedComponent()
//         setComponent(componentRes?.default)
//       })()
//     }, [])

//     if (!component) return <Spin />

//     const result = createElement(component as any, props)

//     // const result = typeof component === 'function' ? component() : createElement(component as any, props)
//     // const result = createElement(typeof component === 'function' ? component() : (component as any), props)

//     return (result as unknown) as ReactElement<any, any> | null
//   }
//   return (LazyComponent as unknown) as T
// }

function asyncComponent<T = RouteProps['component']>(importedComponent: () => Promise<{ default: T }>): T {
  class LazyComponent extends React.Component<unknown, { component: T }> {
    constructor(props) {
      super(props)
      this.state = {
        component: null,
      }
    }

    async componentDidMount() {
      const componentRes = await importedComponent()
      this.setState({ component: componentRes?.default })
    }

    render() {
      const { component } = this.state
      if (!component) {
        return (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Spin />
          </div>
        )
      }
      return createElement(component as any, this.props)
    }
  }
  return (LazyComponent as unknown) as T
}

export default asyncComponent
