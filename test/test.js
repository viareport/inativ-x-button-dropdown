var TestSuite = require('spatester');

var selectors = {};
selectors.root = "#default-button-dropdown"
selectors.toggle = function toggle(rootSelectors) {
    return rootSelectors+' div.header span.toggle-icon';
};
selectors.toggleClosed = function(rootSelectors) {
    return selectors.toggle(rootSelectors)+'.close';
};
selectors.toggleOpen = function (rootSelectors) {
    return selectors.toggle(rootSelectors)+'.open';
};
selectors.dropdown = function (rootSelectors) {
    return rootSelectors+' div.dropdown';
};
selectors.dropdownLi = function (rootSelectors) {
    return rootSelectors +' div.dropdown ul li';
};
selectors.buttonLabel = function (rootSelectors) {
    return rootSelectors+' div.header span';
};
selectors.dropdownLiIndex = function dropdownLiIndex(rootSelectors, index) {
    return rootSelectors+' div.dropdown ul li:nth-child('+index+')';
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
        buttonDropdown.setAttribute('id', 'default-button-dropdown');
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
    asserter.expect(selectors.buttonLabel(selectors.root)).to.have.text('button label');
    asserter.expect(selectors.toggleClosed(selectors.root)).to.exist();
    asserter.expect(selectors.dropdown(selectors.root)).to.be.hidden();
});

testSuite.addTest('Lorsque on clic sur le toggle, la dropdown est visible', function(scenario, asserter) {

    // Given
    scenario.wait('x-button-dropdown');

    // When
    scenario.click(selectors.toggleClosed(selectors.root));

    // Then
    asserter.expect(selectors.toggleOpen(selectors.root)).to.exist();
    asserter.expect(selectors.dropdown(selectors.root)).to.be.visible();
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
    scenario.click(selectors.toggleClosed(selectors.root));

    // Then
    asserter.expect(selectors.dropdownLi(selectors.root)).to.have.nodeLength(elements.length);

    elements.forEach(function(element, index) {
        asserter.expect(selectors.dropdownLiIndex(selectors.root,index+1)).to.have.text(element.label);
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
    scenario.click(selectors.toggleClosed(selectors.root));

    // When
    scenario.click(selectors.dropdownLiIndex(selectors.root,2));

    // Then
    asserter.assertTrue(function() {
        return eventFired === 1;
    });
});

testSuite.addTest('Lorsque l\'on clique sur une action, le dropdown menu ce ferme', function (scenario, asserter) {

    // Given
    var elements = [
        {label: 'some text', type: 'text'},
        {label: 'action1', type: 'action', event: 'event1'},
        {label: 'some other text', type: 'text'}
    ];
    var eventFired = 0;

    scenario.wait('x-button-dropdown');
    scenario.exec(function () {
        addElementsToDropdown(elements);
        document.addEventListener('event1', function () {
            eventFired++;
        });
    });
    scenario.click(selectors.toggleClosed(selectors.root));

    // When
    scenario.click(selectors.dropdownLiIndex(selectors.root, 2));

    // Then
    asserter.expect(selectors.dropdown(selectors.root)).not.visible();
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
    scenario.click(selectors.toggleClosed(selectors.root));

    // When
    scenario.click(selectors.dropdownLiIndex(selectors.root,1));

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
    scenario.click(selectors.toggleClosed(selectors.root));

    // When
    scenario.click('body');

    // Then
    asserter.expect(selectors.dropdown(selectors.root)).to.be.hidden();
    
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
    asserter.expect(selectors.dropdown(selectors.root)).to.be.hidden();
    
});


testSuite.addTest('Lorsque on défini le label du bouton à l\'insertion de l\'élément, il est visible', function (scenario, asserter) {

    // Given
    var newButton = {
        id: "new-button-dropdown",
        label: "new button"
    };

    var newDropdown = '<x-button-dropdown id="' + newButton.id + '" label="' + newButton.label + '"></x-button-dropdown>';

    // When
    scenario.exec(function () {
        document.body.innerHTML = newDropdown;
        buttonDropdown = document.querySelector('x-button-dropdown');
    });
    scenario.wait(selectors.buttonLabel("#"+newButton.id));

    // Then
    asserter.expect(selectors.buttonLabel("#" + newButton.id)).to.have.text(newButton.label);
});

testSuite.addTest('On ne peut avoir q\'un seul bouton dropdown ouvert au même moment' , function (scenario, asserter) {

    // Given
    var newButton = {
        id: "new-button-dropdown",
        label: "new button"
    };

    scenario.exec(function () {
        var newDropDown = document.createElement("x-button-dropdown");
        newDropDown.setAttribute('id', newButton.id);
        document.body.appendChild(newDropDown);
    });

    scenario.wait("#" + newButton.id);

    scenario.click(selectors.toggleClosed(selectors.root));
    asserter.expect(selectors.toggleOpen(selectors.root)).to.exist();
    asserter.expect(selectors.dropdown(selectors.root)).to.be.visible();

    // When
    scenario.click(selectors.toggleClosed("#" + newButton.id));

    // Then
    asserter.expect(selectors.toggleOpen("#" + newButton.id)).to.exist();
    asserter.expect(selectors.dropdown("#" + newButton.id)).to.be.visible();
    asserter.expect(selectors.toggleOpen(selectors.root)).not.exist();
    asserter.expect(selectors.dropdown(selectors.root)).not.visible();
});



document.addEventListener('DOMComponentsLoaded', function(){
    testSuite.run();
});