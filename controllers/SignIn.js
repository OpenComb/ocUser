var util = require("./../lib/util.js") ;

module.exports = {

	view: "ocuser/templates/SignIn.html"

	, process: function(seed,nut)
	{
		nut.model.forward = seed.forward || '/' ;
		return true ;
	}

	, actions: {
		submit: function(seed,nut)
		{
			helper.db.coll("users")
				.find({username:seed.username})
				.toArray(this.hold(function(err,docs){

					if(err)
					{
						nut.message("系统遇到了错误。",null,'error') ;
						helper.log.error(err) ;
						return ;
					}

					if(!docs.length)
					{
						nut.message("输入的用户名无效。",null,'error') ;
						return ;
					}

					if( docs[0].password != util.encryptPassword(seed.password,docs[0]) )
					{
						nut.message("输入的密码不正确",null,'error') ;
						return ;
					}

					nut.model.before = this.req.session.idmgr.current() ;

					this.req.session.idmgr.signin(docs[0],true) ;

					nut.message("登陆成功 :)",null,'success') ;
					nut.model.signined = docs[0] ;
					nut.model.now = this.req.session.idmgr.current() ;

					if(seed.forward)
					{
						this.location(seed.forward) ;
					}
					else
					{
						nut.view.disable() ;
					}
				})) ;
		}
	}
}
