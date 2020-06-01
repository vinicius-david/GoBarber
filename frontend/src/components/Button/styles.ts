import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  width: 100%;
  padding: 12px;

  margin-top: 24px;

  border: 0px solid #ff9000;
  border-radius: 4px;
  background-color: #ff9000;

  font-weight: 500;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
    transition: 200ms;
  }
`;
