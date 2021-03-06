import SMERouter from 'sme-router'
// bus工具
import bus from '../util/bus'
// 首页视图
import home_template from '../views/home.html'
// 404视图
import not_found_template from '../views/404.html'

// position 控制器
import position_controller from '../controllers/position'
// map 控制器
import map_controller from '../controllers/map'
// page-header 控制器
import page_header_controller from '../controllers/page-header'

// page-header model
import page_header_model from '../models/page-header'

var router = null

// 记录上一次路由跳转的url
var prevUrl = ''

// 启动路由的方法
const _init = () => {
    // 实例化路由工具
    router = new SMERouter('router-view')

    // 处理page-header
    

    // 中间件会先执行 为导航按钮添加高亮样式
    router.use((req, res, next) => {
        _activeLink(req.route)
    })

    // 保证都能匹配到，中间都能执行
    router.route('/', renderPageHeader)

    // 开始匹配各个路由
    router.route('/home', (req, res, next) => { // 当路由切换进来的时候执行
        res.render(home_template)
    })
    
    // 职位列表路由
    router.route('/position-list', position_controller.list)
    // 保存职位路由
    router.route('/position-save', position_controller.save)
    
    router.route('/position-update', position_controller.update)
    
    // 地图
    router.route('/map', map_controller.map)



    // 404路由
    router.route('/not-found', (req, res, next) => { // 当路由切换进来的时候执行
        res.render(not_found_template)
        _navLink('.not-found a[to]')
    })

    //上面的没有匹配到就会跳转404路由或者首页
    // router.route('*', (req, res, next) => {
    //     if ( req.url === '' ) { // 刚进入项目，没有hash值，重定向到home
    //         res.redirect('/home')
    //     } else { // 如果路径匹配不到，导向404
    //         res.redirect('/not-found')
    //     }     
    // })

    // 因为在控制器中无法使用到router，所以给bus绑定事件，在其他模块中触发bus的事件
    bus.on('go', (path, body = {}) =>  router.go(path, body) )
    bus.on('back', () =>  router.back() )  
    

    // 给按钮添加事件
    _navLink()
}
// 渲染页面头部
const renderPageHeader = ( req, res, next ) => {
    if ( req.url === '/' ) {
        res.redirect('/home')
        return false;
    }
    // 这里的prevUrl就是上一次的URL
    page_header_controller.render(page_header_model.pageHeaderInfo(req.url, prevUrl))
    // 已经进入到当前路由了，将上一次路由改成当前的路由
    prevUrl = req.url
}

// 给导航按钮添加点击事件
const _navLink = (selector) => {
    let $navs = $(selector || '.sidebar-menu li.nav-link[to]')
    $navs.on('click', function () {
        let _path = $(this).attr('to')
        router.go(_path)
    })
}

// 给导航按钮添加不同的类名
// @param route 当前路由的hash值
const _activeLink = (route) => {
    let $navs = $('.sidebar-menu li[to]')
    $navs.removeClass('active')
    $navs.filter(`[to='${route}']`)
         .addClass('active')
           
}



export default {
    init: _init,
    navLink: _navLink
}

