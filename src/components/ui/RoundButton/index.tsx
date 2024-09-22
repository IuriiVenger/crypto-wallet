import { Button, cn } from '@nextui-org/react';
import { FC } from 'react';
import { IconType } from 'react-icons';

export type RoundButtonProps = {
  id?: string;
  onClick?: () => void;
  title: string;
  Icon: IconType;
  wrapperClassname?: string;
  buttonClassname?: string;
  titleClassname?: string;
  active?: boolean;
  disabled?: boolean;
};

const RoundButton: FC<RoundButtonProps> = (props) => {
  const { id, onClick, title, Icon, active, disabled, titleClassname, wrapperClassname, buttonClassname } = props;

  return (
    <div key={id} className={cn('flex flex-col items-center justify-center gap-1.5', wrapperClassname)}>
      <Button
        isIconOnly
        color={active ? 'primary' : 'default'}
        className={cn(
          'h-16 w-16 text-2xl',
          !active && 'bg-white ',
          disabled && '!cursor-not-allowed opacity-50 hover:!opacity-50',
          buttonClassname,
        )}
        radius="full"
        onClick={onClick}
        disabled={disabled}
      >
        <Icon />
      </Button>
      <span className={cn('flex-shrink-0 text-sm font-medium capitalize', titleClassname)}>{title}</span>
    </div>
  );
};

export default RoundButton;
