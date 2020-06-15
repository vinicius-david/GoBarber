import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 32px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #e4ede8;
  font-family: 'Ubuntu-Medium';
  margin: 64px 0 24px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
`;

export const ForgotPasswordText = styled.Text`
  color: #e4ede8;
  font-size: 16px;
  font-family: 'Ubuntu-Regular';
`;

export const CreateAccount = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  background: #131119;

  border-top-width: 1px;
  border-color: #ff9000;
  padding: 12px 0;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CreateAccountText = styled.Text`
  color: #ff9000;
  font-size: 18px;
  font-family: 'Ubuntu-Regular';
  margin-left: 16px;
`;
