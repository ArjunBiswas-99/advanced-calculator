# Advanced Scientific Calculator

A modern, feature-rich scientific calculator built with HTML, CSS, and JavaScript. This calculator provides a sleek, professional interface with comprehensive mathematical capabilities suitable for students, professionals, and researchers. 

## Features

### Core Functionality

- __Basic Operations__: Addition, subtraction, multiplication, division
- __Scientific Functions__: Trigonometric, logarithmic, exponential functions
- __Advanced Mathematics__: Algebra, calculus, matrix operations, statistics, complex numbers
- __Unit Conversion__: Comprehensive unit conversion engine
- __Graphing__: 2D function visualization with pan and zoom capabilities
- __Programmer Mode__: Binary, hexadecimal, and octal conversions with bitwise operations

### UI/UX Features

- __Modern Dark Theme__: Sleek dark interface with gradient backgrounds and glass-morphism effects
- __Responsive Design__: Adapts to different screen sizes while maintaining usability
- __Fixed Display Area__: Expression input remains stable when switching modes
- __Smooth Animations__: Hover effects, press animations, and visual feedback
- __Color-Coded Buttons__: Intuitive color coding for different function types
- __History Panel__: Keeps track of previous calculations
- __Memory Functions__: Store and recall values with M+, M-, MR, MC

### Technical Features

- __AST-Based Parsing__: Safe expression evaluation without using eval()
- __High Precision__: Configurable precision arithmetic
- __Error Handling__: User-friendly error messages and validation
- __Extensible Architecture__: Modular design allowing easy feature additions

## User Interface

### Layout Structure

The calculator interface is organized into the following sections:

1. __Display Panel__

   - Expression input with cursor positioning
   - Live preview showing calculation results
   - Clear visual feedback for errors

2. __Mode Switcher__

   - Basic: Standard calculator functions
   - Scientific: Advanced mathematical functions
   - Advanced: Specialized mathematical tools

3. __Content Area__

   - Scrollable container for calculator panels
   - Maintains consistent positioning across modes
   - Responsive to different screen sizes

4. __History Panel__

   - Stores previous calculations
   - Click to recall expressions
   - Scrollable for easy access

### Visual Design

- __Color Scheme__: Dark theme with vibrant accent colors for different function types
- __Typography__: Inter font for UI elements, SF Mono for expressions
- __Spacing__: Consistent padding and margins for visual hierarchy
- __Animations__: Subtle transitions and hover effects for enhanced feedback

## Mathematical Capabilities

### Basic Operations

- Arithmetic operations (+, -, *, /, %)
- Parentheses for expression grouping
- Decimal point and negative numbers
- Clear (C) and Clear Entry (CE) functions

### Scientific Functions

- Trigonometric functions: sin, cos, tan, asin, acos, atan
- Logarithmic functions: log (base 10), ln (natural log)
- Exponential functions: exp, power (^)
- Square root (√), factorial (!)
- Constants: π (pi), e (Euler's number), φ (golden ratio)

### Advanced Mathematics

- __Algebra Module__:

- Solve linear equations (ax + b = 0)

- Solve quadratic equations (ax² + bx + c = 0)

- Factor algebraic expressions

- Expand algebraic expressions

- __Calculus Module__:

  - Derivatives and integrals
  - Limits and series
  - Numerical integration methods

- __Matrix Module__:

  - Matrix operations (addition, subtraction, multiplication)
  - Determinants and inverses
  - Eigenvalues and eigenvectors

- __Complex Numbers Module__:

  - Complex arithmetic (a + bi)
  - Magnitude, argument, and conjugate
  - Complex trigonometric and exponential functions

- __Statistics Module__:

  - Descriptive statistics (mean, median, mode, variance, standard deviation)
  - Probability distributions
  - Regression analysis

- __Graphing Module__:

- 2D function plotting

- Multiple function overlays

- Parametric and polar plotting

- Interactive pan and zoom

- __Programmer Module__:

  - Base conversions (binary, octal, decimal, hexadecimal)
  - Bitwise operations (AND, OR, XOR, shifts)
  - ASCII/Unicode conversions

- __Units Module__:

  - Length, weight, time, temperature conversions
  - Pressure, energy, power units
  - Data size units

### Constants Library

The calculator includes an extensive library of mathematical and physical constants:

__Mathematical Constants__:

- π (pi): 3.141592653589793
- e (Euler's number): 2.71828459045
- τ (tau): 2π = 6.283185307179586
- φ (golden ratio): 1.618033988749895
- ln(2), ln(10), log₂(e), log₁₀(e)

__Physical Constants__:

- Speed of light: 299,792,458 m/s
- Planck constant: 6.62607015×10⁻³⁴ J⋅s
- Gravitational constant: 6.67430×10⁻¹¹ m³⋅kg⁻¹⋅s⁻²
- Avogadro's number: 6.02214076×10²³ mol⁻¹
- Boltzmann constant: 1.380649×10⁻²³ J/K
- And many more...

## Usage

### Basic Mode

- Standard calculator operations
- Memory functions (M+, M-, MR, MC)
- Percentage calculations
- Square root and power functions

### Scientific Mode

- Access to trigonometric, logarithmic, and exponential functions
- Constants (π, e) available
- Parentheses for complex expressions
- Angle modes (degrees/radians)

### Advanced Mode

- Access to specialized mathematical tools
- Algebraic equation solving
- Matrix operations
- Statistical analysis
- Complex number calculations

### Keyboard Support

- Standard keyboard input for numbers and operators
- Arrow keys for cursor navigation in the expression field
- Enter for equals, Escape for clear
- Backspace for delete

## Technical Architecture

### Core Components

- __Main Application__: Coordinates UI components and modules
- __Parser System__: Tokenizer → AST Builder → Evaluator for safe expression evaluation
- __UI Modules__: Display, buttons, and panels with progressive disclosure UX
- __Mathematical Modules__: Specialized functionality for different domains

### Security

- No use of eval() for expression evaluation
- AST-based parsing prevents code injection
- Input validation and sanitization
- Sandboxed evaluation environment

### Performance

- Optimized rendering and animations
- Efficient expression evaluation
- Memory management for history and variables
- Web Workers for heavy calculations (optional)

## Installation

No installation required - the calculator runs directly in the browser:

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. Start using the calculator

## Development

The calculator follows a modular architecture that allows for easy extension:

- __UI Components__: Located in the `ui/` directory
- __Mathematical Modules__: Located in the `modules/` directory
- __Parser System__: Located in the `parser/` directory
- __Utilities__: Located in the `utils/` directory

### Adding New Features

1. Create a new module in the `modules/` directory
2. Implement the required functionality
3. Register the module in `index.html`
4. Update the UI to access the new functionality

## Browser Compatibility

- Modern browsers with JavaScript ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with touch support

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
