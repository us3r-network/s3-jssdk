import { ButtonHTMLAttributes } from "react";
import { useAuthentication } from "@us3r-network/auth-with-rainbowkit";

export type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  textClassName?: string;
};

function LogoutButton({
  onClick,
  className = "us3r-LogoutButton",
  textClassName = "us3r-LogoutButton__text",
  ...otherProps
}: LogoutButtonProps) {
  const { signOut } = useAuthentication();
  return (
    <button
      className={className}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          return;
        }
        signOut();
      }}
      {...otherProps}
    >
      <span className={textClassName}>Logout</span>
    </button>
  );
}
export default LogoutButton;
