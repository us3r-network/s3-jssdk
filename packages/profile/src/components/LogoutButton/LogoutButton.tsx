import { ButtonHTMLAttributes } from "react";
import { Button, Text } from "rebass/styled-components";
import { useAuthentication } from "../ProfileProvider/AuthenticationContext";

export type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  textClassName?: string;
};

function LogoutButton({
  onClick,
  textClassName = "us3r-LogoutButton__text",
  ...otherProps
}: LogoutButtonProps) {
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
      {...otherProps}
    >
      <Text variant={"heading"} className={textClassName}>
        Logout
      </Text>
    </Button>
  );
}
export default LogoutButton;
