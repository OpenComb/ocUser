module.exports = {
	
	layout: "controlpanel"
	, view: "ocuser/templates/UserList.html"

	, children: {
		
		page: {
			layout: "controlpanel"
			, view: "ocuser/templates/UserListPage.html"
			, process: function(seed,nut)
			{
				var condition = module.exports.viewTpl.formers.former().doc(seed) ;
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
				
				return true ;
			}
			
			, viewIn: function()
			{
				$(".show-user-id").popover({placement:"top"}) ;

				$(".show-user-detail").each(function(){
					$(this).popover({
						placement:"left"
						, html: true
						, title: "用户信息"
						, content: $(".user-detail[_id="+$(this).attr("_id")+"]").html()
					}) ;
				})
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
	}
	
}

module.exports.__as_controller = true ;