/**
 * Expression Tokenizer Module
 *
 * Responsible for breaking mathematical expressions into tokens.
 * Handles numbers, operators, functions, constants, and parentheses.
 *
 * Follows Single Responsibility Principle: Only tokenization logic
 * Follows Open/Closed Principle: Can be extended for new token types
 */

class Tokenizer {
    constructor() {
        // Token types
        this.TOKEN_TYPES = {
            NUMBER: 'NUMBER',
            OPERATOR: 'OPERATOR',
            FUNCTION: 'FUNCTION',
            CONSTANT: 'CONSTANT',
            LPAREN: 'LPAREN',
            RPAREN: 'RPAREN',
            VARIABLE: 'VARIABLE',
            EOF: 'EOF'
        };

        // Mathematical operators
        this.operators = '+-*/^=!';

        // Bracket types
        this.openBrackets = '([{';
        this.closeBrackets = ')]}';

        // Mathematical functions
        this.functions = [
            'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
            'log', 'ln', 'sqrt', 'exp', 'abs', 'floor', 'ceil', 'round',
            'min', 'max', 'pow', 'root'
        ];

        // Mathematical constants
        this.constants = ['pi', 'e', 'π'];

        // Current position in expression
        this.position = 0;
        this.expression = '';
        this.currentChar = null;
    }

    /**
     * Tokenize a mathematical expression
     * @param {string} expression - Expression to tokenize
     * @returns {Array} - Array of tokens
     */
    tokenize(expression) {
        // Pre-process expression to handle implicit function calls
        expression = this.preprocessExpression(expression);

        this.expression = expression.replace(/\s+/g, ''); // Remove whitespace
        this.position = 0;
        this.currentChar = this.expression.length > 0 ? this.expression[0] : null;

        const tokens = [];

        while (this.currentChar !== null) {
            if (this.isDigit(this.currentChar) || this.currentChar === '.') {
                tokens.push(this.readNumber());
            } else if (this.isLetter(this.currentChar)) {
                tokens.push(this.readIdentifier());
            } else if (this.operators.includes(this.currentChar)) {
                tokens.push(this.readOperator());
            } else if (this.openBrackets.includes(this.currentChar)) {
                tokens.push({ type: this.TOKEN_TYPES.LPAREN, value: this.currentChar });
                this.advance();
            } else if (this.closeBrackets.includes(this.currentChar)) {
                tokens.push({ type: this.TOKEN_TYPES.RPAREN, value: this.currentChar });
                this.advance();
            } else {
                throw new Error(`Invalid character: ${this.currentChar}`);
            }
        }

        tokens.push({ type: this.TOKEN_TYPES.EOF, value: null });
        return tokens;
    }

    /**
     * Pre-process expression to handle implicit function calls
     * @param {string} expression - Raw expression
     * @returns {string} - Processed expression
     */
    preprocessExpression(expression) {
        // Handle implicit function calls like "sin 30" -> "sin(30)"
        // This regex finds function names followed by spaces and numbers/constants
        const funcPattern = /(\b(?:sin|cos|tan|asin|acos|atan|log|ln|sqrt|exp|abs|floor|ceil|round|min|max)\b)\s+([0-9]+(?:\.[0-9]+)?|\bpi\b|\be\b|\bπ\b)/g;

        expression = expression.replace(funcPattern, '$1($2)');

        // Also handle cases where function is followed by another function or expression
        // More complex patterns can be added here

        return expression;
    }

    /**
     * Read a number token (integer or decimal)
     * @returns {Object} - Number token
     */
    readNumber() {
        let result = '';

        while (this.currentChar !== null && (this.isDigit(this.currentChar) || this.currentChar === '.')) {
            result += this.currentChar;
            this.advance();
        }

        // Validate number format
        if (result.split('.').length > 2) {
            throw new Error('Invalid number format');
        }

        return {
            type: this.TOKEN_TYPES.NUMBER,
            value: parseFloat(result)
        };
    }

    /**
     * Read an identifier (function name, constant, or variable)
     * @returns {Object} - Identifier token
     */
    readIdentifier() {
        let result = '';

        while (this.currentChar !== null && this.isLetterOrDigit(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        // Determine token type
        if (this.functions.includes(result)) {
            return { type: this.TOKEN_TYPES.FUNCTION, value: result };
        } else if (this.constants.includes(result)) {
            return { type: this.TOKEN_TYPES.CONSTANT, value: result };
        } else {
            return { type: this.TOKEN_TYPES.VARIABLE, value: result };
        }
    }

    /**
     * Read an operator token
     * @returns {Object} - Operator token
     */
    readOperator() {
        const operator = this.currentChar;
        this.advance();
        return { type: this.TOKEN_TYPES.OPERATOR, value: operator };
    }

    /**
     * Advance to the next character
     */
    advance() {
        this.position++;
        if (this.position >= this.expression.length) {
            this.currentChar = null;
        } else {
            this.currentChar = this.expression[this.position];
        }
    }

    /**
     * Check if character is a digit
     * @param {string} char - Character to check
     * @returns {boolean} - Whether character is a digit
     */
    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    /**
     * Check if character is a letter
     * @param {string} char - Character to check
     * @returns {boolean} - Whether character is a letter
     */
    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === 'π';
    }

    /**
     * Check if character is a letter or digit
     * @param {string} char - Character to check
     * @returns {boolean} - Whether character is a letter or digit
     */
    isLetterOrDigit(char) {
        return this.isLetter(char) || this.isDigit(char);
    }

    /**
     * Get token type constants
     * @returns {Object} - Token type constants
     */
    getTokenTypes() {
        return this.TOKEN_TYPES;
    }
}

// Export for module usage
const TokenizerModule = new Tokenizer();
