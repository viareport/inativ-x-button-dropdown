var TestSuite = require('spatester');

var selectors = {};
selectors.toggle = 'x-button-dropdown div.header span.toggle-icon';
selectors.toggleClosed = selectors.toggle+'.close';
selectors.toggleOpen = selectors.toggle+'.open';
selectors.dropdown = 'x-button-dropdown div.dropdown';
selectors.dropdownLi = 'x-button-dropdown div.dropdown ul li';
selectors.dropdownLiIndex = function(index) {
    return 'x-button-dropdown div.dropdown ul li:nth-child('+index+')';
};


var buttonDropdown;
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
    asserter.expect('x-button-dropdown div.header div').to.have.text('button label');
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

testSuite.addTest('Lorsque elle est visible, la dropdown affiche les élements ajoutés ordonnés', function(scenario, asserter) {

    var elements = [
        {
            label: 'some text',
            type: 'text'
        },
        {
            label: 'action1',
            type: 'action',
            event: 'event1'
        },
        {
            label: 'some other text',
            type: 'text'
        },
        {
            label: 'action2',
            type: 'action',
            event: 'event2'
        },
        {
            label: 'action3',
            type: 'action',
            event: 'event3'
        }
    ];

    // Given
    scenario.wait('x-button-dropdown');
    scenario.exec(function() {

        elements.forEach(function(element) {
            if('text' === element.type) {
                buttonDropdown.addText(element.label);
            } else if('action' === element.type) {
                buttonDropdown.addAction(element.label,element.event);
            }
        });
    });

    // When
    scenario.click(selectors.toggleClosed);

    // Then
    asserter.expect(selectors.dropdownLi).to.have.nodeLength(elements.length);

    elements.forEach(function(element, index) {
        asserter.expect(selectors.dropdownLiIndex(index+1)).to.have.text(element.label);
    });

});


document.addEventListener('DOMComponentsLoaded', function(){
    testSuite.run();
});