import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import LogIn from '../../pages/LogIn';

const mockedHistoryPush = jest.fn();
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

describe('LogIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to login', async () => {
    const { getByPlaceholderText, getByText } = render(<LogIn />);

    const emailFiled = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailFiled, { target: { value: 'example@email.com' } });
    fireEvent.change(passwordField, { target: { value: '123' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toBeCalledWith('/dashboard');
    });
  });

  it('should not be able to login with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<LogIn />);

    const emailFiled = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailFiled, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordField, { target: { value: '123' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toBeCalled();
    });

  });

  it('should be able to display a login error when failes', async () => {
    mockedLogIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<LogIn />);

    const emailFiled = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailFiled, { target: { value: 'example@email.com' } });
    fireEvent.change(passwordField, { target: { value: '123' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toBeCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });

  });
});
