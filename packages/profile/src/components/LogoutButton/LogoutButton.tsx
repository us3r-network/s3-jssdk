import { ButtonHTMLAttributes } from "react";
import { Text } from "rebass/styled-components";
import { Button } from "rebass/styled-components";
import { useAuthentication } from "../ProfileProvider/AuthenticationContext";

export type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function LogoutButton({ onClick, ...otherProps }: LogoutButtonProps) {
  const { signOut } = useAuthentication();
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          return;
        }
        signOut();
      }}
      className="us3r-LogoutButton"
      {...otherProps}
    >
      <Text variant={"heading"} className="us3r-LogoutButton__text">
        Login
      </Text>
    </Button>
  );
}
export default LogoutButton;
