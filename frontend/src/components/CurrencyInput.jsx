import React, { useState } from 'react';

const CurrencyInput = ({ value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    // Format the value to currency format for en-US
    const formatCurrency = (value) => {
        const numberValue = parseFloat(value);
        return isNaN(numberValue) ? '' : numberValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    // Handle input change
    const handleChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and dots
        onChange(inputValue);
    };

    return (
        <div className="input-group">
            <span className="input-group-text">$</span>
            <input
                type={isFocused ? 'number' : 'text'}
                className="form-control"
                value={isFocused ? value : formatCurrency(value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
                required
                placeholder="3.50"
                aria-label="Currency amount"
            />
        </div>
    );
};

export default CurrencyInput;