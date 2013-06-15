var IdManager = require("./lib/IdManager.js") ;
var util = require("./lib/util.js") ;
var Controller = require("ocframework/lib/mvc/Controller.js") ;

exports.rootDefaultPassword = '111111' ;

exports.onload = function(app){

	var userdoc = {
		username:'root'
		, nickname:'administrator'
		, createTime: (new Date()).toISOString()
	}

	userdoc.password = util.encryptPassword( exports.rootDefaultPassword, userdoc ) ;

    // 插入 root 账号
    helper.db.coll('users').insert(
	    userdoc
        , {safe:true}
        , function(err){
            if(!err)
            {
                helper.log.info("创建默认账号:root,密码:111111") ;
            }
        }
    ) ;


    // 数据表 建立索引,
    function callback(err){ err && console.log(err) ; }
    helper.db.client.ensureIndex('ocuser/users',{username:-1},  {background: true,unique:true}, callback) ;
    helper.db.client.ensureIndex('ocuser/users',{nickname:-1},  {background: true}, callback) ;
    helper.db.client.ensureIndex('ocuser/users',{groups:-1},  {background: true}, callback) ;
    helper.db.client.ensureIndex('ocuser/groups',{path:-1}, {background: true}, callback) ;

    // 在 session 之后增加 id manager middleware
    app.on('use-connect-middleware.after',function(name,connect){
        if(name=='session')
        {
            connect.use(IdManager.middleware) ;
        }
    }) ;

    // 插入控制器
	helper.log.trace("befor merge controller: ocframework/lib/mvc/controllers/layout/WebLayout.js & ocuser/lib/MiniUserPad.js as userpad") ;
    helper.controller.append(
        "ocframework/lib/mvc/controllers/layout/WebLayout.js"
        , "ocuser/lib/MiniUserPad.js"
        , "userpad"
        , this.hold()
    ) ;

    //插入 view
    helper.template("ocframework/templates/WebLayout.html",this.hold(function(err,tpl){

        if(err) throw err ;

	    helper.log.trace("before template weave") ;
        tpl.$(".header-right").prepend('<div class="header-userpad" style="float:right"><view name="userpad" /></div>') ;

	    // 重新编译模板
	    tpl.compile() ;
    })) ;

	// control panel menu items
	helper.template("ocframework/templates/ControlPanel.html",this.hold(function(err,tpl){

		if(err) throw err ;

		tpl.$("#sidemenu").prepend(
			'<li id="sidemenu-item-user">'
				+ '<h3>用户</h3>'
				+ '<ul class="toggle">'
					+ '<li><i class="icon-group"></i> <a class="stay" href="/ocuser/UserList">浏览用户</a></li>'
				+ '</ul>'
			+ '</li>'
		) ;

		tpl.compile() ;
	})) ;


    // 注册控制器的别名
    Controller.registerAlias('signin','ocuser/lib/SignIn.js') ;
    Controller.registerAlias('signup','ocuser/lib/SignUp.js') ;
    Controller.registerAlias('signout','ocuser/lib/SignOut.js') ;
}