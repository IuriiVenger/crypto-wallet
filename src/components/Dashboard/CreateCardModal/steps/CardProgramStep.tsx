import { FC, useCallback } from 'react';

import { API } from '@/api/types';
import CustomOption from '@/components/ui/CustomOption';

export type CardProgramStepProps = {
  availablePrograms: API.Cards.CardConfig[];
  selectedProgram: API.Cards.CardConfig | null;
  setSelectedProgram: (program: API.Cards.CardConfig) => void;
};

const CardProgramStep: FC<CardProgramStepProps> = (props) => {
  const { availablePrograms, selectedProgram, setSelectedProgram } = props;

  const onCardTypeClick = useCallback(
    (value: boolean, key: string) => {
      const newProgram = availablePrograms.find((item) => item.id === key);
      if (value && newProgram) {
        setSelectedProgram(newProgram);
      }
    },
    [setSelectedProgram],
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        {availablePrograms.map((item) => (
          <CustomOption
            key={item.id}
            title={`${item.brand} ${item.form_factor}`}
            description={item.allowed_currencies.join(', ')}
            type="radio"
            isChecked={selectedProgram?.id === item.id}
            onChange={onCardTypeClick}
            value={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CardProgramStep;
