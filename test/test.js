var TestSuite = require('spatester');

var selectors = {};
selectors.toggle = 'x-button-dropdown div.header span.toggle-icon';
selectors.toggleClosed = selectors.toggle+'.close';
selectors.toggleOpen = selectors.toggle+'.open';
selectors.dropdown = 'x-button-dropdown div.dropdown';

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
    scenario.exec(function() {
        buttonDropdown.addText('some text');
        buttonDropdown.addAction('action-label1','event1');
        buttonDropdown.addAction('action-label2','event2');
        buttonDropdown.addAction('action-label3','event3');
    });

    // Then
    asserter.expect('x-button-dropdown div.header div').to.have.html('button label');
    asserter.expect(selectors.toggleClosed).to.exist();
    asserter.expect(selectors.dropdown).to.be.hidden();
});

testSuite.addTest('Lorsque on clic sur le toggle, la dropdown est visible', function(scenario, asserter) {

    // Given
    scenario.wait('x-button-dropdown');
    scenario.exec(function() {
        buttonDropdown.addText('some text');
        buttonDropdown.addAction('action-label1','event1');
        buttonDropdown.addAction('action-label2','event2');
        buttonDropdown.addAction('action-label3','event3');
    });

    // When
    scenario.click(selectors.toggleClosed);

    // Then
    asserter.expect(selectors.toggleOpen).to.exist();
    asserter.expect(selectors.dropdown).to.be.visible();
});


document.addEventListener('DOMComponentsLoaded', function(){
    testSuite.run();
});