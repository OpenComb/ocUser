module.exports = {

	view: "ocuser/templates/SignOut.html"

	, process:function (seed, nut)
	{
		nut.model.usernames = this.req.session.idmgr.usernames() ;
		return true ;
	}

	, actions: {

		"do": function(seed, nut)
		{
			var idmgr = this.req.session.idmgr ;

			if(!idmgr.id(seed.username))
			{
				nut.message("无效的用户",[],"error") ;
				return true ;
			}

			nut.model.before = this.req.session.idmgr.current() ;

			idmgr.signout(seed.username) ;

			nut.model.now = this.req.session.idmgr.current() ;

			if( idmgr.current() )
			{
				nut.message("用户已退出，切换到%s的身份",[idmgr.current().username],"success") ;
			}

			else
			{
				nut.message("用户已退出",null,"success") ;
			}
		}

	}

	// 在前端执行的函数
	, viewIn: function()
	{
		var view = this ;

		$('#btnSignOut').click(function(){
			var username = $("#selUsername").val() ;
			jQuery.request(

				"/ocuser/SignOut:do?username="+username

				, {
					target:view

					, callback: function(err,nut)
					{
						if(err)
						{
							console.log(err) ;
						}
						
						// 触发 userIdChanged 事件
						$(window).trigger('userIdChanged',{
							before: nut.model.before
							, now: nut.model.now
						}) ;
					}
				}

			) ;

		}) ;
	}
}

module.exports.__as_controller = true ;