(function(){  
    xtag.register('x-button-dropdown', {
        lifecycle:{
            created: function(){
                this.documentFragment = document.createDocumentFragment();
                
                this.header = document.createElement('div');
                this.header.classList.add('header');
                this.headerLabel = document.createElement('span');
                this.header.appendChild(this.headerLabel);
                this.headerToggle = document.createElement('span');
                this.headerToggle.classList.add('toggle-icon');
                this.headerToggle.classList.add('close');
                this.header.appendChild(this.headerToggle);

                this.dropdown = document.createElement('div');
                this.dropdown.classList.add('dropdown');
                this.dropdown.classList.add('close');
                this.dropdown.style.visibility = "hidden";
                this.dropdownUL = document.createElement('ul');
                this.dropdown.appendChild(this.dropdownUL);

                this.documentFragment.appendChild(this.header);
                this.documentFragment.appendChild(this.dropdown);

                if(this.hasAttribute('label')) {
                    this._onLabelChanged();
                }
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
                    this._onLabelChanged();
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
                var toogleEvent = new CustomEvent("toggle", {
                    'bubbles': true,
                    'cancelable': true
                });
                var customEvent = new CustomEvent(e.target.eventName, {
                    'bubbles': true,
                    'cancelable': true
                });
                this.dispatchEvent(toogleEvent);
                this.dispatchEvent(customEvent);
            },
            "toggle":function(e){
                e.stopPropagation();
                this._toggleDropDown();
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
                if(this.dropdown.style.visibility === "hidden") {
                    this.dropdown.style.visibility = "";
                } else {
                    this.dropdown.style.visibility = "hidden";
                }
                this.headerToggle.classList.toggle('close');
                this.headerToggle.classList.toggle('open');
            },

            _clickOutsideListener: function(e) {
                if (this.dropdown && (this.dropdown.style.visibility !== "hidden") && this !== e.target && !this.contains(e.target)) {
                    this._toggleDropDown();
                }
            },

            _onLabelChanged: function() {
                this.headerLabel.innerHTML = this.getAttribute('label');
            }
        }
    });
})();
