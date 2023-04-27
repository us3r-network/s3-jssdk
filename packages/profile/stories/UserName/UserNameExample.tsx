import styled from "styled-components";
import { UserName, UserNameProps } from "@us3r-network/profile";

export interface UserNameExampleProps extends UserNameProps {}

export function UserNameExample({
  className = "us3r-UserName",
  ...props
}: UserNameExampleProps) {
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
  color: #999;
`;
