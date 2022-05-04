import type { NextPage } from 'next';
import Image from 'next/image';
import useAppTheme from '@app-hooks/use-app-theme';

const Home: NextPage = () => {
  const theme = useAppTheme();
  const logoUrl = `/images/logo/${theme}.svg`;

  return (
    <>
      <div className="logo">
        <Image src={logoUrl} alt="Image" width={40} height={40} />
        <span>API</span>
      </div>
      <h1 className="headline">Miguel Bogota Dev API</h1>
      <p className="basic-info">
        {'This is a basic API to return all the information for the current '}
        <a href="https://miguelbogotadev.com" target="_blank" rel="noreferrer">
          Miguel Bogota Dev
        </a>
        {' website and all portfolios done by Miguel Bogota.'}
      </p>

      <h2 className="docs-headline">Documentation</h2>

      <div className="doc">
        <pre>/api/content/{'{version-id}'}</pre>
        <p>Returns the content passing the version of the portfolio that is needed</p>
      </div>

      <div className="doc">
        <pre>/api/work</pre>
        <p>Returns an array with all the work stored in the API and the length of that array.</p>
      </div>

      <div className="doc">
        <pre>/api/work/{'{work-id}'}</pre>
        <p>Returns the work with the given id</p>
      </div>

      <footer className="footer">© {new Date().getFullYear()} MIGUEL BOGOTA</footer>
    </>
  );
};

export default Home;
