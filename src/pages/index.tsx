import type { NextPage } from 'next';
import Image from 'next/image';
import useAppTheme from '@app-hooks/use-app-theme';

const Home: NextPage = () => {
  const theme = useAppTheme();
  const logoUrl = `/images/logo/${theme}.svg`;

  return (
    <>
      <div>
        <Image src={logoUrl} alt="Image" width={40} height={40} />
        <span>API</span>
      </div>
      <h1>Miguel Bogota Dev API</h1>
      <p>
        This is a basic API to return all the information for the{' '}
        <a href="https://miguelbogotadev.com" target="_blank" rel="noreferrer">
          Miguel Bogota Dev
        </a>{' '}
        website.
      </p>
    </>
  );
};

export default Home;
