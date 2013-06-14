var util = require("./util.js") ;

module.exports = {

	view: "ocuser/templates/SignUp.html"

	, actions:
	{
		hi: function(){}

		, save: function(seed,nut)
		{
			this.former().fillForm(this.seed) ;

			if(!seed.username || !seed.password)
			{
				nut.message("请输入用户名和密码。",[],"error") ;
				return true ;
			}
			if( seed.password!=seed['password_repeat'])
			{
				nut.message("两次密码输入不一致",[],"error") ;
				return true ;
			}

			// 检查重复
			this.former().save(

				this.seed

				// before save
				, function(doc){
					delete doc['password_repeat'] ;
					doc.nickname || (doc.nickname=doc.username) ;
					doc.createTime = (new Date()).toISOString() ;
					doc.password = util.encryptPassword(seed.password,doc) ;

					console.log(doc) ;
				}

				// save done
				, this.hold(function(err,doc){

					if(err && err.code==11000)
					{
						nut.message("用户名已经存在，请换用其他的用户名。",[],"error") ;
					}

					else
					{
						if(doc)
						{
							nut.message("注册成功",[],"success") ;
							nut.view.disable() ;
						}
						else
						{
							nut.message("用户注册遇到了错误",[],"error") ;
						}

						if(err)
							throw err ;
					}
				})
			) ;
		}
	}
}


module.exports.__as_controller = true ;