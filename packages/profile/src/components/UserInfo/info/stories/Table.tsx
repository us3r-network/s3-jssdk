import { UserInfoContextValue } from "../UserInfoContext";
import UserInfoElements from "../UserInfoElements";

export const RenderProps = <T extends {}>(
  props: Partial<UserInfoContextValue<T>>
) => {
  return null;
};

export const Subcomponents = (props: Partial<typeof UserInfoElements>) => {};
