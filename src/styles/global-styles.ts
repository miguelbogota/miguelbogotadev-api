import css from 'styled-jsx/css';

/**
 * Default styles for the project.
 */
const globalStyles = css.global`
  html,
  body,
  #__next {
    padding: 0;
    margin: 0;
    font-family: Barlow, Segoe UI, Roboto, -apple-system, Oxygen, Ubuntu, sans-serif;
    height: 100%;
  }
  p {
    line-height: 1.5;
  }
  a {
    color: var(--primary-color);
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
  :root {
    --primary-color: #00796b;
    --error-color: #bd3835;
  }
  :root .light-theme {
    --text-color: #303030;
    --background-color: #ffffff;
    --paper-color: #f7f7f7;
    background-color: var(--background-color);
    color: var(--text-color);
    height: 100%;
  }
  :root .dark-theme {
    --text-color: #d9d9d9;
    --background-color: #000000;
    --paper-color: #333333;
    background-color: var(--background-color);
    color: var(--text-color);
    height: 100%;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 20px 0;
  }
  .container .logo {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  .container .logo span {
    margin-left: 0.2rem;
  }
  .container .headline {
    font-size: 2rem;
    font-weight: 200;
    margin-top: 0;
    margin-bottom: 20px;
  }
  .container .basic-info {
    font-weight: 300;
    margin-bottom: 38px;
  }
  .container .docs-headline {
    font-size: 1.7rem;
    font-weight: 200;
    margin-top: 0;
    margin-bottom: 20px;
  }
  .container .doc {
    font-size: 0.92rem;
    margin-bottom: 25px;
  }
  .container .doc pre {
    background-color: #94949436;
    border-radius: 3px;
    padding: 10px;
    margin: 0;
    color: var(--primary-color);
  }
  .container .doc p {
    font-weight: 200;
    margin: 0;
  }
  .container .footer {
    font-size: 0.7rem;
    font-weight: 100;
    margin-top: 60px;
    word-spacing: 1.5px;
    letter-spacing: 1px;
  }
`;

export default globalStyles;
