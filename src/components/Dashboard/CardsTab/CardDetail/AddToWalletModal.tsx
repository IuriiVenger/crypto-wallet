import { Button } from '@nextui-org/react';

import { FC } from 'react';

import { isAndroid, isIOS } from 'react-device-detect';

import CustomModal from '@/components/ui/CustomModal';

type AddWalletToModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

const AddToWalletModal: FC<AddWalletToModalProps> = (props) => {
  const { setIsModalOpen, isOpen } = props;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CustomModal
      header="Add to wallet"
      isOpen={isOpen}
      onOpenChange={setIsModalOpen}
      footer={
        <Button className="w-full" onClick={closeModal} color="primary" variant="bordered">
          Close
        </Button>
      }
    >
      {isIOS && (
        <>
          <p>Step 1: Open the Wallet App</p>
          <p>Step 2: Tap on the &ldquo;Plus&rdquo; Sign</p>
          <p>Step 3: Choose &ldquo;Add a Credit or Debit Card&rdquo;</p>
          <p>Step 4: Enter the Card Details Manually</p>
          <p>Step 5: Verify Your Card</p>
          <p>Step 6: Accept Terms and Conditions</p>
          <p>Step 7: Select &ldquo;Next&rdquo; to Complete the Adding Process</p>
        </>
      )}
      {isAndroid && (
        <>
          <p>Step 1: Open the Google Wallet app </p>
          <p>Step 2: At the bottom, tap Add to Wallet</p>
          <p>
            Step 3: Tap <strong>Payment card</strong>
          </p>
          <p>
            Step 4: Tap <strong>New credit or debit card</strong>.
          </p>
          <p>
            Step 5: At the bottom, tap <strong>Save and continue</strong>.
          </p>
          <p>
            Step 6: Read the Issuer Terms and tap <strong>Accept</strong>.
          </p>
          <p>Step 7: If you&apos;re asked to verify your payment method, choose an option from the list.</p>
        </>
      )}
    </CustomModal>
  );
};

export default AddToWalletModal;
