import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  pending?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  pending = false,
  icon,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!pending && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`
        btn 
        ${variant === "primary" ? "btn-primary" : "btn-secondary"}
        ${pending ? "opacity-50 cursor-not-allowed" : ""}
        flex items-center justify-center
      `}
      disabled={pending}
      onClick={handleClick}
      {...props}
    >
      {pending ? (
        "Loading..."
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
