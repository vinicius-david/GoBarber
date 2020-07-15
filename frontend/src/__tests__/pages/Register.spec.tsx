import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Register from '../../pages/Register';

const mockedHistoryPush = jest.fn();
const mockedPost = jest.fn();
const mockedLogIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
});

jest.mock('../../services/api', () => {
  return {
    api: () => ({
      post: mockedPost,
    }),
  };
});

jest.mock('../../hooks/AuthContext', () => {
  return {
    useAuth: () => ({
      logIn: mockedLogIn,
    }),
  };
});

jest.mock('../../hooks/ToastContext', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Register Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to login', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    const nameFiled = getByPlaceholderText('Nome');
    const emailFiled = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameFiled, { target: { value: 'Dalota Name' } });
    fireEvent.change(emailFiled, { target: { value: 'example@email.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPost).toBeCalled();
    });
  });
});
