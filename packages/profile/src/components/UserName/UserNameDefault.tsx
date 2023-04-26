import styled from "styled-components";
import { UserName, UserNameProps } from "./UserName";

export interface UserNameDefaultProps extends UserNameProps {}

export function UserNameDefault({
  className = "us3r-UserName",
  ...props
}: UserNameDefaultProps) {
  return (
    <StyledUserName className={className} {...props}>
      {({ loading, username }) => {
        return loading ? "" : username;
      }}
    </StyledUserName>
  );
}

const StyledUserName = styled(UserName)`
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  opacity: 0.8;
`;
