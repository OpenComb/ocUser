
module.exports = {
	
	layout: "controlpanel"
	, view: "ocuser/templates/UserList.html"

	, children: {
		
		page: {
			layout: "controlpanel"
			, view: "ocuser/templates/UserListPage.html"
			, process: function(seed,nut)
			{
				helper.former(this,module.exports.view,function(err,former){

					var condition = former.doc() ;
					for(var name in condition)
					{
						if(!condition[name])
							delete condition[name] ;
					}

					helper.db.coll("users").find(condition).page(20,seed.page,this.hold(function(err,page){
						if(err)
						{
							throw err ;
						}
						nut.model.page = page || {} ;
					})) ;
				}) ;
			}
			
			, viewIn: function()
			{
				// 用户信息
				$(".show-user-id").popover({placement:"top"}) ;

				$(".show-user-detail").each(function(){
					$(this).popover({
						placement:"left"
						, html: true
						, title: "用户信息"
						, content: $(".user-detail[_id="+$(this).attr("_id")+"]").html()
					}) ;
				}) ;

				// 删除用户
				console.log("xxxxxxxxxxxxx") ;
				var deletingLink ;
				$(".delete-user").click(function(){
					deletingLink = this ;
					$(".deleteConfirm").modal() ;
					return false ;
				}) ;
				$(".btnConfirmDelete").click(function(){
					$(deletingLink).action(function(err,nut){
						console.log(arguments) ;
						if(err) throw err ;

						nut.msgqueue.popup() ;

						// 删除消息
						$(deletingLink).parents("tr.tr-user").remove() ;
					}) ;
				});
			}
		}
	}
	
	, actions: {
		
		view: {
			
			layout: "controlpanel"
			, view: "ocuser/templates/UserView.html"
			, process: function(seed,nut)
			{
				if(!seed._id)
				{
					nut.message("missing arg: _id",null,"error") ;
					nut.view.disable() ;
					return true ;
				}
				
				helper.db.coll("users")
						.findOne(
							{_id: helper.db.id(seed._id)}
							, this.hold(function(err,doc){
								nut.model.user = doc ;
							})
						) ;
			}
		}

		, test: function(seed,nut){
			nut.message("hieeeee") ;
			nut.model.foo = "bar" ;
			nut.model._id = seed._id ;
		}
	}

	
}



