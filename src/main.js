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
                this.dropdownUL = document.createElement('ul');
                this.dropdown.appendChild(this.dropdownUL);

                this.documentFragment.appendChild(this.header);
                this.documentFragment.appendChild(this.dropdown);
            },
            inserted: function(){
                this.appendChild(this.documentFragment);
                window.document.addEventListener('click', this._clickOutsideListener.bind(this), false);
            },
            removed: function(){
                window.document.removeEventListener('click', this._clickOutsideListener.bind(this), false);
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
            "click:delegate(div.dropdown ul li.event)": function(e) {
                var customEvent = new CustomEvent(e.target.eventName, {
                    'bubbles': true,
                    'cancelable': true                        
                });                   
                this.dispatchEvent(customEvent); 
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
            addText: function(text) {
                var li = document.createElement('li');
                li.innerHTML = text;
                this.dropdownUL.appendChild(li);
            },
            addAction: function(text, event) {
                var li = document.createElement('li');
                li.classList.add('event');
                li.innerHTML = text;
                li.eventName = event;
                this.dropdownUL.appendChild(li);
            },
            _toggleDropDown: function() {
                if(this.dropdown.hasAttribute('hidden')) {
                    this.dropdown.removeAttribute('hidden');
                } else {
                    this.dropdown.setAttribute('hidden', true);
                }
            },

            _clickOutsideListener: function(e) {
                if (this.dropdown && !this.dropdown.hasAttribute('hidden') && this !== e.target && !this.contains(e.target)) {
                    this._toggleDropDown();
                }
            }
        }
    });
})();
