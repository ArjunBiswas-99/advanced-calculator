/**
 * Display Panel UI Component Module
 *
 * Responsible for managing the calculator's display panel, including expression input,
 * live preview, cursor management, and display formatting.
 *
 * Follows Single Responsibility Principle: Only display management
 * Follows Open/Closed Principle: Display behaviors can be extended
 */

class DisplayManager {
    constructor() {
        this.expressionElement = null;
        this.previewElement = null;
        this.cursorElement = null;
        this.currentExpression = '';
        this.cursorPosition = 0;
        this.cursorVisible = true;
        this.cursorBlinkInterval = null;

        this.init();
    }

    /**
     * Initialize the display manager
     */
    init() {
        this.expressionElement = document.getElementById('expressionText');
        this.previewElement = document.getElementById('livePreview');
        this.cursorElement = document.getElementById('cursor');

        if (this.expressionElement && this.cursorElement) {
            this.startCursorBlink();
        }
    }

    /**
     * Start cursor blinking animation
     */
    startCursorBlink() {
        if (this.cursorBlinkInterval) {
            clearInterval(this.cursorBlinkInterval);
        }

        this.cursorVisible = true;
        this.cursorElement.style.opacity = '1';

        this.cursorBlinkInterval = setInterval(() => {
            this.cursorVisible = !this.cursorVisible;
            this.cursorElement.style.opacity = this.cursorVisible ? '1' : '0';
        }, 530);
    }

    /**
     * Set the current expression
     * @param {string} expression - Expression to display
     */
    setExpression(expression) {
        this.currentExpression = expression;
        if (this.expressionElement) {
            this.expressionElement.textContent = expression;
        }
    }

    /**
     * Get the current expression
     * @returns {string} - Current expression
     */
    getExpression() {
        return this.currentExpression;
    }

    /**
     * Set the preview text
     * @param {string} preview - Preview text to display
     */
    setPreview(preview) {
        if (this.previewElement) {
            this.previewElement.textContent = preview;
        }
    }

    /**
     * Clear the preview
     */
    clearPreview() {
        if (this.previewElement) {
            this.previewElement.textContent = '';
        }
    }

    /**
     * Insert text at cursor position
     * @param {string} text - Text to insert
     */
    insertAtCursor(text) {
        // For now, just append to the end since we don't have complex cursor management
        this.currentExpression += text;
        this.updateDisplay();
    }

    /**
     * Delete character at cursor position (backspace)
     */
    deleteAtCursor() {
        if (this.currentExpression.length > 0) {
            this.currentExpression = this.currentExpression.slice(0, -1);
            this.updateDisplay();
        }
    }

    /**
     * Update the display with current expression
     */
    updateDisplay() {
        if (this.expressionElement) {
            this.expressionElement.textContent = this.currentExpression;
        }
    }

    /**
     * Clear the display
     */
    clear() {
        this.currentExpression = '';
        this.updateDisplay();
        this.clearPreview();
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (this.previewElement) {
            this.previewElement.textContent = `Error: ${message}`;
            this.previewElement.classList.add('error');

            setTimeout(() => {
                this.previewElement.classList.remove('error');
                this.clearPreview();
            }, 3000);
        }
    }

    /**
     * Destroy the display manager and clean up
     */
    destroy() {
        if (this.cursorBlinkInterval) {
            clearInterval(this.cursorBlinkInterval);
            this.cursorBlinkInterval = null;
        }
    }
}

// Export for module usage
const DisplayModule = new DisplayManager();
