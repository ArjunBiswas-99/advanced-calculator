/**
 * Algebra Module
 *
 * Provides algebraic equation solving capabilities including quadratic equations,
 * polynomial operations, and expression manipulation.
 *
 * Follows Single Responsibility Principle: Only algebraic operations
 * Follows Open/Closed Principle: New algebra features can be added
 */

class AlgebraEngine {
    constructor() {
        this.precision = 10;
        this.tolerance = 1e-10;
    }

    /**
     * Handle algebra action from UI
     * @param {string} action - Action name
     * @param {string} input - Input data
     * @returns {string} - Result message
     */
    handleAction(action, input) {
        try {
            switch (action) {
                case 'solve-quadratic':
                    return this.solveQuadratic(input);
                case 'solve-linear':
                    return this.solveLinear(input);
                case 'factor':
                    return this.factorExpression(input);
                case 'expand':
                    return this.expandExpression(input);
                default:
                    return `Unknown algebra action: ${action}`;
            }
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    /**
     * Solve quadratic equation ax² + bx + c = 0
     * @param {string} equation - Quadratic equation string
     * @returns {string} - Solution
     */
    solveQuadratic(equation) {
        // Extract coefficients from equation string
        const coeffs = this.parseQuadraticEquation(equation);

        if (!coeffs) {
            return 'Invalid quadratic equation format. Use: ax² + bx + c = 0';
        }

        const { a, b, c } = coeffs;

        if (a === 0) {
            return 'Not a quadratic equation (a = 0)';
        }

        // Calculate discriminant
        const discriminant = b * b - 4 * a * c;

        if (discriminant > 0) {
            // Two real solutions
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            return `Two real solutions: x₁ = ${this.roundToPrecision(root1)}, x₂ = ${this.roundToPrecision(root2)}`;
        } else if (discriminant === 0) {
            // One real solution
            const root = -b / (2 * a);
            return `One real solution: x = ${this.roundToPrecision(root)}`;
        } else {
            // Complex solutions
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            return `Complex solutions: x = ${this.roundToPrecision(realPart)} ± ${this.roundToPrecision(Math.abs(imagPart))}i`;
        }
    }

    /**
     * Parse quadratic equation string to extract coefficients
     * @param {string} equation - Equation string
     * @returns {Object|null} - Coefficients {a, b, c} or null if invalid
     */
    parseQuadraticEquation(equation) {
        // Remove spaces and normalize
        equation = equation.replace(/\s+/g, '').toLowerCase();

        // Basic pattern matching for ax² + bx + c = 0
        const patterns = [
            // ax² + bx + c = 0
            /^([+-]?\d*\.?\d*)x\^?2([+-]\d*\.?\d*)x([+-]\d*\.?\d*)=0$/,
            // ax² + bx = -c
            /^([+-]?\d*\.?\d*)x\^?2([+-]\d*\.?\d*)x=([+-]\d*\.?\d*)$/,
            // ax² = -bx - c
            /^([+-]?\d*\.?\d*)x\^?2=([+-]\d*\.?\d*)x([+-]\d*\.?\d*)$/,
            // Simple cases
            /^x\^?2([+-]\d*\.?\d*)x([+-]\d*\.?\d*)=0$/,
            /^x\^?2=([+-]\d*\.?\d*)x([+-]\d*\.?\d*)$/,
            /^x\^?2([+-]\d*\.?\d*)=([+-]\d*\.?\d*)$/,
            /^x\^?2=([+-]\d*\.?\d*)$/
        ];

        for (const pattern of patterns) {
            const match = equation.match(pattern);
            if (match) {
                return this.extractCoefficients(match, pattern);
            }
        }

        return null;
    }

    /**
     * Extract coefficients from regex match
     * @param {Array} match - Regex match result
     * @param {RegExp} pattern - Pattern used
     * @returns {Object} - Coefficients {a, b, c}
     */
    extractCoefficients(match, pattern) {
        // This is a simplified implementation
        // In a full implementation, you'd have more sophisticated parsing

        let a = 1, b = 0, c = 0;

        // Handle different pattern formats
        if (pattern.source.includes('x\\^?2([+-]')) {
            // Pattern: x² + bx + c = 0
            a = 1;
            b = parseFloat(match[1]) || 0;
            c = parseFloat(match[2]) || 0;
        } else if (pattern.source.startsWith('([+-]?\\d*')) {
            // Pattern: ax² + bx + c = 0
            a = parseFloat(match[1]) || 1;
            b = parseFloat(match[2]) || 0;
            c = parseFloat(match[3]) || 0;
        }

        return { a, b, c };
    }

    /**
     * Solve linear equation ax + b = 0
     * @param {string} equation - Linear equation string
     * @returns {string} - Solution
     */
    solveLinear(equation) {
        // Simplified linear equation solver
        equation = equation.replace(/\s+/g, '').toLowerCase();

        // Basic pattern: ax + b = 0 or ax = b
        const patterns = [
            /^([+-]?\d*\.?\d*)x([+-]\d*\.?\d*)=0$/,
            /^([+-]?\d*\.?\d*)x=([+-]\d*\.?\d*)$/
        ];

        for (const pattern of patterns) {
            const match = equation.match(pattern);
            if (match) {
                const a = parseFloat(match[1]) || 1;
                const b = parseFloat(match[2]) || 0;

                if (a === 0) {
                    return b === 0 ? 'Infinite solutions' : 'No solution';
                }

                const x = -b / a;
                return `Solution: x = ${this.roundToPrecision(x)}`;
            }
        }

        return 'Invalid linear equation format. Use: ax + b = 0';
    }

    /**
     * Factor algebraic expression
     * @param {string} expression - Expression to factor
     * @returns {string} - Factored expression
     */
    factorExpression(expression) {
        // Simplified factoring - in practice, this would be much more complex
        expression = expression.replace(/\s+/g, '');

        // Check if it's a quadratic trinomial
        if (this.isQuadraticTrinomial(expression)) {
            return this.factorQuadraticTrinomial(expression);
        }

        return `Factoring not implemented for: ${expression}`;
    }

    /**
     * Check if expression is a quadratic trinomial
     * @param {string} expression - Expression to check
     * @returns {boolean} - Whether it's a quadratic trinomial
     */
    isQuadraticTrinomial(expression) {
        // Basic check for ax² + bx + c format
        return /^([+-]?\d*\.?\d*)x\^?2([+-]\d*\.?\d*)x([+-]\d*\.?\d*)$/.test(expression);
    }

    /**
     * Factor quadratic trinomial ax² + bx + c
     * @param {string} expression - Quadratic expression
     * @returns {string} - Factored form
     */
    factorQuadraticTrinomial(expression) {
        // Extract coefficients
        const match = expression.match(/^([+-]?\d*\.?\d*)x\^?2([+-]\d*\.?\d*)x([+-]\d*\.?\d*)$/);
        if (!match) return expression;

        const a = parseFloat(match[1]) || 1;
        const b = parseFloat(match[2]) || 0;
        const c = parseFloat(match[3]) || 0;

        // Find factors of a*c that add up to b
        const factors = this.findFactors(a * c, b);

        if (factors) {
            const { f1, f2 } = factors;
            const g1 = f1 / a;
            const g2 = f2 / a;

            return `${a === 1 ? '' : a}(x ${g1 >= 0 ? '+' : ''}${g1})(x ${g2 >= 0 ? '+' : ''}${g2})`;
        }

        return `${expression} (cannot be factored over integers)`;
    }

    /**
     * Find factors of target that add up to sum
     * @param {number} target - Number to factor
     * @param {number} sum - Sum of factors
     * @returns {Object|null} - Factors {f1, f2} or null
     */
    findFactors(target, sum) {
        for (let i = 1; i <= Math.abs(target); i++) {
            if (target % i === 0) {
                const f1 = i;
                const f2 = target / i;
                if (f1 + f2 === sum) {
                    return { f1, f2 };
                }
                if (-f1 + -f2 === sum) {
                    return { f1: -f1, f2: -f2 };
                }
            }
        }
        return null;
    }

    /**
     * Expand algebraic expression
     * @param {string} expression - Expression to expand
     * @returns {string} - Expanded expression
     */
    expandExpression(expression) {
        // Simplified expansion - handle basic cases like (a+b)², (a+b)(c+d)
        expression = expression.replace(/\s+/g, '');

        // Handle (a+b)²
        const squarePattern = /^\(([^+]+)\+([^)]+)\)\^?2$/;
        const match = expression.match(squarePattern);
        if (match) {
            const a = match[1];
            const b = match[2];
            return `${a}² + 2${a}${b} + ${b}²`;
        }

        return `Expansion not implemented for: ${expression}`;
    }

    /**
     * Round number to specified precision
     * @param {number} value - Value to round
     * @returns {number} - Rounded value
     */
    roundToPrecision(value) {
        if (typeof PrecisionModule !== 'undefined') {
            return PrecisionModule.round(value);
        }

        const factor = Math.pow(10, this.precision);
        return Math.round(value * factor) / factor;
    }

    /**
     * Simplify algebraic expression
     * @param {string} expression - Expression to simplify
     * @returns {string} - Simplified expression
     */
    simplify(expression) {
        // Basic simplification - combine like terms
        // This would be much more complex in a full implementation
        return expression;
    }

    /**
     * Check if expression is valid
     * @param {string} expression - Expression to validate
     * @returns {boolean} - Whether expression is valid
     */
    isValidExpression(expression) {
        try {
            // Basic validation
            if (!expression || expression.trim() === '') return false;

            // Check for balanced parentheses
            let balance = 0;
            for (const char of expression) {
                if (char === '(') balance++;
                if (char === ')') balance--;
                if (balance < 0) return false;
            }
            return balance === 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get available algebra operations
     * @returns {Array} - List of operations
     */
    getAvailableOperations() {
        return [
            'solve-quadratic',
            'solve-linear',
            'factor',
            'expand',
            'simplify'
        ];
    }

    /**
     * Get help text for algebra operations
     * @returns {Object} - Help information
     */
    getHelp() {
        return {
            'solve-quadratic': 'Solve quadratic equations (ax² + bx + c = 0)',
            'solve-linear': 'Solve linear equations (ax + b = 0)',
            'factor': 'Factor algebraic expressions',
            'expand': 'Expand algebraic expressions',
            'simplify': 'Simplify algebraic expressions'
        };
    }
}

// Export for module usage
const AlgebraModule = new AlgebraEngine();
