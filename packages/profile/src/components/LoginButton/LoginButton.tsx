import { ButtonHTMLAttributes } from "react";
import { Text } from "rebass/styled-components";
import UserAvatar from "../UserAvatar/UserAvatar";
import { Button } from "rebass/styled-components";
import Username from "../UserName/UserName";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  avatarClassName?: string;
  textClassName?: string;
  nameTextClassName?: string;
  loginTextClassName?: string;
};

function LoginButton({
  onClick,
  avatarClassName = "us3r-LoginButton__avatar",
  nameTextClassName = "us3r-LoginButton__text--name",
  loginTextClassName = "us3r-LoginButton__text--login",
  ...otherProps
}: LoginButtonProps) {
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
        if (!session) {
          signIn();
        }
      }}
      {...otherProps}
    >
      {session ? (
        <>
          <UserAvatar did={session.id} className={avatarClassName} />
          <Username did={session.id} className={nameTextClassName} />
        </>
      ) : (
        <Text variant={"heading"} className={loginTextClassName}>
          Login
        </Text>
      )}
    </Button>
  );
}
export default LoginButton;
