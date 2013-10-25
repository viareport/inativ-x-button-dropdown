(function(){  
    xtag.register('x-button-dropdown', {
        lifecycle:{
            created: function(){
                this.documentFragment = document.createDocumentFragment();
                
                this.header = document.createElement('div');
                this.header.classList.add('header');
                this.headerLabel = document.createElement('div');
                this.header.appendChild(this.headerLabel);
                this.headerToggle = document.createElement('span');
                this.headerToggle.classList.add('toggle-icon');
                this.headerToggle.classList.add('close');
                this.header.appendChild(this.headerToggle);

                this.dropdown = document.createElement('div');
                this.dropdown.classList.add('dropdown');
                this.dropdown.classList.add('close');
                this.dropdown.setAttribute('hidden', true);

                this.documentFragment.appendChild(this.header);
                this.documentFragment.appendChild(this.dropdown);
            },
            inserted: function(){
                this.appendChild(this.documentFragment);
            },
            removed: function(){
                // fired each time an element
                // is removed from DOM
            },
            attributeChanged: function(attributeKey){
                if('label' === attributeKey) {
                    this.headerLabel.innerHTML = this.getAttribute('label');
                }
            }
        },
        events: {
            "click:delegate(div.header)": function(e) {
                var toggleEvent = new CustomEvent('toggle', {
                    'bubbles':true,
                    'cancelable': true
                });
                this.dispatchEvent(toggleEvent);
            }, 
            "toggle":function(e){
                e.stopPropagation();
                this._toggleDropDown();
                this.headerToggle.classList.toggle('close');
                this.headerToggle.classList.toggle('open'); 
            }
        },
        accessors: {
            // TODO
        },
        methods: {
            addSeparatorClass: function() {

            },
            addText: function() {

            },
            addAction: function() {

            },
            _toggleDropDown: function() {
                if(this.dropdown.hasAttribute('hidden')) {
                    this.dropdown.removeAttribute('hidden');
                } else {
                    this.dropdown.setAttribute('hidden', true);
                }
            }
        }
    });
})();
