/**
 * Expression Evaluator Module
 *
 * Responsible for traversing AST and computing mathematical results.
 * Implements mathematical functions, constants, and evaluation logic.
 *
 * Follows Single Responsibility Principle: Only expression evaluation
 * Follows Open/Closed Principle: New functions/constants can be added
 */

class Evaluator {
    constructor() {
        // Evaluation context
        this.variables = new Map();
        this.angleMode = 'deg'; // 'deg' or 'rad'
        this.precision = 10;

        // Mathematical constants
        this.constants = {
            'pi': Math.PI,
            'π': Math.PI,
            'e': Math.E
        };

        // Function implementations
        this.functions = {
            // Trigonometric functions
            sin: (x) => this.toRadians ? Math.sin(this.toRadians(x)) : Math.sin(x),
            cos: (x) => this.toRadians ? Math.cos(this.toRadians(x)) : Math.cos(x),
            tan: (x) => this.toRadians ? Math.tan(this.toRadians(x)) : Math.tan(x),
            asin: (x) => this.fromRadians ? this.fromRadians(Math.asin(x)) : Math.asin(x),
            acos: (x) => this.fromRadians ? this.fromRadians(Math.acos(x)) : Math.acos(x),
            atan: (x) => this.fromRadians ? this.fromRadians(Math.atan(x)) : Math.atan(x),

            // Logarithmic functions
            log: (x) => Math.log10(x), // Common logarithm (base 10)
            ln: (x) => Math.log(x),    // Natural logarithm (base e)

            // Power and root functions
            sqrt: (x) => Math.sqrt(x),
            exp: (x) => Math.exp(x),
            pow: (base, exp) => Math.pow(base, exp),

            // Rounding functions
            abs: (x) => Math.abs(x),
            floor: (x) => Math.floor(x),
            ceil: (x) => Math.ceil(x),
            round: (x) => Math.round(x),

            // Min/Max functions
            min: (...args) => Math.min(...args),
            max: (...args) => Math.max(...args)
        };
    }

    /**
     * Evaluate an expression from string
     * @param {string} expression - Expression to evaluate
     * @param {Object} options - Evaluation options
     * @returns {number} - Result of evaluation
     */
    evaluate(expression, options = {}) {
        try {
            // Set evaluation options
            this.angleMode = options.angleMode || 'deg';
            this.precision = options.precision || 10;

            // Set up angle conversion functions
            if (this.angleMode === 'deg') {
                this.toRadians = (deg) => (deg * Math.PI) / 180;
                this.fromRadians = (rad) => (rad * 180) / Math.PI;
            } else {
                this.toRadians = null;
                this.fromRadians = null;
            }

            // Check for common syntax errors before parsing
            const syntaxError = this.checkSyntaxErrors(expression);
            if (syntaxError) {
                throw new Error(syntaxError);
            }

            // Tokenize and parse
            const tokens = TokenizerModule.tokenize(expression);
            const ast = ASTBuilderModule.buildAST(tokens);

            // Evaluate AST
            const result = this.evaluateAST(ast);

            // Round to specified precision
            return this.roundToPrecision(result, this.precision);
        } catch (error) {
            // Provide user-friendly error messages
            throw new Error(this.getUserFriendlyError(error.message, expression));
        }
    }

    /**
     * Check for common syntax errors
     * @param {string} expression - Expression to check
     * @returns {string|null} - Error message or null if no errors
     */
    checkSyntaxErrors(expression) {
        // Check for empty expression
        if (!expression || expression.trim() === '') {
            return 'Expression is empty';
        }

        // Check for unmatched parentheses
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;
        if (openCount > closeCount) {
            return 'Missing closing parenthesis ")"';
        }
        if (closeCount > openCount) {
            return 'Extra closing parenthesis ")"';
        }

        // Check for invalid function usage
        const functions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'];
        for (const func of functions) {
            const funcRegex = new RegExp(`\\b${func}\\b`, 'g');
            const matches = expression.match(funcRegex);
            if (matches) {
                // Check if function is followed by something that looks like an argument
                const funcPattern = new RegExp(`\\b${func}\\b\\s*([^0-9(])`, 'g');
                if (funcPattern.test(expression)) {
                    return `Function "${func}" must be followed by a number or "(". Try: ${func}(value)`;
                }
            }
        }

        // Check for division by zero
        if (expression.includes('/0') || expression.includes('/ 0')) {
            return 'Division by zero';
        }

        // Check for invalid operators at start/end
        const trimmed = expression.trim();
        if (/^[+\-*/^=]$/.test(trimmed)) {
            return 'Expression cannot start with an operator';
        }
        if (/[+\-*/^=]$/.test(trimmed)) {
            return 'Expression cannot end with an operator';
        }

        return null;
    }

    /**
     * Convert technical errors to user-friendly messages
     * @param {string} errorMessage - Technical error message
     * @param {string} expression - Original expression
     * @returns {string} - User-friendly error message
     */
    getUserFriendlyError(errorMessage, expression) {
        // Map common technical errors to user-friendly messages
        const errorMap = {
            'Division by zero': 'Cannot divide by zero',
            'Unknown constant': 'Unknown mathematical constant. Try π (pi) or e',
            'Unknown function': 'Unknown function. Try sin, cos, tan, log, ln, sqrt',
            'Undefined variable': 'Variable not defined',
            'Invalid character': 'Invalid character in expression',
            'Missing closing parenthesis': 'Missing closing parenthesis ")"',
            'Extra closing parenthesis': 'Extra closing parenthesis ")"',
            'Expected': 'Invalid expression syntax'
        };

        for (const [technical, userFriendly] of Object.entries(errorMap)) {
            if (errorMessage.includes(technical)) {
                return userFriendly;
            }
        }

        // If no mapping found, return a generic helpful message
        return `Invalid expression: ${expression}. Try using proper syntax like: sin(30) + cos(45)`;
    }

    /**
     * Evaluate AST node
     * @param {Object} node - AST node to evaluate
     * @returns {number} - Result of evaluation
     */
    evaluateAST(node) {
        switch (node.type) {
            case 'NUMBER':
                return node.value;

            case 'CONSTANT':
                if (this.constants[node.name]) {
                    return this.constants[node.name];
                }
                throw new Error(`Unknown constant: ${node.name}`);

            case 'VARIABLE':
                if (this.variables.has(node.name)) {
                    return this.variables.get(node.name);
                }
                throw new Error(`Undefined variable: ${node.name}`);

            case 'BINARY_OP':
                return this.evaluateBinaryOp(node);

            case 'UNARY_OP':
                return this.evaluateUnaryOp(node);

            case 'FUNCTION_CALL':
                return this.evaluateFunctionCall(node);

            default:
                throw new Error(`Unknown AST node type: ${node.type}`);
        }
    }

    /**
     * Evaluate binary operation
     * @param {Object} node - Binary operation node
     * @returns {number} - Result of operation
     */
    evaluateBinaryOp(node) {
        const left = this.evaluateAST(node.left);
        const right = this.evaluateAST(node.right);

        switch (node.operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                if (right === 0) throw new Error('Division by zero');
                return left / right;
            case '^':
                return Math.pow(left, right);
            default:
                throw new Error(`Unknown binary operator: ${node.operator}`);
        }
    }

    /**
     * Evaluate unary operation
     * @param {Object} node - Unary operation node
     * @returns {number} - Result of operation
     */
    evaluateUnaryOp(node) {
        const operand = this.evaluateAST(node.operand);

        switch (node.operator) {
            case '+':
                return operand;
            case '-':
                return -operand;
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    }

    /**
     * Evaluate function call
     * @param {Object} node - Function call node
     * @returns {number} - Result of function call
     */
    evaluateFunctionCall(node) {
        const func = this.functions[node.name];
        if (!func) {
            throw new Error(`Unknown function: ${node.name}`);
        }

        const arg = this.evaluateAST(node.argument);
        return func(arg);
    }

    /**
     * Set a variable value
     * @param {string} name - Variable name
     * @param {number} value - Variable value
     */
    setVariable(name, value) {
        this.variables.set(name, value);
    }

    /**
     * Get a variable value
     * @param {string} name - Variable name
     * @returns {number} - Variable value
     */
    getVariable(name) {
        return this.variables.get(name);
    }

    /**
     * Clear all variables
     */
    clearVariables() {
        this.variables.clear();
    }

    /**
     * Add a custom function
     * @param {string} name - Function name
     * @param {Function} implementation - Function implementation
     */
    addFunction(name, implementation) {
        this.functions[name] = implementation;
    }

    /**
     * Add a custom constant
     * @param {string} name - Constant name
     * @param {number} value - Constant value
     */
    addConstant(name, value) {
        this.constants[name] = value;
    }

    /**
     * Round number to specified precision
     * @param {number} value - Value to round
     * @param {number} precision - Decimal places
     * @returns {number} - Rounded value
     */
    roundToPrecision(value, precision) {
        if (!isFinite(value)) return value;
        const factor = Math.pow(10, precision);
        return Math.round(value * factor) / factor;
    }

    /**
     * Get available functions
     * @returns {Array} - List of function names
     */
    getAvailableFunctions() {
        return Object.keys(this.functions);
    }

    /**
     * Get available constants
     * @returns {Array} - List of constant names
     */
    getAvailableConstants() {
        return Object.keys(this.constants);
    }

    /**
     * Get defined variables
     * @returns {Array} - List of variable names
     */
    getDefinedVariables() {
        return Array.from(this.variables.keys());
    }
}

// Export for module usage
const EvaluatorModule = new Evaluator();
