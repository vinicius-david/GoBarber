import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`

  background-color: #222222;

  border: 2px solid #222222;
  border-radius: 6px;

  padding: 12px;
  width: 100%;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 12px;
  }

  &:hover {
    transition: 200ms;
    border-color: ${shade(0.5, '#ff9000')};
  }

  input {
    background-color: #222222;
    border: 0;

    flex: 1;

    color: #dddddd;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 12px;
    color: #666360;
  }
`;
