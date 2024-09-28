import { useBackButton } from '@telegram-apps/sdk-react';
import cn from 'classnames';
import { FC, memo, useEffect } from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri';

import { AppEnviroment } from '@/constants';
import { useAppSelector } from '@/store';
import { selectConfig } from '@/store/selectors';

type BackButtonProps = {
  onClick: () => void;
  text?: string;
  className?: string;
};

const TelegramBackButton: FC<Omit<BackButtonProps, 'text' & 'className'>> = ({ onClick }) => {
  const backButton = useBackButton(true);

  useEffect(() => {
    console.log('mount telegram back button');
    backButton?.show();
    backButton?.on('click', onClick);
    return () => {
      console.log('unmount telegram back button');
      backButton?.hide();
      backButton?.off('click', onClick);
    };
  }, [backButton]);

  return null;
};

const BackButton: FC<BackButtonProps> = ({ onClick, text = 'Back', className }) => {
  const { appEnviroment } = useAppSelector(selectConfig);

  if (appEnviroment === AppEnviroment.TELEGRAM) {
    return <TelegramBackButton onClick={onClick} />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('back-button text-foreground-2 mb-4 flex h-6 items-center gap-2 hover:opacity-hover ', className)}
    >
      <RiArrowLeftSLine />
      <span>{text}</span>
    </button>
  );
};

export default memo(BackButton);
