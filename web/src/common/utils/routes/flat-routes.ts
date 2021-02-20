import type { RouteConfig } from '@common/types'

function flatRoutes(routes: RouteConfig[] = [], userAuthPoints?: string[]): Omit<RouteConfig, 'routes'>[] {
  return routes.reduce((flattedRoutes, route) => {
    const { authPoints, authOperator = 'or' } = route
    if (Array.isArray(authPoints) && Array.isArray(userAuthPoints)) {
      const isPass: boolean =
        (authOperator === 'or' && userAuthPoints.some((userAuthPoint) => authPoints.includes(userAuthPoint))) ||
        (authOperator === 'and' && authPoints.length > 0 && authPoints.every((authPoint) => userAuthPoints.includes(authPoint)))
      if (!isPass) return flattedRoutes
    }
    flattedRoutes = [...flattedRoutes, route, ...flatRoutes(route.routes, userAuthPoints)]
    return flattedRoutes
  }, [])
}

export default flatRoutes
