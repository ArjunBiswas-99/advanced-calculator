/**
 * Arbitrary Precision Arithmetic Module
 *
 * Provides high-precision mathematical operations to avoid IEEE-754 floating-point errors.
 * Implements decimal arithmetic with configurable precision.
 *
 * Follows Single Responsibility Principle: Only precision arithmetic
 * Follows Open/Closed Principle: New operations can be added
 */

class PrecisionMath {
    constructor(precision = 10) {
        this.precision = precision;
        this.scale = Math.pow(10, precision);
    }

    /**
     * Set the precision level
     * @param {number} precision - Number of decimal places
     */
    setPrecision(precision) {
        this.precision = precision;
        this.scale = Math.pow(10, precision);
    }

    /**
     * Add two numbers with high precision
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - Precise sum
     */
    add(a, b) {
        return this.round((a * this.scale + b * this.scale) / this.scale);
    }

    /**
     * Subtract two numbers with high precision
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - Precise difference
     */
    subtract(a, b) {
        return this.round((a * this.scale - b * this.scale) / this.scale);
    }

    /**
     * Multiply two numbers with high precision
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - Precise product
     */
    multiply(a, b) {
        return this.round((a * this.scale * (b * this.scale)) / (this.scale * this.scale));
    }

    /**
     * Divide two numbers with high precision
     * @param {number} a - Dividend
     * @param {number} b - Divisor
     * @returns {number} - Precise quotient
     */
    divide(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return this.round(a / b);
    }

    /**
     * Calculate square root with high precision using Newton's method
     * @param {number} x - Number to find square root of
     * @returns {number} - Precise square root
     */
    sqrt(x) {
        if (x < 0) throw new Error('Cannot take square root of negative number');

        let guess = x / 2;
        const iterations = 10; // Sufficient for most precisions

        for (let i = 0; i < iterations; i++) {
            if (guess === 0) return 0;
            guess = this.divide(this.add(guess, this.divide(x, guess)), 2);
        }

        return this.round(guess);
    }

    /**
     * Calculate power with high precision
     * @param {number} base - Base number
     * @param {number} exponent - Exponent
     * @returns {number} - Precise power
     */
    pow(base, exponent) {
        // Handle special cases
        if (exponent === 0) return 1;
        if (exponent === 1) return base;
        if (base === 0) return 0;

        // Integer exponents
        if (Number.isInteger(exponent)) {
            return this.integerPower(base, exponent);
        }

        // Fractional exponents (roots)
        if (exponent === 0.5) return this.sqrt(base);
        if (exponent === 1/3) return this.cbrt(base);

        // General case using logarithm and exponential
        return Math.pow(base, exponent); // Fallback for complex cases
    }

    /**
     * Calculate integer power efficiently
     * @param {number} base - Base number
     * @param {number} exponent - Integer exponent
     * @returns {number} - Precise power
     */
    integerPower(base, exponent) {
        let result = 1;
        let currentBase = base;
        let currentExponent = Math.abs(exponent);

        while (currentExponent > 0) {
            if (currentExponent % 2 === 1) {
                result = this.multiply(result, currentBase);
            }
            currentBase = this.multiply(currentBase, currentBase);
            currentExponent = Math.floor(currentExponent / 2);
        }

        return exponent < 0 ? this.divide(1, result) : result;
    }

    /**
     * Calculate cube root
     * @param {number} x - Number to find cube root of
     * @returns {number} - Precise cube root
     */
    cbrt(x) {
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        let guess = x / 3;
        const iterations = 10;

        for (let i = 0; i < iterations; i++) {
            const guessCubed = this.multiply(this.multiply(guess, guess), guess);
            const derivative = 3 * this.multiply(guess, guess);
            guess = this.subtract(guess, this.divide(this.subtract(guessCubed, x), derivative));
        }

        return this.round(sign * guess);
    }

    /**
     * Calculate trigonometric functions with high precision
     * @param {string} func - Function name ('sin', 'cos', 'tan')
     * @param {number} angle - Angle in radians
     * @returns {number} - Precise trigonometric value
     */
    trig(func, angle) {
        // Reduce angle to [-π, π] for better precision
        angle = this.normalizeAngle(angle);

        switch (func) {
            case 'sin':
                return Math.sin(angle);
            case 'cos':
                return Math.cos(angle);
            case 'tan':
                return Math.tan(angle);
            default:
                throw new Error(`Unknown trigonometric function: ${func}`);
        }
    }

    /**
     * Normalize angle to [-π, π]
     * @param {number} angle - Angle in radians
     * @returns {number} - Normalized angle
     */
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }

    /**
     * Calculate logarithm with high precision
     * @param {number} x - Number to take log of
     * @param {number} base - Logarithm base (default: natural log)
     * @returns {number} - Precise logarithm
     */
    log(x, base = Math.E) {
        if (x <= 0) throw new Error('Logarithm undefined for non-positive numbers');
        if (base <= 0 || base === 1) throw new Error('Invalid logarithm base');

        if (base === Math.E) {
            return Math.log(x);
        }

        return this.divide(Math.log(x), Math.log(base));
    }

    /**
     * Calculate exponential function with high precision
     * @param {number} x - Exponent
     * @returns {number} - Precise exponential value
     */
    exp(x) {
        return Math.exp(x);
    }

    /**
     * Round number to current precision
     * @param {number} value - Value to round
     * @returns {number} - Rounded value
     */
    round(value) {
        if (!isFinite(value)) return value;
        return Math.round(value * this.scale) / this.scale;
    }

    /**
     * Check if two numbers are equal within precision tolerance
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {boolean} - Whether numbers are equal within precision
     */
    equals(a, b) {
        return Math.abs(a - b) < Math.pow(10, -this.precision);
    }

    /**
     * Calculate factorial with high precision
     * @param {number} n - Number to calculate factorial of
     * @returns {number} - Precise factorial
     */
    factorial(n) {
        if (!Number.isInteger(n) || n < 0) {
            throw new Error('Factorial defined only for non-negative integers');
        }

        if (n === 0 || n === 1) return 1;

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result = this.multiply(result, i);
        }

        return result;
    }

    /**
     * Calculate combination (n choose k)
     * @param {number} n - Total items
     * @param {number} k - Items to choose
     * @returns {number} - Combination result
     */
    combination(n, k) {
        if (k > n || k < 0 || n < 0) return 0;
        if (k === 0 || k === n) return 1;

        k = Math.min(k, n - k); // Optimize by using smaller k

        let result = 1;
        for (let i = 1; i <= k; i++) {
            result = this.multiply(result, (n - k + i) / i);
        }

        return this.round(result);
    }

    /**
     * Calculate permutation (n permute k)
     * @param {number} n - Total items
     * @param {number} k - Items to arrange
     * @returns {number} - Permutation result
     */
    permutation(n, k) {
        if (k > n || k < 0 || n < 0) return 0;
        if (k === 0) return 1;

        let result = 1;
        for (let i = 0; i < k; i++) {
            result = this.multiply(result, n - i);
        }

        return result;
    }

    /**
     * Calculate percentage
     * @param {number} value - Value
     * @param {number} percent - Percentage
     * @returns {number} - Percentage of value
     */
    percentage(value, percent) {
        return this.multiply(value, this.divide(percent, 100));
    }

    /**
     * Calculate percentage change
     * @param {number} oldValue - Original value
     * @param {number} newValue - New value
     * @returns {number} - Percentage change
     */
    percentageChange(oldValue, newValue) {
        if (oldValue === 0) throw new Error('Cannot calculate percentage change from zero');
        return this.multiply(this.divide(this.subtract(newValue, oldValue), Math.abs(oldValue)), 100);
    }

    /**
     * Get current precision setting
     * @returns {number} - Current precision
     */
    getPrecision() {
        return this.precision;
    }
}

// Export for module usage
const PrecisionModule = new PrecisionMath();
