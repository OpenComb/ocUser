
module.exports = {

	view: "ocuser/templates/MiniUserPad.html"

	, process: function(seed,nut)
	{
		nut.model.currentId = this.req.session.idmgr.current() ;
		nut.model.usernames = this.req.session.idmgr.usernames() ;
	}

	// 在前端执行的函数
	, viewIn: function()
	{
		var view = this ;

		$(".miniuserpad-btn-signin").click(function(){

			if( !$(".miniuserpad-login").validate(true) )
			{
				return ;
			}

			$(".miniuserpad-login").request(
				{
					url: 'ocuser/SignIn:submit'
					, type: 'post'
				}
				, function(err,nut){
					if(err)
					{
						console.log(err) ;
						console.log(err.stack) ;
						return ;
					}

					nut.msgqueue.popup() ;

					// 触发 userIdChanged 事件
					if( nut.model.signined )
					{
						$(window).trigger('userIdChanged',{
							before: nut.model.before
							, now: nut.model.now
						}) ;
					}
				}
			) ;
		}) ;

		// 用户退出点击
		$(".logout-username").click(function(){

			$(this).request({},function(err,nut){
				if(err)
				{
					console.log(err) ;
				}

				nut.msgqueue.popup() ;

				// 触发 userIdChanged 事件
				$(window).trigger('userIdChanged',{
					before: nut.model.before
					, now: nut.model.now
				}) ;
			}) ;

			return false ;
		})

		// 用户身份更换事件
		this.userIdChangedHandle = function (data)
		{
			view.reload() ;
		}
		$(window).on('userIdChanged',this.userIdChangedHandle) ;
	}

	, viewOut: function()
	{
		//console.log('view out:',__filename,this) ;

		// 注销事件
		if(this.userIdChangedHandle)
		{
			$(window).off('userIdChanged',this.userIdChangedHandle) ;
		}
	}
}