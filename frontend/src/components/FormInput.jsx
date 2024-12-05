import React from 'react';

function FormInput({ label, type, value, onChange, options, ...props }) {
    return (
        <div className="form-group">
            <p style={{ fontSize: '1.2rem' }}>{label}</p>
            {type === 'select' ? (
                <select value={value} onChange={onChange} {...props}>
                    <option value="" disabled>Select your role</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input type={type} value={value} onChange={onChange} {...props} />
            )}
        </div>
    );
}

export default FormInput;
