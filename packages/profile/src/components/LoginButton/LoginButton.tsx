import { ButtonHTMLAttributes } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import Username from "../UserName/UserName";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  avatarClassName?: string;
  nameTextClassName?: string;
  loginTextClassName?: string;
};

function LoginButton({
  onClick,
  className = "us3r-LoginButton",
  avatarClassName = "us3r-LoginButton__avatar",
  nameTextClassName = "us3r-LoginButton__text--name",
  loginTextClassName = "us3r-LoginButton__text--login",
  ...otherProps
}: LoginButtonProps) {
  const { signIn } = useAuthentication();
  const session = useSession();
  return (
    <button
      className={className}
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
        <span className={loginTextClassName}>Login</span>
      )}
    </button>
  );
}
export default LoginButton;
