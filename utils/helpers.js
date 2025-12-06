/**
 * Utility Helper Functions Module
 *
 * Provides common utility functions used throughout the calculator application.
 * Includes formatting, validation, conversion, and miscellaneous helper methods.
 *
 * Follows Single Responsibility Principle: Only utility functions
 * Follows Open/Closed Principle: New helpers can be added
 */

class Helpers {
    constructor() {
        // Common mathematical symbols
        this.symbols = {
            multiply: '×',
            divide: '÷',
            plus: '+',
            minus: '−',
            equals: '=',
            pi: 'π',
            euler: 'e',
            phi: 'φ',
            tau: 'τ',
            infinity: '∞',
            sqrt: '√',
            integral: '∫',
            sigma: '∑',
            delta: 'Δ',
            theta: 'θ'
        };
    }

    /**
     * Format a number for display with appropriate notation
     * @param {number} value - Number to format
     * @param {number} maxDigits - Maximum digits to display
     * @returns {string} - Formatted number string
     */
    formatNumber(value, maxDigits = 10) {
        if (!isFinite(value)) {
            return value.toString();
        }

        // Handle very large or very small numbers
        const absValue = Math.abs(value);
        if (absValue === 0) return '0';

        if (absValue >= 1e12 || absValue < 1e-6) {
            return value.toExponential(6);
        }

        // For normal numbers, use fixed or precision based on magnitude
        if (absValue >= 1) {
            return value.toPrecision(Math.min(maxDigits, 10));
        } else {
            return value.toFixed(Math.min(maxDigits - 1, 10));
        }
    }

    /**
     * Clean and normalize a mathematical expression string
     * @param {string} expression - Expression to clean
     * @returns {string} - Cleaned expression
     */
    cleanExpression(expression) {
        return expression
            .replace(/\s+/g, '') // Remove whitespace
            .replace(/×/g, '*')  // Convert symbols to operators
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'pi')
            .replace(/∞/g, 'Infinity');
    }

    /**
     * Validate a mathematical expression
     * @param {string} expression - Expression to validate
     * @returns {Object} - Validation result with isValid and error message
     */
    validateExpression(expression) {
        try {
            // Check for balanced parentheses
            if (!this.hasBalancedParentheses(expression)) {
                return { isValid: false, error: 'Unbalanced parentheses' };
            }

            // Check for invalid operator sequences
            if (this.hasInvalidOperatorSequence(expression)) {
                return { isValid: false, error: 'Invalid operator sequence' };
            }

            // Check for division by zero (basic check)
            if (expression.includes('/0')) {
                return { isValid: false, error: 'Division by zero' };
            }

            // Check for empty parentheses
            if (expression.includes('()')) {
                return { isValid: false, error: 'Empty parentheses' };
            }

            return { isValid: true, error: null };
        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }

    /**
     * Check if parentheses are balanced
     * @param {string} expression - Expression to check
     * @returns {boolean} - Whether parentheses are balanced
     */
    hasBalancedParentheses(expression) {
        let balance = 0;
        for (const char of expression) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false;
        }
        return balance === 0;
    }

    /**
     * Check for invalid operator sequences
     * @param {string} expression - Expression to check
     * @returns {boolean} - Whether expression has invalid sequences
     */
    hasInvalidOperatorSequence(expression) {
        // Check for consecutive operators (except for valid cases like '+-')
        const operators = '+-*/^';
        for (let i = 0; i < expression.length - 1; i++) {
            if (operators.includes(expression[i]) && operators.includes(expression[i + 1])) {
                // Allow '+-' (unary minus after plus)
                if (!(expression[i] === '+' && expression[i + 1] === '-')) {
                    return true;
                }
            }
        }

        // Check for operators at start or end (except unary operators)
        if (operators.includes(expression[0]) && expression[0] !== '+' && expression[0] !== '-') {
            return true;
        }

        if (operators.includes(expression[expression.length - 1])) {
            return true;
        }

        return false;
    }

    /**
     * Convert between different angle units
     * @param {number} angle - Angle value
     * @param {string} from - Source unit ('deg', 'rad', 'grad')
     * @param {string} to - Target unit ('deg', 'rad', 'grad')
     * @returns {number} - Converted angle
     */
    convertAngle(angle, from, to) {
        const conversions = {
            'deg': { 'rad': Math.PI / 180, 'grad': 10/9 },
            'rad': { 'deg': 180 / Math.PI, 'grad': 200 / Math.PI },
            'grad': { 'deg': 0.9, 'rad': Math.PI / 200 }
        };

        if (from === to) return angle;
        if (!conversions[from] || !conversions[from][to]) {
            throw new Error(`Invalid angle conversion: ${from} to ${to}`);
        }

        return angle * conversions[from][to];
    }

    /**
     * Convert number to different bases
     * @param {number} number - Number to convert
     * @param {number} fromBase - Source base (2-36)
     * @param {number} toBase - Target base (2-36)
     * @returns {string} - Converted number as string
     */
    convertBase(number, fromBase, toBase) {
        // First convert to decimal
        const decimal = parseInt(number.toString(), fromBase);
        if (isNaN(decimal)) {
            throw new Error('Invalid number for base conversion');
        }

        // Then convert to target base
        return decimal.toString(toBase).toUpperCase();
    }

    /**
     * Generate a random number within a range
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} - Random number
     */
    random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generate a random integer within a range
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} - Random integer
     */
    randomInt(min, max) {
        return Math.floor(this.random(min, max));
    }

    /**
     * Clamp a number between min and max values
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Check if a value is numeric
     * @param {*} value - Value to check
     * @returns {boolean} - Whether value is numeric
     */
    isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));

        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Debounce a function call
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle a function call
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Get the current timestamp
     * @returns {number} - Current timestamp in milliseconds
     */
    timestamp() {
        return Date.now();
    }

    /**
     * Format a timestamp as a human-readable string
     * @param {number} timestamp - Timestamp to format
     * @returns {string} - Formatted timestamp
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    /**
     * Calculate the greatest common divisor (GCD)
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - GCD of the two numbers
     */
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Calculate the least common multiple (LCM)
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - LCM of the two numbers
     */
    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    /**
     * Check if a number is prime
     * @param {number} n - Number to check
     * @returns {boolean} - Whether the number is prime
     */
    isPrime(n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;

        for (let i = 5; i * i <= n; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) return false;
        }

        return true;
    }

    /**
     * Get mathematical symbols
     * @returns {Object} - Symbol mappings
     */
    getSymbols() {
        return this.deepClone(this.symbols);
    }

    /**
     * Get the current browser environment info
     * @returns {Object} - Browser environment information
     */
    getEnvironment() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    /**
     * Check if the device is a touch device
     * @returns {boolean} - Whether the device supports touch
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Generate a unique ID
     * @param {number} length - Length of the ID
     * @returns {string} - Unique ID string
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// Export for module usage
const HelpersModule = new Helpers();
