import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react';
import { useBackButton, useMainButton } from '@telegram-apps/sdk-react';
import cn from 'classnames';
import { FC, ReactNode, useEffect } from 'react';

import { framerMotionAnimations } from '@/config/animations';
import { AppEnviroment } from '@/constants';
import useBreakpoints from '@/hooks/useBreakpoints';
import { useAppSelector } from '@/store';
import { selectConfig } from '@/store/selectors';

type CustomModalProps = ModalProps & {
  header?: ReactNode | string;
  footer?: ReactNode | string;
  contentClassName?: string;
  bodyClassname?: string;
  confirmButtonText?: string;
  confirmButtonDisabled?: boolean;
  onConfirm?: () => void;
  hideConfirmButton?: boolean;
};

const CustomModal: FC<CustomModalProps> = (props) => {
  const { mdBreakpoint } = useBreakpoints();
  const { appEnviroment } = useAppSelector(selectConfig);
  const isTelegramEnviroment = appEnviroment === AppEnviroment.TELEGRAM;

  const {
    size,
    scrollBehavior,
    motionProps,
    children,
    header,
    footer,
    isOpen,
    className,
    contentClassName,
    bodyClassname,
    ...otherProps
  } = props;

  const responsiveSize = mdBreakpoint ? 'md' : 'full';
  const modalSize = size || responsiveSize;
  const responsiveMotionProps = mdBreakpoint ? { variants: framerMotionAnimations.downEnterExit } : undefined;
  const modalMotionProps = motionProps || responsiveMotionProps;

  useEffect(() => {
    if (isOpen && !mdBreakpoint && window) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isOpen]);

  return (
    <Modal
      motionProps={modalMotionProps}
      scrollBehavior={scrollBehavior}
      size={modalSize}
      isOpen={isOpen}
      {...otherProps}
      disableAnimation={!mdBreakpoint}
      className={cn('overflow-y-auto', className)}
    >
      <ModalContent className={cn('fixed left-0 top-0 max-h-svh md:static md:max-h-[90vh]', contentClassName)}>
        {!!header && <ModalHeader>{header}</ModalHeader>}
        <ModalBody className={cn('pb-10 shadow-inner sm:max-h-[90vh]', bodyClassname)}>{children}</ModalBody>

        <ModalFooter
          className="relative z-10 flex min-h-1 w-full flex-col pb-6 md:pb-4"
          style={{
            boxShadow:
              '0px -10px 6px -3px rgba(255,255,255,0.95), 0px -20px 6px -3px rgba(255,255,255,0.85), 0px -31px 6px -3px rgba(255,255,255,0.8)',
          }}
        >
          {footer}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const TelegramModal: FC<CustomModalProps> = (props) => {
  const backButton = useBackButton(true);
  const mainButton = useMainButton(true);

  console.log('mainButton', mainButton);
  console.log('backButton', backButton);

  const {
    children,
    header,
    isOpen,
    onOpenChange,
    contentClassName,
    bodyClassname,
    onConfirm,
    confirmButtonText,
    confirmButtonDisabled,
    hideConfirmButton,
    ...otherProps
  } = props;

  console.log(confirmButtonText);

  const closeModal = () => {
    onOpenChange && onOpenChange(false);
  };

  const onConfirmButtonTextChanged = () => {
    if (!mainButton || !confirmButtonText) return;

    mainButton.setText(confirmButtonText);
    console.log('set main button text', confirmButtonText);
  };

  const onOpenChangeHandler = () => {
    if (!backButton || !mainButton) return;

    if (isOpen) {
      backButton.show();
      console.log('backButtonShow');
      backButton.on('click', closeModal);
      if (!hideConfirmButton) {
        mainButton.show();
        onConfirmButtonTextChanged();
        console.log('mainButtonShow');
      }
    } else {
      backButton.hide();
      console.log('backButtonHide');
      if (!hideConfirmButton) {
        mainButton.hide();
        console.log('mainButtonHide');
      }
    }
  };

  const onConfirmButtonDisabledChanged = () => {
    if (!mainButton) return;
    confirmButtonDisabled ? mainButton.disable() : mainButton.enable();
  };

  const onOnConfirmChanged = () => {
    if (!mainButton) return;

    mainButton.on('click', () => {
      onConfirm && onConfirm();
    });
  };

  useEffect(() => {
    onOpenChangeHandler();
  }, [isOpen]);

  useEffect(() => {
    onConfirmButtonTextChanged();
  }, [confirmButtonText]);

  useEffect(() => {
    onConfirmButtonDisabledChanged();
  }, [confirmButtonDisabled]);

  useEffect(() => {
    onOnConfirmChanged();
  }, [onConfirm]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} {...otherProps}>
      <ModalContent className={cn('fixed left-0 top-0 max-h-svh md:static md:max-h-[90vh]', contentClassName)}>
        {!!header && <ModalHeader>{header}</ModalHeader>}
        <ModalBody className={cn('pb-10 shadow-inner sm:max-h-[90vh]', bodyClassname)}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const WebModal: FC<CustomModalProps> = (props) => {
  const {
    children,
    header,
    className,
    contentClassName,
    bodyClassname,
    confirmButtonDisabled,
    confirmButtonText,
    onOpenChange,
    onConfirm,
    hideConfirmButton,
    ...otherProps
  } = props;

  const closeModal = () => {
    onOpenChange && onOpenChange(false);
  };

  return (
    <Modal {...otherProps} className={cn('overflow-y-auto', className)}>
      <ModalContent className={cn('fixed left-0 top-0 max-h-svh md:static md:max-h-[90vh]', contentClassName)}>
        {!!header && <ModalHeader>{header}</ModalHeader>}
        <ModalBody className={cn('pb-10 shadow-inner sm:max-h-[90vh]', bodyClassname)}>{children}</ModalBody>

        <ModalFooter
          className="relative z-10 flex min-h-1 w-full flex-col pb-6 md:pb-4"
          style={{
            boxShadow:
              '0px -10px 6px -3px rgba(255,255,255,0.95), 0px -20px 6px -3px rgba(255,255,255,0.85), 0px -31px 6px -3px rgba(255,255,255,0.8)',
          }}
        >
          {!hideConfirmButton && (
            <Button isDisabled={confirmButtonDisabled} color="primary" radius="md" onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          )}

          <Button onClick={closeModal} className="w-full" color="primary" variant="bordered">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const NewCustomModal: FC<CustomModalProps> = (props) => {
  const { mdBreakpoint } = useBreakpoints();
  const { appEnviroment } = useAppSelector(selectConfig);
  const { size, motionProps, isOpen } = props;

  const responsiveSize = mdBreakpoint ? 'md' : 'full';
  const modalSize = size || responsiveSize;
  const responsiveMotionProps = mdBreakpoint ? { variants: framerMotionAnimations.downEnterExit } : undefined;
  const modalMotionProps = motionProps || responsiveMotionProps;
  const isTelegramEnviroment = appEnviroment === AppEnviroment.TELEGRAM;

  useEffect(() => {
    if (isOpen && !mdBreakpoint && window) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isOpen]);

  const modifiedProps = { ...props, motionProps: modalMotionProps, size: modalSize };

  return isTelegramEnviroment ? <TelegramModal {...modifiedProps} /> : <WebModal {...modifiedProps} />;
};

export default CustomModal;
