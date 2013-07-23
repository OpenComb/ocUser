module.exports = {

    view: "ocuser/templates/UserForm.html"
    , layout: "controlpanel"
    , process: function(){
        this.former().load() ;
    }

    , children: {
        save: function(){
            var former = this.former() ;
            if(!former.validate())
                return ;

            former.save(this.hold()) ;
        }
    }
}
