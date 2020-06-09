import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type: 'info' | 'success' | 'error';
  style: object;
}

const toastTypeVariations = {
  info: css`
    background-color: #ddddff;
    color: #000055;
  `,
  success: css`
    background-color: #ddffdd;
    color: #003300;
  `,
  error: css`
    background-color: #ff8888;
    color: #330000;
  `,
}

export const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  padding: 40px 60px;
`;

export const Toast = styled(animated.div)<ToastProps>`
  position: relative;
  display: flex;
  justify-content: space-between;


  ${props => toastTypeVariations[props.type]}

  width: 360px;
  padding: 16px 12px 16px 32px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  & + div {
    margin-top: 8px;
  }

  div {
    div {
      display: flex;
      align-items: center;

      > svg {
        margin-right: 6px;
      }

      strong {
        font-size: 16px;
      }
    }

    p {
      margin-top: 4px;
      font-size: 14px;
    }
  }

  button {
    border: 0;
    height: 20px;
    background: rgba(0, 0, 0, 0);

    color: #000;
  }
`;
