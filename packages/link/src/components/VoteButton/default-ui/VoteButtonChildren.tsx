import { ButtonHTMLAttributes } from "react";
import ButtonLoading from "../../common/ButtonLoading/ButtonLoading";
import type { VoteButtonRenderProps } from "../VoteButton";

export interface VoteButtonChildrenProps extends VoteButtonRenderProps {}

export function VoteButtonChildren({
  loading,
  isVoted,
  votesCount,
}: VoteButtonChildrenProps) {
  return (
    <>
      {(loading && <ButtonLoading />) || (
        <>{isVoted ? <VoteWhiteIcon /> : <VoteIcon />}</>
      )}
      <span>{votesCount || 0}</span>
    </>
  );
}

function VoteIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
      <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
    </svg>
  );
}

function VoteWhiteIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M18 21H8V8l7-7 1.25 1.25q.175.175.288.475.112.3.112.575v.35L15.55 8H21q.8 0 1.4.6.6.6.6 1.4v2q0 .175-.038.375-.037.2-.112.375l-3 7.05q-.225.5-.75.85T18 21ZM6 8v13H2V8Z" />
    </svg>
  );
}
