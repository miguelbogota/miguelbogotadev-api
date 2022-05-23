import type { FC } from 'react';
import type { AppContext, AppProps as NextAppProps } from 'next/app';
import { AppThemeProvider, SystemTheme } from '@app-hooks/use-app-theme';

import Head from 'next/head';
import NextApp from 'next/app';
import cookie from 'cookie';
import useAppTheme from '@app-hooks/use-app-theme';
import MultiProvider from '@app-lib/multi-provider';

import globalStyles from 'src/styles/global-styles';

type AppProps = NextAppProps & Awaited<ReturnType<typeof getInitialProps>>;

/** Main component where you can use global config from providers. */
const MainComponent: FC<AppProps> = ({ Component, pageProps }) => {
  const theme = useAppTheme();

  return (
    <>
      <style jsx global>
        {globalStyles}
      </style>

      <Head>
        <meta name="theme-color" content="#00796b" />
        <link rel="icon" href={`/favicons/${theme}.ico`} />
      </Head>
      <div className={`${theme}-theme`}>
        <div className="container">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
};

/** Base app component (Use only to add providers.). */
const App = (props: AppProps) => (
  <>
    <Head>
      <base href="/" />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
      />
      <title>Miguel Bogota Dev API</title>
    </Head>

    <MultiProvider
      providers={[
        // List of providers to use in the app.
        <AppThemeProvider key="theme-provider" system={props.systemTheme} />,
      ]}
    >
      <MainComponent {...props} />
    </MultiProvider>
  </>
);

/**
 * This is needed to get the cookie with the theme and system-theme but getInitialProps will turn
 * off optimization in pages without Static Generation.
 *
 * Learn more: https://nextjs.org/docs/advanced-features/automatic-static-optimization.
 */
const getInitialProps = async (appCtx: AppContext) => {
  const defaultProps = await NextApp.getInitialProps(appCtx);
  const cookies = cookie.parse(appCtx.ctx.req?.headers.cookie ?? '');

  const systemTheme = (cookies['system-theme'] ?? 'light') as SystemTheme;

  return {
    ...defaultProps,
    systemTheme,
  };
};

// Assign the initial props to the app
App.getInitialProps = getInitialProps;

export default App;
