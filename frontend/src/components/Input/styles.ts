import styled, { css } from 'styled-components';
import { shade } from 'polished';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`

  background-color: #222222;

  color: #666360;
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
    transition: border-color 1s;
    border-color: #ff9000;
  }

  ${props => props.hasError && css`
    border-color: #c53030;
  `}

  ${props => props.isFocused && css`
    color: #ff9000;
    border-color: #ff9000;
  `}

  ${props => props.isFilled && css`
    color: #ff9000;
  `}

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
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: ${shade(0.3, '#c53030')};
    color: #eee;

    &::before {
      border-color: ${shade(0.3, '#c53030')} transparent;
    }
  }
`;
