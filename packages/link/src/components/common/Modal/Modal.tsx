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
    <AriaModal data-layout-element="Modal" {...props}>
      <Dialog data-layout-element="Dialog">
        {title && <Heading data-layout-element="Title">{title}</Heading>}
        {children}
      </Dialog>
    </AriaModal>
  );
}
