/**
 * Mathematical and Physical Constants Module
 *
 * Provides a comprehensive library of mathematical and physical constants
 * for use throughout the calculator application.
 *
 * Follows Single Responsibility Principle: Only constant definitions
 * Follows Open/Closed Principle: New constants can be added without modification
 */

class ConstantsLibrary {
    constructor() {
        // Mathematical constants
        this.mathematical = {
            // Basic constants
            PI: Math.PI,
            E: Math.E,
            TAU: 2 * Math.PI, // τ = 2π
            PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio φ

            // Special values
            LN2: Math.LN2,        // ln(2)
            LN10: Math.LN10,      // ln(10)
            LOG2E: Math.LOG2E,    // log₂(e)
            LOG10E: Math.LOG10E,  // log₁₀(e)
            SQRT1_2: Math.SQRT1_2, // √(1/2)
            SQRT2: Math.SQRT2,     // √2
        };

        // Physical constants (SI units)
        this.physical = {
            // Universal constants
            SPEED_OF_LIGHT: 299792458,           // c (m/s)
            PLANCK_CONSTANT: 6.62607015e-34,     // h (J⋅s)
            REDUCED_PLANCK: 1.0545718e-34,       // ℏ = h/(2π) (J⋅s)
            GRAVITATIONAL_CONSTANT: 6.67430e-11, // G (m³⋅kg⁻¹⋅s⁻²)
            AVOGADRO_NUMBER: 6.02214076e23,      // N_A (mol⁻¹)

            // Electromagnetic constants
            ELEMENTARY_CHARGE: 1.602176634e-19,  // e (C)
            VACUUM_PERMEABILITY: 1.25663706212e-6, // μ₀ (H/m)
            VACUUM_PERMITTIVITY: 8.854187817e-12, // ε₀ (F/m)

            // Atomic and nuclear constants
            ELECTRON_MASS: 9.1093837015e-31,     // m_e (kg)
            PROTON_MASS: 1.67262192369e-27,      // m_p (kg)
            NEUTRON_MASS: 1.67492749804e-27,     // m_n (kg)
            ATOMIC_MASS_UNIT: 1.66053906660e-27, // u (kg)

            // Thermodynamic constants
            BOLTZMANN_CONSTANT: 1.380649e-23,    // k_B (J/K)
            GAS_CONSTANT: 8.314462618,           // R (J⋅mol⁻¹⋅K⁻¹)
            STEFAN_BOLTZMANN: 5.670374419e-8,    // σ (W⋅m⁻²⋅K⁻⁴)

            // Astronomical constants
            ASTRONOMICAL_UNIT: 149597870700,     // AU (m)
            PARSEC: 3.085677581467192e16,         // pc (m)
            LIGHT_YEAR: 9.4607304725808e15,       // ly (m)
            SOLAR_MASS: 1.98847e30,               // M_☉ (kg)
            EARTH_MASS: 5.9722e24,                // M_⊕ (kg)
            EARTH_RADIUS: 6371000,                // R_⊕ (m)
        };

        // Alternative names/symbols for constants
        this.aliases = {
            // Mathematical
            'pi': 'PI',
            'π': 'PI',
            'e': 'E',
            'tau': 'TAU',
            'τ': 'TAU',
            'phi': 'PHI',
            'φ': 'PHI',
            'golden_ratio': 'PHI',

            // Physical
            'c': 'SPEED_OF_LIGHT',
            'h': 'PLANCK_CONSTANT',
            'hbar': 'REDUCED_PLANCK',
            'ℏ': 'REDUCED_PLANCK',
            'G': 'GRAVITATIONAL_CONSTANT',
            'N_A': 'AVOGADRO_NUMBER',
            'q': 'ELEMENTARY_CHARGE',
            'mu_0': 'VACUUM_PERMEABILITY',
            'μ₀': 'VACUUM_PERMEABILITY',
            'epsilon_0': 'VACUUM_PERMITTIVITY',
            'ε₀': 'VACUUM_PERMITTIVITY',
            'm_e': 'ELECTRON_MASS',
            'm_p': 'PROTON_MASS',
            'm_n': 'NEUTRON_MASS',
            'u': 'ATOMIC_MASS_UNIT',
            'amu': 'ATOMIC_MASS_UNIT',
            'k': 'BOLTZMANN_CONSTANT',
            'k_B': 'BOLTZMANN_CONSTANT',
            'R': 'GAS_CONSTANT',
            'sigma': 'STEFAN_BOLTZMANN',
            'σ': 'STEFAN_BOLTZMANN',
            'AU': 'ASTRONOMICAL_UNIT',
            'au': 'ASTRONOMICAL_UNIT',
            'pc': 'PARSEC',
            'ly': 'LIGHT_YEAR',
            'M_sun': 'SOLAR_MASS',
            'M_sol': 'SOLAR_MASS',
            'M_earth': 'EARTH_MASS',
            'R_earth': 'EARTH_RADIUS',
        };
    }

    /**
     * Get a constant by name or alias
     * @param {string} name - Constant name or alias
     * @returns {number|null} - Constant value or null if not found
     */
    get(name) {
        // Check aliases first
        if (this.aliases[name]) {
            name = this.aliases[name];
        }

        // Check mathematical constants
        if (this.mathematical[name]) {
            return this.mathematical[name];
        }

        // Check physical constants
        if (this.physical[name]) {
            return this.physical[name];
        }

        return null;
    }

    /**
     * Get all available constant names
     * @returns {Array} - Array of constant names
     */
    getAllNames() {
        const names = [];

        // Add mathematical constants
        names.push(...Object.keys(this.mathematical));

        // Add physical constants
        names.push(...Object.keys(this.physical));

        // Add aliases
        names.push(...Object.keys(this.aliases));

        return [...new Set(names)]; // Remove duplicates
    }

    /**
     * Get constants by category
     * @param {string} category - Category name ('mathematical' or 'physical')
     * @returns {Object} - Constants object for the category
     */
    getByCategory(category) {
        switch (category) {
            case 'mathematical':
                return { ...this.mathematical };
            case 'physical':
                return { ...this.physical };
            default:
                return {};
        }
    }

    /**
     * Add a custom constant
     * @param {string} name - Constant name
     * @param {number} value - Constant value
     * @param {string} category - Category ('mathematical' or 'physical')
     */
    addConstant(name, value, category = 'mathematical') {
        if (category === 'mathematical') {
            this.mathematical[name] = value;
        } else if (category === 'physical') {
            this.physical[name] = value;
        }
    }

    /**
     * Add an alias for a constant
     * @param {string} alias - Alias name
     * @param {string} constantName - Original constant name
     */
    addAlias(alias, constantName) {
        this.aliases[alias] = constantName;
    }

    /**
     * Check if a name is a valid constant
     * @param {string} name - Name to check
     * @returns {boolean} - Whether the name is a valid constant
     */
    isConstant(name) {
        return this.get(name) !== null;
    }

    /**
     * Get formatted constant information
     * @param {string} name - Constant name
     * @returns {Object|null} - Formatted constant info or null
     */
    getInfo(name) {
        const value = this.get(name);
        if (value === null) return null;

        // Determine category
        let category = 'mathematical';
        let originalName = name;

        if (this.aliases[name]) {
            originalName = this.aliases[name];
        }

        if (this.physical[originalName]) {
            category = 'physical';
        }

        return {
            name: originalName,
            alias: name !== originalName ? name : null,
            value: value,
            category: category,
            formatted: this.formatValue(value)
        };
    }

    /**
     * Format a numeric value for display
     * @param {number} value - Value to format
     * @returns {string} - Formatted value
     */
    formatValue(value) {
        if (Math.abs(value) < 0.001 || Math.abs(value) > 10000) {
            return value.toExponential(6);
        }
        return value.toPrecision(10).replace(/\.?0+$/, '');
    }

    /**
     * Get constants suitable for calculator use (common ones)
     * @returns {Object} - Common constants
     */
    getCalculatorConstants() {
        return {
            'π': this.mathematical.PI,
            'e': this.mathematical.E,
            'φ': this.mathematical.PHI,
            'τ': this.mathematical.TAU,
            'c': this.physical.SPEED_OF_LIGHT,
            'G': this.physical.GRAVITATIONAL_CONSTANT,
            'h': this.physical.PLANCK_CONSTANT,
            'k': this.physical.BOLTZMANN_CONSTANT,
            'N_A': this.physical.AVOGADRO_NUMBER,
        };
    }
}

// Export for module usage
const ConstantsModule = new ConstantsLibrary();
