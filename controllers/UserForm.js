module.exports = {

    view: "ocuser/templates/UserForm.html"
    , layout: "controlpanel"
    , process: function(){
        this.former().load() ;
    }

    , actions: {
        save: function(seed){
            var former = this.former().fillForm(seed) ;

            if(!former.validate())
                return ;

            former.save(
                function(doc){
                    doc.password = helper.util.md5(doc.password) ;
                    console.log(doc.password) ;
                }
                ,this.hold()
            ) ;
        }

        , remove : function(seed,nut){
			nut.view.disable() ;
            this.former().remove(this.hold()) ;
        }

    }
}
