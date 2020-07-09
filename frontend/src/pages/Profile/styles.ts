import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const animateOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Container = styled.div`
  height: 100vh;

  header {
    background: #28262e;
    height: 148px;
    width: 100%;

    display: flex;
    align-items: center;

    svg {
      margin-left: 20vw;
      color: #999591;

      &:hover {
        transition: 300ms;
        color: #ff9000;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin: 0 auto;

  animation: ${animateOpacity} 1s;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: -90px 0 80px;
    width: 340px;

    h1 {
      margin-bottom: 24px;
      margin-right: auto;
      color: #dddddd;
    }

    div:nth-child(5) {
      margin-top: 32px;
    }
  }
`;

export const AvatarUpdate = styled.div`
  position: relative;
  width: 186px;
  margin-bottom: 32px;

  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    right: 0;
    bottom: 0;

    background: #ff9000;
    color: #282626;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    &:hover {
      transition: 300ms;
      cursor: pointer;
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
