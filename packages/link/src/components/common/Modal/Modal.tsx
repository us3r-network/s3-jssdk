import { AriaOverlayProps, ModalProviderProps } from "react-aria";
import {
  Modal as AriaModal,
  Dialog,
  Heading,
  ModalOverlayProps,
} from "react-aria-components";

export type ModalProps = AriaOverlayProps &
  ModalOverlayProps &
  ModalProviderProps & {
    title?: string;
  };
export function Modal({ children, title, ...props }: ModalProps) {
  return (
    <AriaModal data-common-element="Modal" {...props}>
      <Dialog data-common-element="Dialog">
        {title && <Heading data-common-element="Title">{title}</Heading>}
        {children}
      </Dialog>
    </AriaModal>
  );
}
