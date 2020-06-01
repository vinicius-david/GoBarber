import styled from 'styled-components';
import { shade } from 'polished';

import backgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;

  display: flex;

  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 80px 0;
    width: 340px;

    h1 {
      margin-bottom: 24px;
      color: #dddddd;
    }

    a {
      text-decoration: none;
      color: #dddddd;

      margin-top: 32px;

      &:hover {
        color: ${shade(0.2, '#ff9000')};
        transition: 200ms;
      }
    }
  }

  > a {
    display: flex;
    align-items: center;

    text-decoration: none;
    color: #ff9000;

    &:hover {
      color: #dddddd;
      transition: 200ms;
    }

    svg {
      margin-right: 12px;
    }
  }
`;

export const BackgroundImage = styled.div`
  flex: 1;

  background: url(${backgroundImg}) no-repeat center;
  background-size: cover;
`;
