
/**
 * 
 * @param {Array} allRoutes 整个页面完整的路由
 * @param {Array} menuList  从服务器获取的用户菜单名
 */

const recursionRoutes = (allRoutes = [], menuList = []) => {
    let userRoutes = [];//最后对比的结果放到这个数组中
    allRoutes.forEach(item => {
        menuList.forEach(v => {
            if (item.meta.name === v.name) {
                if (v.children && v.children.length > 0) {
                    item.children = recursionRoutes(item.children, v.children)
                }
                userRoutes.push(item)
            }
        })
    })
    return userRoutes
}

export default recursionRoutes