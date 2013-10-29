var TestSuite = require('spatester');

var selectors = {};
selectors.toggle = 'x-button-dropdown div.header span.toggle-icon';
selectors.toggleClosed = selectors.toggle+'.close';
selectors.toggleOpen = selectors.toggle+'.open';
selectors.dropdown = 'x-button-dropdown div.dropdown';
selectors.dropdownLi = 'x-button-dropdown div.dropdown ul li';
selectors.buttonLabel = 'x-button-dropdown div.header span';
selectors.dropdownLiIndex = function dropdownLiIndex(index) {
    return 'x-button-dropdown div.dropdown ul li:nth-child('+index+')';
};

var buttonDropdown;

var addElementsToDropdown = function(elements) {
    elements.forEach(function(element) {
        if('text' === element.type) {
            buttonDropdown.addText(element.label);
        } else if('action' === element.type) {
            buttonDropdown.addAction(element.label,element.event);
        }
    });
};


var testSuite = new TestSuite('inativ-x-button-dropdown test', {
    setUp: function() {
        buttonDropdown = document.createElement('x-button-dropdown');
        buttonDropdown.setAttribute('label','button label');
        buttonDropdown.addSeparatorClass('separator');
        document.querySelector('body').appendChild(buttonDropdown);
    },
    tearDown: function() {
        document.body.removeChild(buttonDropdown);
        buttonDropdown = null;
    }
});


testSuite.addTest('Lorsque on arrive sur la page, le boutton est affiché non déployé', function(scenario, asserter) {

    // Given
    scenario.wait('x-button-dropdown');

    // Then
    asserter.expect(selectors.buttonLabel).to.have.text('button label');
    asserter.expect(selectors.toggleClosed).to.exist();
    asserter.expect(selectors.dropdown).to.be.hidden();
});

testSuite.addTest('Lorsque on clic sur le toggle, la dropdown est visible', function(scenario, asserter) {

    // Given
    scenario.wait('x-button-dropdown');

    // When
    scenario.click(selectors.toggleClosed);

    // Then
    asserter.expect(selectors.toggleOpen).to.exist();
    asserter.expect(selectors.dropdown).to.be.visible();
});

testSuite.addTest('Lorsque elle est visible, la dropdown affiche les élements ajoutés de façon ordonnée', function(scenario, asserter) {

    // Given
    var elements = [
        {label: 'some text',type: 'text'},
        {label: 'action1',type: 'action',event: 'event1'},
        {label: 'some other text',type: 'text'},
        {label: 'action2',type: 'action',event: 'event2'},
        {label: 'action3',type: 'action',event: 'event3'}
    ];
    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        addElementsToDropdown(elements);
    });

    // When
    scenario.click(selectors.toggleClosed);

    // Then
    asserter.expect(selectors.dropdownLi).to.have.nodeLength(elements.length);

    elements.forEach(function(element, index) {
        asserter.expect(selectors.dropdownLiIndex(index+1)).to.have.text(element.label);
    });

});

testSuite.addTest('A chaque click sur une action, un CustomEvent est envoyé', function(scenario, asserter) {


    // Given
    var elements = [
        {label: 'some text',type: 'text'},
        {label: 'action1',type: 'action',event: 'event1'},
        {label: 'some other text',type: 'text'}
    ];
    var eventFired = 0;

    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        addElementsToDropdown(elements);
        document.addEventListener('event1', function() {
            eventFired++;
        });
    });
    scenario.click(selectors.toggleClosed);

    // When
    scenario.click(selectors.dropdownLiIndex(2));
    scenario.click(selectors.dropdownLiIndex(2));

    // Then
    asserter.assertTrue(function() {
        return eventFired === 2;
    });
});

testSuite.addTest('Lorsque on click sur un text, aucun CustomEvent n\'est envoyé', function(scenario, asserter) {


    // Given
    var elements = [
        {label: 'some text',type: 'text'},
        {label: 'action1',type: 'action',event: 'event1'},
        {label: 'some other text',type: 'text'}
    ];
    var eventFired = 0;

    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        addElementsToDropdown(elements);
        document.addEventListener('event1', function() {
            eventFired++;
        });
    });
    scenario.click(selectors.toggleClosed);

    // When
    scenario.click(selectors.dropdownLiIndex(1));

    // Then
    asserter.assertTrue(function() {
        return eventFired === 0;
    });
});

testSuite.addTest('Lorsque la dropdown est visible et que l\'on click en dehors du composant, elle disparait', function(scenario, asserter) {


    // Given
    var elements = [
        {label: 'some text',type: 'text'}
    ];

    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        addElementsToDropdown(elements);
    });
    scenario.click(selectors.toggleClosed);

    // When
    scenario.click('body');

    // Then
    asserter.expect(selectors.dropdown).to.be.hidden();
    
});

testSuite.addTest('Lorsque la dropdown est invisible et que l\'on click en dehors du composant, elle reste invisible', function(scenario, asserter) {


    // Given
    var elements = [
        {label: 'some text',type: 'text'}
    ];

    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        addElementsToDropdown(elements);
    });

    // When
    scenario.click('body');

    // Then
    asserter.expect(selectors.dropdown).to.be.hidden();
    
});

testSuite.addTest('Lorsque on défini le label du bouton à l\'insertion de l\'élément, il est visible', function(scenario, asserter) {

    // Given
    var newButton = {
        id:"new-button-dropdown",
        label:"new button"
    };

    var newDropdown = '<x-button-dropdown id="'+newButton.id+'" label="'+newButton.label+'"></x-button-dropdown>';

    // When
    scenario.exec(function() {
        document.body.innerHTML = newDropdown;
        buttonDropdown = document.querySelector('x-button-dropdown');
    });
    scenario.wait(selectors.buttonLabel);

    // Then
    asserter.expect(selectors.buttonLabel).to.have.text(newButton.label);
});



document.addEventListener('DOMComponentsLoaded', function(){
    testSuite.run();
});