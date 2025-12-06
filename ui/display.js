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
        this.isCursorVisible = true;
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
     * Set the current expression
     * @param {string} expression - Expression to display
     * @param {number} cursorPos - Cursor position (optional)
     */
    setExpression(expression, cursorPos = null) {
        this.currentExpression = expression;
        if (cursorPos !== null) {
            this.cursorPosition = Math.max(0, Math.min(cursorPos, expression.length));
        }

        this.updateDisplay();
    }

    /**
     * Insert text at cursor position
     * @param {string} text - Text to insert
     */
    insertAtCursor(text) {
        const before = this.currentExpression.slice(0, this.cursorPosition);
        const after = this.currentExpression.slice(this.cursorPosition);

        this.currentExpression = before + text + after;
        this.cursorPosition += text.length;

        this.updateDisplay();
    }

    /**
     * Delete character at cursor position
     * @param {boolean} forward - Whether to delete forward (default: false for backward)
     */
    deleteAtCursor(forward = false) {
        if (forward) {
            // Delete forward
            if (this.cursorPosition < this.currentExpression.length) {
                this.currentExpression =
                    this.currentExpression.slice(0, this.cursorPosition) +
                    this.currentExpression.slice(this.cursorPosition + 1);
            }
        } else {
            // Delete backward
            if (this.cursorPosition > 0) {
                this.currentExpression =
                    this.currentExpression.slice(0, this.cursorPosition - 1) +
                    this.currentExpression.slice(this.cursorPosition);
                this.cursorPosition--;
            }
        }

        this.updateDisplay();
    }

    /**
     * Move cursor to a specific position
     * @param {number} position - New cursor position
     */
    moveCursor(position) {
        this.cursorPosition = Math.max(0, Math.min(position, this.currentExpression.length));
        this.updateDisplay();
    }

    /**
     * Move cursor by offset
     * @param {number} offset - Cursor movement offset
     */
    moveCursorBy(offset) {
        this.moveCursor(this.cursorPosition + offset);
    }

    /**
     * Set live preview text
     * @param {string} preview - Preview text to display
     */
    setPreview(preview) {
        if (this.previewElement) {
            this.previewElement.textContent = preview || '';
        }
    }

    /**
     * Clear the preview
     */
    clearPreview() {
        this.setPreview('');
    }

    /**
     * Show error in preview
     * @param {string} error - Error message
     */
    showError(error) {
        if (this.previewElement) {
            this.previewElement.textContent = `Error: ${error}`;
            this.previewElement.classList.add('error');

            setTimeout(() => {
                this.previewElement.classList.remove('error');
                this.clearPreview();
            }, 4000);
        }
    }

    /**
     * Update the display with current expression and cursor
     */
    updateDisplay() {
        if (!this.expressionElement || !this.cursorElement) return;

        // Update expression text
        this.expressionElement.textContent = this.currentExpression;

        // Update cursor position
        this.updateCursorPosition();

        // Scroll to cursor if needed
        this.scrollToCursor();
    }

    /**
     * Update cursor visual position
     */
    updateCursorPosition() {
        if (!this.cursorElement || !this.expressionElement) return;

        const textNode = this.expressionElement.firstChild;
        if (!textNode) return;

        // Create a range to measure text width up to cursor
        const range = document.createRange();
        range.setStart(textNode, 0);
        range.setEnd(textNode, this.cursorPosition);

        const rect = range.getBoundingClientRect();
        const containerRect = this.expressionElement.getBoundingClientRect();

        // Position cursor relative to container
        this.cursorElement.style.left = (rect.width - containerRect.left + this.expressionElement.scrollLeft) + 'px';
    }

    /**
     * Scroll display to keep cursor visible
     */
    scrollToCursor() {
        if (!this.expressionElement) return;

        const container = this.expressionElement.parentElement;
        const cursorLeft = parseFloat(this.cursorElement.style.left || '0');
        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;

        // Check if cursor is outside visible area
        if (cursorLeft < scrollLeft) {
            container.scrollLeft = cursorLeft - 20; // Small padding
        } else if (cursorLeft > scrollLeft + containerWidth - 20) {
            container.scrollLeft = cursorLeft - containerWidth + 20;
        }
    }

    /**
     * Start cursor blinking animation
     */
    startCursorBlink() {
        this.stopCursorBlink(); // Stop any existing blink

        this.cursorBlinkInterval = setInterval(() => {
            this.isCursorVisible = !this.isCursorVisible;
            if (this.cursorElement) {
                this.cursorElement.style.opacity = this.isCursorVisible ? '1' : '0';
            }
        }, 530); // Standard blink rate
    }

    /**
     * Stop cursor blinking
     */
    stopCursorBlink() {
        if (this.cursorBlinkInterval) {
            clearInterval(this.cursorBlinkInterval);
            this.cursorBlinkInterval = null;
        }

        // Ensure cursor is visible when stopping
        if (this.cursorElement) {
            this.cursorElement.style.opacity = '1';
        }
        this.isCursorVisible = true;
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {boolean} - Whether the event was handled
     */
    handleKeyboard(event) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.moveCursorBy(-1);
                return true;

            case 'ArrowRight':
                event.preventDefault();
                this.moveCursorBy(1);
                return true;

            case 'Home':
                event.preventDefault();
                this.moveCursor(0);
                return true;

            case 'End':
                event.preventDefault();
                this.moveCursor(this.currentExpression.length);
                return true;

            case 'Backspace':
                event.preventDefault();
                this.deleteAtCursor(false);
                return true;

            case 'Delete':
                event.preventDefault();
                this.deleteAtCursor(true);
                return true;
        }

        return false;
    }

    /**
     * Get current expression
     * @returns {string} - Current expression
     */
    getExpression() {
        return this.currentExpression;
    }

    /**
     * Get current cursor position
     * @returns {number} - Cursor position
     */
    getCursorPosition() {
        return this.cursorPosition;
    }

    /**
     * Clear the display
     */
    clear() {
        this.setExpression('', 0);
        this.clearPreview();
    }

    /**
     * Set focus to the display (for keyboard input)
     */
    focus() {
        if (this.expressionElement) {
            this.expressionElement.focus();
        }
    }

    /**
     * Check if display has focus
     * @returns {boolean} - Whether display has focus
     */
    hasFocus() {
        return document.activeElement === this.expressionElement;
    }

    /**
     * Format expression for display (add spaces around operators, etc.)
     * @param {string} expression - Raw expression
     * @returns {string} - Formatted expression
     */
    formatExpression(expression) {
        // Add spaces around operators for better readability
        return expression
            .replace(/([+\-*/^=])/g, ' $1 ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Set display mode (scientific, programmer, etc.)
     * @param {string} mode - Display mode
     */
    setMode(mode) {
        const container = document.querySelector('.display-panel');
        if (container) {
            // Remove all mode classes
            container.classList.remove('mode-basic', 'mode-scientific', 'mode-programmer');

            // Add current mode class
            if (mode !== 'basic') {
                container.classList.add(`mode-${mode}`);
            }
        }
    }

    /**
     * Highlight a portion of the expression
     * @param {number} start - Start position
     * @param {number} end - End position
     */
    highlight(start, end) {
        // This would require more complex DOM manipulation
        // For now, just move cursor to start position
        this.moveCursor(start);
    }

    /**
     * Get display dimensions
     * @returns {Object} - Display dimensions
     */
    getDimensions() {
        if (!this.expressionElement) return { width: 0, height: 0 };

        const rect = this.expressionElement.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * Destroy the display manager and clean up
     */
    destroy() {
        this.stopCursorBlink();

        // Remove event listeners if any
        if (this.expressionElement) {
            // Any cleanup needed
        }
    }
}

// Export for module usage
const DisplayModule = new DisplayManager();
