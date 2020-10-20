//动态路由
let DynamicRoutes = [
    {
        path: '/',
        component: () => import(/*webpackChunkName:'Home' */ "../pages/Home"),
        children: []
    },
    {
        path: '*',
        component: () => import(/* webpackChunkName:'page404' */ '../pages/page404')
    }
]
export default DynamicRoutes