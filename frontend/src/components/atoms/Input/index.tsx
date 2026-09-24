import type { InputProps } from "../../../types";
import "./index.css";

function Input({ className = "", ...rest }: InputProps) {
  return <input className={`atom-input ${className}`.trim()} {...rest} />;
}

export default Input;
