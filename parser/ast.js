/**
 * Abstract Syntax Tree (AST) Builder Module
 *
 * Responsible for constructing an AST from tokenized expressions.
 * Implements recursive descent parsing with proper operator precedence.
 *
 * Follows Single Responsibility Principle: Only AST construction
 * Follows Open/Closed Principle: Grammar rules can be extended
 */

class ASTBuilder {
    constructor() {
        this.tokens = [];
        this.position = 0;
        this.currentToken = null;

        // Node types
        this.NODE_TYPES = {
            NUMBER: 'NUMBER',
            BINARY_OP: 'BINARY_OP',
            UNARY_OP: 'UNARY_OP',
            FUNCTION_CALL: 'FUNCTION_CALL',
            CONSTANT: 'CONSTANT',
            VARIABLE: 'VARIABLE'
        };
    }

    /**
     * Build AST from tokens
     * @param {Array} tokens - Tokenized expression
     * @returns {Object} - Root AST node
     */
    buildAST(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.currentToken = this.tokens[0];

        const ast = this.parseExpression();

        if (this.currentToken.type !== 'EOF') {
            throw new Error('Unexpected token at end of expression');
        }

        return ast;
    }

    /**
     * Parse expression (handles addition and subtraction)
     * @returns {Object} - AST node
     */
    parseExpression() {
        let node = this.parseTerm();

        while (this.currentToken.type === 'OPERATOR' &&
               (this.currentToken.value === '+' || this.currentToken.value === '-')) {
            const operator = this.currentToken.value;
            this.consume('OPERATOR');
            const right = this.parseTerm();
            node = {
                type: this.NODE_TYPES.BINARY_OP,
                operator: operator,
                left: node,
                right: right
            };
        }

        return node;
    }

    /**
     * Parse term (handles multiplication and division)
     * @returns {Object} - AST node
     */
    parseTerm() {
        let node = this.parsePower();

        while (this.currentToken.type === 'OPERATOR' &&
               (this.currentToken.value === '*' || this.currentToken.value === '/')) {
            const operator = this.currentToken.value;
            this.consume('OPERATOR');
            const right = this.parsePower();
            node = {
                type: this.NODE_TYPES.BINARY_OP,
                operator: operator,
                left: node,
                right: right
            };
        }

        return node;
    }

    /**
     * Parse power operations
     * @returns {Object} - AST node
     */
    parsePower() {
        let node = this.parseFactor();

        if (this.currentToken.type === 'OPERATOR' && this.currentToken.value === '^') {
            this.consume('OPERATOR');
            const right = this.parsePower(); // Right associative
            node = {
                type: this.NODE_TYPES.BINARY_OP,
                operator: '^',
                left: node,
                right: right
            };
        }

        return node;
    }

    /**
     * Parse factor (numbers, parentheses, functions, unary operators)
     * @returns {Object} - AST node
     */
    parseFactor() {
        const token = this.currentToken;

        // Numbers
        if (token.type === 'NUMBER') {
            this.consume('NUMBER');
            return {
                type: this.NODE_TYPES.NUMBER,
                value: token.value
            };
        }

        // Constants
        if (token.type === 'CONSTANT') {
            this.consume('CONSTANT');
            return {
                type: this.NODE_TYPES.CONSTANT,
                name: token.value
            };
        }

        // Variables
        if (token.type === 'VARIABLE') {
            this.consume('VARIABLE');
            return {
                type: this.NODE_TYPES.VARIABLE,
                name: token.value
            };
        }

        // Parentheses and brackets (all treated as grouping)
        if (token.type === 'LPAREN') {
            const openBracket = token.value;
            this.consume('LPAREN');
            const node = this.parseExpression();

            // Find matching closing bracket
            const expectedClose = this.getMatchingBracket(openBracket);
            try {
                this.consume('RPAREN');
                const closeBracket = this.tokens[this.position - 1].value;
                if (closeBracket !== expectedClose) {
                    throw new Error(`Mismatched brackets: ${openBracket} closed with ${closeBracket}`);
                }
            } catch (error) {
                throw new Error(`Expected closing bracket ${expectedClose} for ${openBracket}`);
            }

            return node;
        }

        // Functions
        if (token.type === 'FUNCTION') {
            const functionName = token.value;
            this.consume('FUNCTION');
            this.consume('LPAREN');
            const argument = this.parseExpression();
            this.consume('RPAREN');

            return {
                type: this.NODE_TYPES.FUNCTION_CALL,
                name: functionName,
                argument: argument
            };
        }

        // Unary operators
        if (token.type === 'OPERATOR' && (token.value === '+' || token.value === '-')) {
            const operator = token.value;
            this.consume('OPERATOR');
            const operand = this.parseFactor();
            return {
                type: this.NODE_TYPES.UNARY_OP,
                operator: operator,
                operand: operand
            };
        }

        throw new Error(`Unexpected token: ${token.type} ${token.value}`);
    }

    /**
     * Consume a token of expected type
     * @param {string} tokenType - Expected token type
     */
    consume(tokenType) {
        if (this.currentToken.type !== tokenType) {
            throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
        }

        this.position++;
        this.currentToken = this.tokens[this.position] || { type: 'EOF' };
    }

    /**
     * Get the matching closing bracket for an opening bracket
     * @param {string} openBracket - Opening bracket character
     * @returns {string} - Matching closing bracket
     */
    getMatchingBracket(openBracket) {
        const bracketPairs = {
            '(': ')',
            '[': ']',
            '{': '}'
        };
        return bracketPairs[openBracket] || ')';
    }

    /**
     * Get node type constants
     * @returns {Object} - Node type constants
     */
    getNodeTypes() {
        return this.NODE_TYPES;
    }

    /**
     * Check if more tokens are available
     * @returns {boolean} - Whether more tokens exist
     */
    hasMoreTokens() {
        return this.currentToken.type !== 'EOF';
    }

    /**
     * Peek at the next token without consuming it
     * @returns {Object} - Next token
     */
    peek() {
        const nextPos = this.position + 1;
        return this.tokens[nextPos] || { type: 'EOF' };
    }
}

// Export for module usage
const ASTBuilderModule = new ASTBuilder();
