import { UserInfoEditFormContextValue } from "../UserInfoEditFormContext";
import UserInfoEditFormElements from "../UserInfoEditFormElements";

export const RenderProps = <T extends {}>(
  props: Partial<UserInfoEditFormContextValue<T>>
) => {
  return null;
};

export const Subcomponents = (
  props: Partial<typeof UserInfoEditFormElements>
) => {};
