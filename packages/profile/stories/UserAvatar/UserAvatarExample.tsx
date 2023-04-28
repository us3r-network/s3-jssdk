import styled from "styled-components";
import AvatarLoadingSvg from "./avatar-loading.svg";
import { UserAvatar, UserAvatarProps } from "@us3r-network/profile";

export interface UserAvatarExampleProps extends UserAvatarProps {
  className?: string;
  imgClassName?: string;
}

export function UserAvatarExample({
  className = "us3r-UserAvatar",
  imgClassName = "us3r-UserAvatar__img",
  ...props
}: UserAvatarExampleProps) {
  return (
    <StyledUserAvatar className={className} {...props}>
      {({ loading, avatarSrc }) => {
        return (
          <AvatarImage
            className={imgClassName}
            src={loading ? AvatarLoadingSvg : avatarSrc}
          />
        );
      }}
    </StyledUserAvatar>
  );
}
const StyledUserAvatar = styled(UserAvatar)`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
`;
const AvatarImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;
