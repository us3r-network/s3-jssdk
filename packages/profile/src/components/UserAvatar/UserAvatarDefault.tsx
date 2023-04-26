import styled from "styled-components";
import AvatarLoadingSvg from "./avatar-loading.svg";
import { UserAvatar, UserAvatarProps } from "./UserAvatar";

export interface UserAvatarDefaultProps extends UserAvatarProps {
  className?: string;
  imgClassName?: string;
}

export function UserAvatarDefault({
  className = "us3r-UserAvatar",
  imgClassName = "us3r-UserAvatar__img",
  ...props
}: UserAvatarDefaultProps) {
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
