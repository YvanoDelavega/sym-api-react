import React from "react";

const Field = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error = "",
  isrequired,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        onChange={onChange}
        value={value}
        type={type}
        className={"form-control " + (error && " is-invalid")}
        name={name}
        id={name}
        placeholder={placeholder|| label} 
        required={isrequired}
      />
      <p className="invalid-feedback">{error}</p>
    </div>
  );
};

export default Field;
