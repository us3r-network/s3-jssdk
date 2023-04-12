import { ButtonHTMLAttributes } from "react";
import { Text } from "rebass/styled-components";
import UserAvatar from "../UserAvatar/UserAvatar";
import { Button } from "rebass/styled-components";
import Username from "../UserName/UserName";
import {
  useAuthentication,
  useSession,
} from "../ProfileProvider/AuthenticationContext";

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function LoginButton({ onClick, ...otherProps }: LoginButtonProps) {
  const { signIn } = useAuthentication();
  const session = useSession();
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          return;
        }
        signIn();
      }}
      className="us3r-LoginButton"
      {...otherProps}
    >
      {session ? (
        <>
          <UserAvatar did={session.id} className="us3r-LoginButton__avatar" />
          <Text className="us3r-LoginButton__text us3r-LoginButton__text--login">
            <Username did={session.id} />
          </Text>
        </>
      ) : (
        <Text
          variant={"heading"}
          className="us3r-LoginButton__text us3r-LoginButton__text--logout"
        >
          Login
        </Text>
      )}
    </Button>
  );
}
export default LoginButton;
