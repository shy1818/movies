const admin_model = require('../models/admin')
const { handleData } = require('../util')
const signup = async (req, res, next) => {
    
    // 先判断有没有这个用户 
    let _judge_result = await admin_model.judgeUserByUsername(req.body.username)
    
    if ( !_judge_result.length ) { // 如果没有这个用户
        if ( !req.body.nickname ) req.body.nickname = req.body.username
        // 注册
        let _data = await admin_model.signup(req.body)
        handleData(_data, res, 'admin')
    } else { // 如果有这个用户
        res.render('admin', {
            code: 201,
            data: JSON.stringify('用户名已存在')
        })
    }
    
}
const signin = async (req, res, next) => {
    // 先判断有没有这个用户 
    let _judge_result = await admin_model.judgeUserByUsername(req.body.username)
    
    if ( !!_judge_result.length ) { // 如果有这个用户
        // 登录
        let _data = await admin_model.signin(req.body.password, _judge_result[0])
        // 如果前端利用完整的表单提交逻辑的话，可以利用res.redirect告知浏览器进行跳转
        // res.redirect('/')
        if (_data) {
            // 登录成功后，保存session, 注意再这里存的东西不是为了给前端用的， 1. 用来验证 2. 存储一些用户信息做其他判断
            req.session.userinfo = {
                userid: _judge_result[0]._id,
                level: _judge_result[0].level || 7
            }
            res.render('admin', { code: 200, data: JSON.stringify('success') })

        } else {
            res.render('admin', { code: 203, data: JSON.stringify('密码错误') })
        }
        
    } else { // 如果没有这个用户
        res.render('admin', {
            code: 202,
            data: JSON.stringify('用户名不存在')
        })
    }
    
    
}


module.exports = {
    signup,
    signin
}