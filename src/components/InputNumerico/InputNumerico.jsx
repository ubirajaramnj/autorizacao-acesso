import React from 'react';
import InputMask from 'react-input-mask';
import './InputNumerico.css';

const InputNumero = ({ 
  label, 
  mask, 
  value, 
  onChange, 
  name, 
  placeholder, 
  error, 
  required = false,
  maxLength 
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && '*'}
      </label>
      {mask ? (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
        >
          {(inputProps) => (
            <input
              {...inputProps}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              id={name}
              name={name}
              className={`input-numeric ${error ? 'error' : ''}`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}
        </InputMask>
      ) : (
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`input-numeric ${error ? 'error' : ''}`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputNumero;