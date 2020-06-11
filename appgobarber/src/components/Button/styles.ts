import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  margin-top: 8px;

  align-items: center;
  justify-content: center;

  background: #ff9000;
`;

export const ButtonText = styled.Text`
  font-family: 'Ubuntu-Medium';
  color: #312e38;
  font-size: 18px;
`;
