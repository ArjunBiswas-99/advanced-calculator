/**
 * Panel Manager UI Component Module
 *
 * Responsible for managing calculator panels, mode switching, tab navigation,
 * and advanced feature interfaces.
 *
 * Follows Single Responsibility Principle: Only panel and mode management
 * Follows Open/Closed Principle: New panels and modes can be added
 */

class PanelManager {
    constructor() {
        this.currentMode = 'basic';
        this.currentTab = 'algebra';
        this.panels = new Map();
        this.tabs = new Map();

        this.init();
    }

    /**
     * Initialize the panel manager
     * @param {Object} app - Reference to main calculator app
     */
    init(app = null) {
        this.app = app;
        this.registerPanels();
        this.bindEvents();
        this.setInitialState();
    }

    /**
     * Register all available panels
     */
    registerPanels() {
        this.panels.set('basicKeys', {
            element: document.getElementById('basicKeys'),
            modes: ['basic', 'scientific', 'graph', 'advanced', 'programmer']
        });

        this.panels.set('scientificKeys', {
            element: document.getElementById('scientificKeys'),
            modes: ['scientific']
        });

        this.panels.set('advancedPanel', {
            element: document.getElementById('advancedPanel'),
            modes: ['advanced']
        });

        this.panels.set('graphCanvas', {
            element: document.getElementById('graphCanvas'),
            modes: ['graph']
        });

        // Register tabs within advanced panel
        this.tabs.set('algebra', {
            content: this.createAlgebraContent.bind(this),
            element: null
        });

        this.tabs.set('calculus', {
            content: this.createCalculusContent.bind(this),
            element: null
        });

        this.tabs.set('matrix', {
            content: this.createMatrixContent.bind(this),
            element: null
        });

        this.tabs.set('complex', {
            content: this.createComplexContent.bind(this),
            element: null
        });

        this.tabs.set('stats', {
            content: this.createStatsContent.bind(this),
            element: null
        });

        this.tabs.set('units', {
            content: this.createUnitsContent.bind(this),
            element: null
        });
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for custom events from other modules
        document.addEventListener('modeChanged', (e) => this.onModeChanged(e.detail));
        document.addEventListener('tabChanged', (e) => this.onTabChanged(e.detail));

        // Bind panel-specific events
        this.bindAdvancedPanelEvents();
        this.bindGraphPanelEvents();
    }

    /**
     * Set initial panel state
     */
    setInitialState() {
        this.switchMode('basic');
        this.switchTab('algebra');
    }

    /**
     * Switch calculator mode
     * @param {string} mode - New mode
     */
    switchMode(mode) {
        if (this.currentMode === mode) return;

        this.currentMode = mode;

        // Hide all panels
        this.panels.forEach((panelInfo, panelName) => {
            if (panelInfo.element) {
                panelInfo.element.classList.add('hidden');
            }
        });

        // Show panels relevant to the new mode
        this.panels.forEach((panelInfo, panelName) => {
            if (panelInfo.modes.includes(mode) && panelInfo.element) {
                panelInfo.element.classList.remove('hidden');
                panelInfo.element.classList.add('fade-in');
            }
        });

        // Mode-specific setup
        this.setupModeSpecificFeatures(mode);

        // Update UI indicators
        this.updateModeIndicators(mode);

        console.log(`Switched to mode: ${mode}`);
    }

    /**
     * Set up mode-specific features
     * @param {string} mode - Current mode
     */
    setupModeSpecificFeatures(mode) {
        switch (mode) {
            case 'graph':
                this.initializeGraphCanvas();
                break;
            case 'programmer':
                this.initializeProgrammerMode();
                break;
            case 'advanced':
                this.initializeAdvancedMode();
                break;
        }
    }

    /**
     * Initialize graph canvas
     */
    initializeGraphCanvas() {
        const canvas = document.getElementById('graph');
        if (canvas && typeof GraphingModule !== 'undefined') {
            GraphingModule.init(canvas);
        }
    }

    /**
     * Initialize programmer mode
     */
    initializeProgrammerMode() {
        // Add programmer-specific buttons or functionality
        if (typeof ProgrammerModule !== 'undefined') {
            ProgrammerModule.init();
        }
    }

    /**
     * Initialize advanced mode
     */
    initializeAdvancedMode() {
        // Ensure first tab is loaded
        this.switchTab('algebra');
    }

    /**
     * Update mode indicators in UI
     * @param {string} mode - Current mode
     */
    updateModeIndicators(mode) {
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update document title or other indicators
        const titles = {
            basic: 'Basic Calculator',
            scientific: 'Scientific Calculator',
            graph: 'Graphing Calculator',
            advanced: 'Advanced Calculator',
            programmer: 'Programmer Calculator'
        };

        document.title = titles[mode] || 'Advanced Calculator';
    }

    /**
     * Switch active tab in advanced panel
     * @param {string} tab - Tab name
     */
    switchTab(tab) {
        if (this.currentTab === tab) return;

        this.currentTab = tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Load tab content
        this.loadTabContent(tab);

        console.log(`Switched to tab: ${tab}`);
    }

    /**
     * Load content for a specific tab
     * @param {string} tab - Tab name
     */
    loadTabContent(tab) {
        const tabContent = document.getElementById('tabContent');
        if (!tabContent) return;

        // Clear existing content
        tabContent.innerHTML = '';

        // Get tab configuration
        const tabConfig = this.tabs.get(tab);
        if (tabConfig && tabConfig.content) {
            const content = tabConfig.content();
            tabContent.appendChild(content);
            tabConfig.element = content;

            // Bind events for the new content
            this.bindTabContentEvents(content, tab);
        }
    }

    /**
     * Create algebra tab content
     * @returns {Element} - Tab content element
     */
    createAlgebraContent() {
        const container = document.createElement('div');
        container.className = 'algebra-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Equation Solver</h4>
                <div class="input-group">
                    <label for="algebra-equation">Equation:</label>
                    <input type="text" id="algebra-equation" placeholder="e.g., x^2 + 2*x - 3 = 0" class="equation-input">
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="solve-quadratic">Solve Quadratic</button>
                    <button class="action-btn" data-action="solve-linear">Solve Linear</button>
                    <button class="action-btn" data-action="factor">Factor</button>
                    <button class="action-btn" data-action="expand">Expand</button>
                </div>
                <div class="result-area" id="algebra-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create calculus tab content
     * @returns {Element} - Tab content element
     */
    createCalculusContent() {
        const container = document.createElement('div');
        container.className = 'calculus-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Calculus Tools</h4>
                <div class="input-group">
                    <label for="calculus-function">Function f(x):</label>
                    <input type="text" id="calculus-function" placeholder="e.g., x^2 + sin(x)" class="function-input">
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="derivative">d/dx</button>
                    <button class="action-btn" data-action="integral">∫</button>
                    <button class="action-btn" data-action="limit">Limit</button>
                    <button class="action-btn" data-action="series">Taylor Series</button>
                </div>
                <div class="result-area" id="calculus-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create matrix tab content
     * @returns {Element} - Tab content element
     */
    createMatrixContent() {
        const container = document.createElement('div');
        container.className = 'matrix-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Matrix Operations</h4>
                <div class="matrix-inputs">
                    <div class="matrix-group">
                        <label>Matrix A:</label>
                        <textarea id="matrix-a" placeholder="1,2,3\n4,5,6\n7,8,9" rows="3"></textarea>
                    </div>
                    <div class="matrix-group">
                        <label>Matrix B:</label>
                        <textarea id="matrix-b" placeholder="1,0,0\n0,1,0\n0,0,1" rows="3"></textarea>
                    </div>
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="add">A + B</button>
                    <button class="action-btn" data-action="subtract">A - B</button>
                    <button class="action-btn" data-action="multiply">A × B</button>
                    <button class="action-btn" data-action="determinant">det(A)</button>
                    <button class="action-btn" data-action="inverse">A⁻¹</button>
                    <button class="action-btn" data-action="transpose">Aᵀ</button>
                    <button class="action-btn" data-action="eigenvalues">Eigenvalues</button>
                </div>
                <div class="result-area" id="matrix-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create complex numbers tab content
     * @returns {Element} - Tab content element
     */
    createComplexContent() {
        const container = document.createElement('div');
        container.className = 'complex-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Complex Numbers</h4>
                <div class="complex-input">
                    <div class="input-group">
                        <label for="complex-real">Real part:</label>
                        <input type="number" id="complex-real" placeholder="3">
                    </div>
                    <div class="input-group">
                        <label for="complex-imag">Imaginary part:</label>
                        <input type="number" id="complex-imag" placeholder="4">
                    </div>
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="magnitude">|z|</button>
                    <button class="action-btn" data-action="argument">arg(z)</button>
                    <button class="action-btn" data-action="conjugate">z̄</button>
                    <button class="action-btn" data-action="polar">Polar Form</button>
                    <button class="action-btn" data-action="exponential">Exponential Form</button>
                </div>
                <div class="result-area" id="complex-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create statistics tab content
     * @returns {Element} - Tab content element
     */
    createStatsContent() {
        const container = document.createElement('div');
        container.className = 'stats-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Statistics & Probability</h4>
                <div class="input-group">
                    <label for="stats-data">Data (comma-separated):</label>
                    <textarea id="stats-data" placeholder="1, 2, 3, 4, 5" rows="3"></textarea>
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="mean">Mean</button>
                    <button class="action-btn" data-action="median">Median</button>
                    <button class="action-btn" data-action="mode">Mode</button>
                    <button class="action-btn" data-action="stddev">Standard Deviation</button>
                    <button class="action-btn" data-action="variance">Variance</button>
                    <button class="action-btn" data-action="regression">Linear Regression</button>
                    <button class="action-btn" data-action="correlation">Correlation</button>
                </div>
                <div class="result-area" id="stats-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create units tab content
     * @returns {Element} - Tab content element
     */
    createUnitsContent() {
        const container = document.createElement('div');
        container.className = 'units-panel';
        container.innerHTML = `
            <div class="panel-section">
                <h4>Unit Conversion</h4>
                <div class="unit-conversion">
                    <div class="input-group">
                        <label for="unit-value">Value:</label>
                        <input type="number" id="unit-value" placeholder="1">
                    </div>
                    <div class="input-group">
                        <label for="unit-from">From:</label>
                        <select id="unit-from">
                            <optgroup label="Length">
                                <option value="m">Meters</option>
                                <option value="km">Kilometers</option>
                                <option value="cm">Centimeters</option>
                                <option value="mm">Millimeters</option>
                                <option value="ft">Feet</option>
                                <option value="in">Inches</option>
                                <option value="yd">Yards</option>
                                <option value="mi">Miles</option>
                            </optgroup>
                            <optgroup label="Mass">
                                <option value="kg">Kilograms</option>
                                <option value="g">Grams</option>
                                <option value="lb">Pounds</option>
                                <option value="oz">Ounces</option>
                            </optgroup>
                            <optgroup label="Temperature">
                                <option value="c">Celsius</option>
                                <option value="f">Fahrenheit</option>
                                <option value="k">Kelvin</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="unit-to">To:</label>
                        <select id="unit-to">
                            <optgroup label="Length">
                                <option value="m">Meters</option>
                                <option value="km">Kilometers</option>
                                <option value="cm">Centimeters</option>
                                <option value="mm">Millimeters</option>
                                <option value="ft">Feet</option>
                                <option value="in">Inches</option>
                                <option value="yd">Yards</option>
                                <option value="mi">Miles</option>
                            </optgroup>
                            <optgroup label="Mass">
                                <option value="kg">Kilograms</option>
                                <option value="g">Grams</option>
                                <option value="lb">Pounds</option>
                                <option value="oz">Ounces</option>
                            </optgroup>
                            <optgroup label="Temperature">
                                <option value="c">Celsius</option>
                                <option value="f">Fahrenheit</option>
                                <option value="k">Kelvin</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="action-btn" data-action="convert">Convert</button>
                </div>
                <div class="result-area" id="units-result"></div>
            </div>
        `;
        return container;
    }

    /**
     * Bind events for tab content
     * @param {Element} content - Tab content element
     * @param {string} tab - Tab name
     */
    bindTabContentEvents(content, tab) {
        content.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleTabAction(tab, action, content);
            });
        });
    }

    /**
     * Handle tab-specific actions
     * @param {string} tab - Tab name
     * @param {string} action - Action name
     * @param {Element} content - Tab content element
     */
    handleTabAction(tab, action, content) {
        const resultArea = content.querySelector('.result-area');

        try {
            let result;

            switch (tab) {
                case 'algebra':
                    result = this.handleAlgebraAction(action, content);
                    break;
                case 'calculus':
                    result = this.handleCalculusAction(action, content);
                    break;
                case 'matrix':
                    result = this.handleMatrixAction(action, content);
                    break;
                case 'complex':
                    result = this.handleComplexAction(action, content);
                    break;
                case 'stats':
                    result = this.handleStatsAction(action, content);
                    break;
                case 'units':
                    result = this.handleUnitsAction(action, content);
                    break;
                default:
                    result = `Action "${action}" not implemented for tab "${tab}"`;
            }

            if (resultArea) {
                resultArea.textContent = result;
            }
        } catch (error) {
            if (resultArea) {
                resultArea.textContent = `Error: ${error.message}`;
                resultArea.classList.add('error');
                setTimeout(() => resultArea.classList.remove('error'), 3000);
            }
        }
    }

    /**
     * Handle algebra actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleAlgebraAction(action, content) {
        const equation = content.querySelector('.equation-input').value;

        if (typeof AlgebraModule !== 'undefined') {
            return AlgebraModule.handleAction(action, equation);
        }

        return `Algebra feature "${action}" not implemented yet`;
    }

    /**
     * Handle calculus actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleCalculusAction(action, content) {
        const func = content.querySelector('.function-input').value;

        if (typeof CalculusModule !== 'undefined') {
            return CalculusModule.handleAction(action, func);
        }

        return `Calculus feature "${action}" not implemented yet`;
    }

    /**
     * Handle matrix actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleMatrixAction(action, content) {
        const matrixA = content.querySelector('#matrix-a').value;
        const matrixB = content.querySelector('#matrix-b').value;

        if (typeof MatrixModule !== 'undefined') {
            return MatrixModule.handleAction(action, matrixA, matrixB);
        }

        return `Matrix feature "${action}" not implemented yet`;
    }

    /**
     * Handle complex number actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleComplexAction(action, content) {
        const real = parseFloat(content.querySelector('#complex-real').value) || 0;
        const imag = parseFloat(content.querySelector('#complex-imag').value) || 0;

        if (typeof ComplexModule !== 'undefined') {
            return ComplexModule.handleAction(action, real, imag);
        }

        return `Complex number feature "${action}" not implemented yet`;
    }

    /**
     * Handle statistics actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleStatsAction(action, content) {
        const data = content.querySelector('#stats-data').value;

        if (typeof StatsModule !== 'undefined') {
            return StatsModule.handleAction(action, data);
        }

        return `Statistics feature "${action}" not implemented yet`;
    }

    /**
     * Handle unit conversion actions
     * @param {string} action - Action name
     * @param {Element} content - Tab content
     * @returns {string} - Result message
     */
    handleUnitAction(action, content) {
        const value = parseFloat(content.querySelector('#unit-value').value);
        const from = content.querySelector('#unit-from').value;
        const to = content.querySelector('#unit-to').value;

        if (typeof UnitsModule !== 'undefined') {
            return UnitsModule.handleAction(action, value, from, to);
        }

        return `Unit conversion feature "${action}" not implemented yet`;
    }

    /**
     * Bind events for advanced panel
     */
    bindAdvancedPanelEvents() {
        // Tab switching is handled by ButtonsModule
    }

    /**
     * Bind events for graph panel
     */
    bindGraphPanelEvents() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetView = document.getElementById('resetView');

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                if (typeof GraphingModule !== 'undefined') {
                    GraphingModule.zoom(1.2);
                }
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                if (typeof GraphingModule !== 'undefined') {
                    GraphingModule.zoom(0.8);
                }
            });
        }

        if (resetView) {
            resetView.addEventListener('click', () => {
                if (typeof GraphingModule !== 'undefined') {
                    GraphingModule.resetView();
                }
            });
        }
    }

    /**
     * Handle mode change event
     * @param {Object} detail - Event detail
     */
    onModeChanged(detail) {
        this.switchMode(detail.mode);
    }

    /**
     * Handle tab change event
     * @param {Object} detail - Event detail
     */
    onTabChanged(detail) {
        this.switchTab(detail.tab);
    }

    /**
     * Get current mode
     * @returns {string} - Current mode
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Get current tab
     * @returns {string} - Current tab
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Check if a mode is available
     * @param {string} mode - Mode to check
     * @returns {boolean} - Whether mode is available
     */
    isModeAvailable(mode) {
        return ['basic', 'scientific', 'graph', 'advanced', 'programmer'].includes(mode);
    }

    /**
     * Check if a tab is available
     * @param {string} tab - Tab to check
     * @returns {boolean} - Whether tab is available
     */
    isTabAvailable(tab) {
        return this.tabs.has(tab);
    }

    /**
     * Get available modes
     * @returns {Array} - Array of available modes
     */
    getAvailableModes() {
        return ['basic', 'scientific', 'graph', 'advanced', 'programmer'];
    }

    /**
     * Get available tabs
     * @returns {Array} - Array of available tabs
     */
    getAvailableTabs() {
        return Array.from(this.tabs.keys());
    }

    /**
     * Destroy panel manager and clean up
     */
    destroy() {
        // Remove event listeners
        this.panels.clear();
        this.tabs.clear();
    }
}

// Export for module usage
const PanelsModule = new PanelManager();
