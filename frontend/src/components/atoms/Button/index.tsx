import type { ButtonProps } from "../../../types";
import "./index.css";

function Button({ className = "", type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={`atom-button ${className}`.trim()} {...rest} />
  );
}

export default Button;
