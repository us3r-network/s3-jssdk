import { useState } from "react";
import { useUserInfoState } from "../contexts";
import { UserInfoEditModal } from "../UserInfoEditModal";
import * as UserInfo from "../elements/UserInfo";

export function UserInfoChildren() {
  const { loading, isLoginUser } = useUserInfoState();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return loading ? (
    <>loading ...</>
  ) : (
    <>
      <section
        data-avatar-box=""
        onClick={() => {
          if (isLoginUser) {
            setIsOpenEdit(true);
          }
        }}
      >
        <UserInfo.Avatar />
      </section>
      <section data-name-box="">
        <UserInfo.Name />
      </section>
      <section data-bio-box="">
        <UserInfo.Bio />
      </section>
      <UserInfoEditModal isOpen={isOpenEdit} onOpenChange={setIsOpenEdit} />
    </>
  );
}
