import SumsubWebSdk from '@sumsub/websdk-react';
import { FC } from 'react';

type KycProps = {
  accessToken: string;
};

const Kyc: FC<KycProps> = ({ accessToken }: KycProps) => {
  const errorHandler = (e: any) => {
    // eslint-disable-next-line no-console
    console.log(e);
  };
  const messageHandler = (message: any) => {
    // eslint-disable-next-line no-console
    console.log(message);
  };

  return (
    <div className="flex min-h-96 items-center justify-center">
      <SumsubWebSdk
        className="kyc-container"
        accessToken={accessToken}
        expirationHandler={() => Promise.resolve(accessToken)}
        config={{
          i18n: {
            document: {
              subTitles: {
                IDENTITY: 'Upload a document that proves your identity',
              },
            },
          },
        }}
        options={{ addViewportTag: false, adaptIframeHeight: true }}
        onMessage={messageHandler}
        onError={errorHandler}
      />
    </div>
  );
};

export default Kyc;
