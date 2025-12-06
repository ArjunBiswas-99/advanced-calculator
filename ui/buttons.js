/**
 * Button Handler UI Component Module
 *
 * Responsible for managing calculator button interactions, including click events,
 * button states, and input handling delegation.
 *
 * Follows Single Responsibility Principle: Only button interaction handling
 * Follows Open/Closed Principle: New button types can be added
 */

class ButtonHandler {
    constructor() {
        this.inputCallback = null;
        this.buttons = [];
        this.buttonStates = new Map();
    }

    /**
     * Initialize the button handler
     */
    init() {
        this.bindButtonEvents();
        this.setupButtonStates();
    }

    /**
     * Set the input callback function
     * @param {Function} callback - Function to call when input occurs
     */
    setInputCallback(callback) {
        this.inputCallback = callback;
    }

    /**
     * Bind click events to all calculator buttons
     */
    bindButtonEvents() {
        // Bind events to all buttons with data-value attribute
        document.querySelectorAll('.key[data-value]').forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
            button.addEventListener('mousedown', (e) => this.handleButtonDown(e));
            button.addEventListener('mouseup', (e) => this.handleButtonUp(e));
            button.addEventListener('mouseleave', (e) => this.handleButtonUp(e));

            this.buttons.push(button);
        });

        // Bind mode switcher buttons
        document.querySelectorAll('.mode-btn[data-mode]').forEach(button => {
            button.addEventListener('click', (e) => this.handleModeSwitch(e));
        });

        // Bind tab buttons in advanced panel
        document.querySelectorAll('.tab-btn[data-tab]').forEach(button => {
            button.addEventListener('click', (e) => this.handleTabSwitch(e));
        });

        // Bind graph controls if they exist
        const plotBtn = document.getElementById('plotBtn');
        const clearGraphBtn = document.getElementById('clearGraphBtn');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');

        if (plotBtn) {
            plotBtn.addEventListener('click', () => this.handleGraphPlot());
        }

        if (clearGraphBtn) {
            clearGraphBtn.addEventListener('click', () => this.handleGraphClear());
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.handleGraphZoom(1.2));
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.handleGraphZoom(0.8));
        }
    }

    /**
     * Handle button click event
     * @param {Event} event - Click event
     */
    handleButtonClick(event) {
        const button = event.target.closest('.key[data-value]');
        if (!button) return;

        event.preventDefault();

        const value = button.dataset.value;
        const buttonType = this.getButtonType(button);

        // Add visual feedback
        this.addButtonFeedback(button);

        // Handle input based on button type
        this.processInput(value, buttonType);
    }

    /**
     * Handle button mouse down
     * @param {Event} event - Mouse down event
     */
    handleButtonDown(event) {
        const button = event.target.closest('.key');
        if (button) {
            button.classList.add('pressed');
        }
    }

    /**
     * Handle button mouse up
     * @param {Event} event - Mouse up event
     */
    handleButtonUp(event) {
        const button = event.target.closest('.key');
        if (button) {
            button.classList.remove('pressed');
        }
    }

    /**
     * Handle mode switch
     * @param {Event} event - Mode switch event
     */
    handleModeSwitch(event) {
        const button = event.target.closest('.mode-btn[data-mode]');
        if (!button) return;

        const mode = button.dataset.mode;
        this.switchMode(mode);
    }

    /**
     * Handle tab switch in advanced panel
     * @param {Event} event - Tab switch event
     */
    handleTabSwitch(event) {
        const button = event.target.closest('.tab-btn[data-tab]');
        if (!button) return;

        const tab = button.dataset.tab;
        this.switchTab(tab);
    }

    /**
     * Process input value
     * @param {string} value - Input value
     * @param {string} type - Button type
     */
    processInput(value, type) {
        if (this.inputCallback) {
            // Map button types to input actions
            switch (type) {
                case 'number':
                case 'decimal':
                case 'operator':
                case 'function':
                case 'constant':
                case 'parentheses':
                    this.inputCallback(value);
                    break;

                case 'equals':
                    this.inputCallback('=');
                    break;

                case 'clear':
                    if (value === 'C') {
                        this.inputCallback('C');
                    } else if (value === 'CE') {
                        this.inputCallback('CE');
                    }
                    break;

                default:
                    this.inputCallback(value);
                    break;
            }
        }
    }

    /**
     * Get button type based on CSS classes
     * @param {Element} button - Button element
     * @returns {string} - Button type
     */
    getButtonType(button) {
        const classes = button.classList;

        if (classes.contains('number')) return 'number';
        if (classes.contains('decimal')) return 'decimal';
        if (classes.contains('operator')) return 'operator';
        if (classes.contains('function')) return 'function';
        if (classes.contains('constant')) return 'constant';
        if (classes.contains('equals')) return 'equals';
        if (classes.contains('clear')) return 'clear';
        if (classes.contains('parentheses')) return 'parentheses';

        return 'unknown';
    }

    /**
     * Add visual feedback to button press
     * @param {Element} button - Button element
     */
    addButtonFeedback(button) {
        button.classList.add('active');

        // Remove active class after animation
        setTimeout(() => {
            button.classList.remove('active');
        }, 150);
    }

    /**
     * Switch calculator mode
     * @param {string} mode - New mode
     */
    switchMode(mode) {
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Hide all panels
        document.querySelectorAll('.keys-panel, .advanced-panel, .graph-canvas').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Show relevant panels based on mode
        const panelMap = {
            basic: ['basicKeys'],
            scientific: ['scientificKeys'], // Only show scientific keys in scientific mode
            graph: ['basicKeys', 'graphCanvas'],
            advanced: ['basicKeys', 'advancedPanel'],
            programmer: ['basicKeys'] // Programmer mode uses basic keys with special handling
        };

        if (panelMap[mode]) {
            panelMap[mode].forEach(panelId => {
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.remove('hidden');
                    panel.classList.add('slide-in');
                }
            });
        }

        // Update display mode
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.setMode(mode);
        }

        // Trigger mode change event
        this.triggerEvent('modeChanged', { mode: mode });
    }

    /**
     * Switch active tab in advanced panel
     * @param {string} tab - Tab name
     */
    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Load tab content
        this.loadTabContent(tab);

        // Trigger tab change event
        this.triggerEvent('tabChanged', { tab: tab });
    }

    /**
     * Handle graph plot action
     */
    handleGraphPlot() {
        const functionInput = document.getElementById('functionInput');
        if (functionInput && typeof GraphingModule !== 'undefined') {
            GraphingModule.plotFunction(functionInput.value);
        }
    }

    /**
     * Handle graph clear action
     */
    handleGraphClear() {
        if (typeof GraphingModule !== 'undefined') {
            GraphingModule.clear();
        }
    }

    /**
     * Handle graph zoom action
     * @param {number} factor - Zoom factor
     */
    handleGraphZoom(factor) {
        if (typeof GraphingModule !== 'undefined') {
            GraphingModule.zoom(factor);
        }
    }

    /**
     * Load content for a specific tab
     * @param {string} tab - Tab name
     */
    loadTabContent(tab) {
        // Let the PanelsModule handle tab content loading
        if (typeof PanelsModule !== 'undefined') {
            PanelsModule.switchTab(tab);
        } else {
            // Fallback to internal method if PanelsModule not available
            const tabContent = document.getElementById('tabContent');
            if (!tabContent) return;

            // Clear existing content
            tabContent.innerHTML = '';

            // Load content based on tab
            switch (tab) {
                case 'algebra':
                    this.loadAlgebraTab(tabContent);
                    break;
                case 'calculus':
                    this.loadCalculusTab(tabContent);
                    break;
                case 'matrix':
                    this.loadMatrixTab(tabContent);
                    break;
                case 'complex':
                    this.loadComplexTab(tabContent);
                    break;
                case 'stats':
                    this.loadStatsTab(tabContent);
                    break;
                case 'units':
                    this.loadUnitsTab(tabContent);
                    break;
                default:
                    tabContent.innerHTML = '<p>Tab content not implemented</p>';
            }
        }
    }

    /**
     * Load algebra tab content
     * @param {Element} container - Tab content container
     */
    loadAlgebraTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Equation Solver</h4>
                <input type="text" placeholder="Enter equation (e.g., x^2 + 2x - 3 = 0)" id="equationInput">
                <button class="solve-btn" data-action="solve">Solve</button>
                <div id="solutionResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Load calculus tab content
     * @param {Element} container - Tab content container
     */
    loadCalculusTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Derivative Calculator</h4>
                <input type="text" placeholder="f(x) =" id="functionInput">
                <button class="calc-btn" data-action="derivative">d/dx</button>
                <div id="derivativeResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Load matrix tab content
     * @param {Element} container - Tab content container
     */
    loadMatrixTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Matrix Operations</h4>
                <div class="matrix-input">
                    <textarea placeholder="Matrix A (comma-separated rows)" id="matrixA"></textarea>
                    <textarea placeholder="Matrix B (comma-separated rows)" id="matrixB"></textarea>
                </div>
                <div class="matrix-ops">
                    <button class="matrix-btn" data-action="add">A + B</button>
                    <button class="matrix-btn" data-action="multiply">A × B</button>
                    <button class="matrix-btn" data-action="determinant">det(A)</button>
                    <button class="matrix-btn" data-action="inverse">A⁻¹</button>
                </div>
                <div id="matrixResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Load complex numbers tab content
     * @param {Element} container - Tab content container
     */
    loadComplexTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Complex Numbers</h4>
                <div class="complex-input">
                    <input type="text" placeholder="Real part" id="realPart">
                    <input type="text" placeholder="Imaginary part" id="imagPart">
                </div>
                <div class="complex-ops">
                    <button class="complex-btn" data-action="magnitude">|z|</button>
                    <button class="complex-btn" data-action="argument">arg(z)</button>
                    <button class="complex-btn" data-action="conjugate">z̄</button>
                </div>
                <div id="complexResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Load statistics tab content
     * @param {Element} container - Tab content container
     */
    loadStatsTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Statistics</h4>
                <textarea placeholder="Enter numbers (comma-separated)" id="dataInput"></textarea>
                <div class="stats-ops">
                    <button class="stats-btn" data-action="mean">Mean</button>
                    <button class="stats-btn" data-action="median">Median</button>
                    <button class="stats-btn" data-action="stddev">Std Dev</button>
                    <button class="stats-btn" data-action="regression">Regression</button>
                </div>
                <div id="statsResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Load units tab content
     * @param {Element} container - Tab content container
     */
    loadUnitsTab(container) {
        container.innerHTML = `
            <div class="tab-section">
                <h4>Unit Conversion</h4>
                <div class="unit-input">
                    <input type="number" placeholder="Value" id="unitValue">
                    <select id="fromUnit">
                        <option value="m">Meters</option>
                        <option value="km">Kilometers</option>
                        <option value="ft">Feet</option>
                        <option value="in">Inches</option>
                    </select>
                    <span>to</span>
                    <select id="toUnit">
                        <option value="m">Meters</option>
                        <option value="km">Kilometers</option>
                        <option value="ft">Feet</option>
                        <option value="in">Inches</option>
                    </select>
                </div>
                <button class="convert-btn" data-action="convert">Convert</button>
                <div id="unitResult"></div>
            </div>
        `;
        this.bindTabActions(container);
    }

    /**
     * Bind action buttons in tabs
     * @param {Element} container - Tab content container
     */
    bindTabActions(container) {
        container.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleTabAction(action, container);
            });
        });
    }

    /**
     * Handle tab-specific actions
     * @param {string} action - Action name
     * @param {Element} container - Tab container
     */
    handleTabAction(action, container) {
        // This would integrate with the respective modules
        console.log(`Handling action: ${action}`);

        // Placeholder for actual implementation
        const resultDiv = container.querySelector('[id$="Result"]');
        if (resultDiv) {
            resultDiv.textContent = `Feature "${action}" not yet implemented`;
        }
    }

    /**
     * Set up initial button states
     */
    setupButtonStates() {
        // Set initial states for special buttons
        this.setButtonState('M+', false);
        this.setButtonState('M-', false);
        this.setButtonState('MR', false);
        this.setButtonState('MC', false);
    }

    /**
     * Set button state (enabled/disabled)
     * @param {string} buttonValue - Button value
     * @param {boolean} enabled - Whether button should be enabled
     */
    setButtonState(buttonValue, enabled) {
        this.buttonStates.set(buttonValue, enabled);

        const button = document.querySelector(`.key[data-value="${buttonValue}"]`);
        if (button) {
            button.classList.toggle('disabled', !enabled);
            button.disabled = !enabled;
        }
    }

    /**
     * Get button state
     * @param {string} buttonValue - Button value
     * @returns {boolean} - Whether button is enabled
     */
    getButtonState(buttonValue) {
        return this.buttonStates.get(buttonValue) !== false;
    }

    /**
     * Enable/disable all buttons
     * @param {boolean} enabled - Whether to enable buttons
     */
    setAllButtonsEnabled(enabled) {
        this.buttons.forEach(button => {
            button.disabled = !enabled;
            button.classList.toggle('disabled', !enabled);
        });
    }

    /**
     * Trigger custom event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {boolean} - Whether event was handled
     */
    handleKeyboardShortcut(event) {
        // Mode switching shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case '1':
                    event.preventDefault();
                    this.switchMode('basic');
                    return true;
                case '2':
                    event.preventDefault();
                    this.switchMode('scientific');
                    return true;
                case '3':
                    event.preventDefault();
                    this.switchMode('graph');
                    return true;
                case '4':
                    event.preventDefault();
                    this.switchMode('advanced');
                    return true;
                case '5':
                    event.preventDefault();
                    this.switchMode('programmer');
                    return true;
            }
        }

        return false;
    }

    /**
     * Get all available buttons
     * @returns {Array} - Array of button elements
     */
    getButtons() {
        return [...this.buttons];
    }

    /**
     * Get button by value
     * @param {string} value - Button value
     * @returns {Element|null} - Button element or null
     */
    getButton(value) {
        return document.querySelector(`.key[data-value="${value}"]`);
    }

    /**
     * Destroy button handler and clean up
     */
    destroy() {
        // Remove event listeners
        this.buttons.forEach(button => {
            // Event listeners are bound to DOM, will be cleaned up automatically
        });

        this.buttons = [];
        this.buttonStates.clear();
    }
}

// Export for module usage
const ButtonsModule = new ButtonHandler();
