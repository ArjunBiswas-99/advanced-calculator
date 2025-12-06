/**
 * Advanced Scientific Calculator - Main Application Controller
 *
 * This module serves as the central orchestrator for the calculator application,
 * coordinating between UI components and feature modules while maintaining
 * a clean separation of concerns.
 *
 * Follows Single Responsibility Principle: Application state management and coordination
 * Follows Open/Closed Principle: Extensible through plug-and-play modules
 */

class CalculatorApp {
    constructor() {
        this.currentMode = 'basic';
        this.currentExpression = '';
        this.history = [];
        this.memory = 0;
        this.angleMode = 'deg'; // 'deg' or 'rad'
        this.precision = 10;

        this.init();
    }

    /**
     * Initialize the calculator application
     */
    init() {
        this.bindEvents();
        this.loadModules();
        this.updateDisplay();
    }

    /**
     * Bind event listeners for UI interactions
     */
    bindEvents() {
        // Mode switcher events
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Initialize UI modules
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.init();
        }

        if (typeof ButtonsModule !== 'undefined') {
            ButtonsModule.setInputCallback(this.handleInput.bind(this));
            ButtonsModule.init();
        }

        if (typeof PanelsModule !== 'undefined') {
            PanelsModule.init(this);
        }
    }

    /**
     * Load and initialize feature modules
     */
    loadModules() {
        // Modules are loaded via script tags in index.html
        // This method ensures they're properly initialized
        console.log('Calculator modules loaded');
    }

    /**
     * Switch calculator mode
     * @param {string} mode - The mode to switch to
     */
    switchMode(mode) {
        this.currentMode = mode;

        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Show/hide panels
        this.togglePanels(mode);

        // Update display mode indicator
        this.updateDisplay();
        
        // Notify other modules of mode change
        if (typeof PanelsModule !== 'undefined') {
            PanelsModule.switchMode(mode);
        }

        // Update calculator state for the new mode
        this.onModeChange(mode);
    }

    /**
     * Handle mode change specific logic
     * @param {string} mode - The new mode
     */
    onModeChange(mode) {
        // Clear expression when switching to programmer mode to avoid conflicts
        if (mode === 'programmer' && this.currentMode !== 'programmer') {
            this.clearAll();
        }
        // Add any other mode-specific initialization here
    }

    /**
     * Toggle visibility of panels based on mode
     * @param {string} mode - Current mode
     */
    togglePanels(mode) {
        // Hide all panels first
        document.querySelectorAll('.keys-panel, .advanced-panel, .graph-canvas').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Show relevant panels for the current mode
        switch (mode) {
            case 'basic':
                document.getElementById('basicKeys').classList.remove('hidden');
                break;
            case 'scientific':
                document.getElementById('basicKeys').classList.add('hidden'); // Hide basic keys in scientific mode
                document.getElementById('scientificKeys').classList.remove('hidden');
                break;
            case 'advanced':
                document.getElementById('advancedPanel').classList.remove('hidden');
                break;
            case 'graph':
                document.getElementById('basicKeys').classList.remove('hidden');
                document.getElementById('graphCanvas').classList.remove('hidden');
                break;
            case 'programmer':
                document.getElementById('basicKeys').classList.remove('hidden');
                break;
        }
    }

    /**
     * Handle input from buttons or keyboard
     * @param {string} input - The input character/command
     */
    handleInput(input) {
        switch (input) {
            case 'C':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '=':
                this.calculate();
                break;
            case 'M+':
                this.memoryAdd();
                break;
            case 'M-':
                this.memorySubtract();
                break;
            case 'MC':
                this.memoryClear();
                break;
            case 'MR':
                this.memoryRecall();
                break;
            default:
                this.appendToExpression(input);
                break;
        }

        this.updateDisplay();
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboard(event) {
        const key = event.key;

        // Prevent default for calculator keys
        if (this.isCalculatorKey(key)) {
            event.preventDefault();

            // Map keyboard keys to calculator inputs
            const keyMap = {
                'Enter': '=',
                'Escape': 'C',
                'Backspace': 'CE',
                'Delete': 'CE'
            };

            const input = keyMap[key] || key;
            this.handleInput(input);
        }
    }

    /**
     * Check if a key is a calculator key
     * @param {string} key - The key to check
     * @returns {boolean} - Whether the key is a calculator key
     */
    isCalculatorKey(key) {
        const calculatorKeys = '0123456789.+-*/=()sincostanloglnsqrt^!πe';
        return calculatorKeys.includes(key) ||
               ['Enter', 'Escape', 'Backspace', 'Delete'].includes(key);
    }

    /**
     * Append character to current expression
     * @param {string} char - Character to append
     */
    appendToExpression(char) {
        // Use DisplayModule for cursor-aware insertion if available
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.insertAtCursor(char);
            this.currentExpression = DisplayModule.getExpression();
        } else {
            // Fallback to simple append
            // Prevent invalid consecutive operators
            if (this.isOperator(char) && this.endsWithOperator()) {
                this.currentExpression = this.currentExpression.slice(0, -1) + char;
            } else {
                this.currentExpression += char;
            }
        }
    }

    /**
     * Check if character is an operator
     * @param {string} char - Character to check
     * @returns {boolean} - Whether the character is an operator
     */
    isOperator(char) {
        return '+-*/^'.includes(char);
    }

    /**
     * Check if expression ends with an operator
     * @returns {boolean} - Whether expression ends with operator
     */
    endsWithOperator() {
        return this.isOperator(this.currentExpression.slice(-1));
    }

    /**
     * Clear all expression and memory
     */
    clearAll() {
        this.currentExpression = '';
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.clear();
        }
    }

    /**
     * Clear current entry (backspace)
     */
    clearEntry() {
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.deleteAtCursor(false);
            this.currentExpression = DisplayModule.getExpression();
        } else {
            this.currentExpression = this.currentExpression.slice(0, -1);
        }
    }

    /**
     * Calculate the current expression
     */
    calculate() {
        if (!this.currentExpression.trim()) return;

        try {
            const result = this.evaluateExpression(this.currentExpression);
            this.addToHistory(this.currentExpression, result);
            this.currentExpression = result.toString();
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Evaluate mathematical expression
     * @param {string} expression - Expression to evaluate
     * @returns {number} - Result of evaluation
     */
    evaluateExpression(expression) {
        // Use the parser modules for safe evaluation
        if (typeof EvaluatorModule !== 'undefined') {
            return EvaluatorModule.evaluate(expression, {
                angleMode: this.angleMode,
                precision: this.precision
            });
        }

        // Fallback to basic eval (not recommended for production)
        console.warn('Using fallback evaluation - parser not available');
        return Function('"use strict"; return (' + expression + ')')();
    }

    /**
     * Add calculation to history
     * @param {string} expression - Original expression
     * @param {number} result - Calculation result
     */
    addToHistory(expression, result) {
        this.history.unshift({
            expression: expression,
            result: result,
            timestamp: new Date()
        });

        // Keep only last 50 entries
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        historyList.innerHTML = '';
        this.history.slice(0, 10).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${item.expression} = ${item.result}`;
            historyItem.addEventListener('click', () => {
                this.currentExpression = item.expression;
                this.updateDisplay();
            });
            historyList.appendChild(historyItem);
        });
    }

    /**
     * Memory operations
     */
    memoryAdd() {
        const value = parseFloat(this.currentExpression) || 0;
        this.memory += value;
    }

    memorySubtract() {
        const value = parseFloat(this.currentExpression) || 0;
        this.memory -= value;
    }

    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentExpression = this.memory.toString();
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.setExpression(this.currentExpression);
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Use DisplayModule if available, otherwise fallback to direct DOM
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.showError(message);
        } else {
            const display = document.getElementById('livePreview');
            if (display) {
                display.textContent = `Error: ${message}`;
                display.classList.add('error');

                setTimeout(() => {
                    display.classList.remove('error');
                    this.updateDisplay();
                }, 3000);
            }
        }
    }

    /**
     * Update display with current expression and preview
     */
    updateDisplay() {
        // Use DisplayModule if available
        if (typeof DisplayModule !== 'undefined') {
            DisplayModule.setExpression(this.currentExpression);

            // Update live preview
            try {
                if (this.currentExpression.trim()) {
                    const preview = this.evaluateExpression(this.currentExpression);
                    DisplayModule.setPreview(`= ${preview}`);
                } else {
                    DisplayModule.clearPreview();
                }
            } catch (error) {
                DisplayModule.clearPreview();
            }
        } else {
            // Fallback to direct DOM manipulation
            const expressionText = document.getElementById('expressionText');
            const livePreview = document.getElementById('livePreview');

            if (expressionText) {
                expressionText.textContent = this.currentExpression;
            }

            if (livePreview) {
                try {
                    if (this.currentExpression.trim()) {
                        const preview = this.evaluateExpression(this.currentExpression);
                        livePreview.textContent = `= ${preview}`;
                    } else {
                        livePreview.textContent = '';
                    }
                } catch (error) {
                    livePreview.textContent = '';
                }
            }
        }
    }

    /**
     * Get current application state
     * @returns {Object} - Current state
     */
    getState() {
        return {
            currentMode: this.currentMode,
            currentExpression: this.currentExpression,
            history: this.history,
            memory: this.memory,
            angleMode: this.angleMode,
            precision: this.precision
        };
    }

    /**
     * Set application state
     * @param {Object} state - State to restore
     */
    setState(state) {
        Object.assign(this, state);
        this.updateDisplay();
        this.updateHistoryDisplay();
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculatorApp = new CalculatorApp();
});
