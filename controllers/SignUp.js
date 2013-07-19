var util = require("./../lib/util.js") ;

module.exports = {

	view: "ocuser/templates/SignUp.html"

	, actions:
	{
		hi: function(){}

		, save: function save(seed,nut)
		{
			var former = this.former().fillForm(this.seed) ;

			if(!seed.username || !seed.password)
			{
				nut.error("请输入用户名和密码。") ;
				return ;
			}
			if( seed.password!=seed['password_repeat'])
			{
				nut.error("两次密码输入不一致。") ;
				return ;
			}

			// 教研用户提交的数据
			if(!former.validate())
				return ;

			former.save({
				"msg.insert.duplicate": "用户名已经存在，请换用其他的用户名。"
				, "msg.insert.success": "注册成功"
				, "msg.insert.error": "用户注册遇到了错误"
				, before: function(doc){
					delete doc['password_repeat'] ;
					doc.nickname || (doc.nickname=doc.username) ;
					doc.createTime = (new Date()).toISOString() ;
					doc.password = util.encryptPassword(seed.password,doc) ;
				}
				, done: this.hold(function(err,doc){
					if(!err)
						nut.view.disable() ;
				})
			}) ;

		}
	}
}