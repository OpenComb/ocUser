module.exports = {

    view: "ocuser/templates/UserForm.html"
    , layout: "controlpanel"
    , process: function(seed,nut){
        this.former().load(this.hold()) ;
    }

    , children: {
        save: function(seed,nut)
        {
            var former = this.former() ;

            if(!former.validate())
                return ;

            former.save(this.hold()) ;
        }
    }
}
