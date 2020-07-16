import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-test-renderer';

import api from '../../services/api';
import { useAuth, AuthProvider } from '../../hooks/AuthContext';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to log in', async () => {
    const apiResponse = {
      user: {
        id: 'userId-123',
        name: 'Dalota',
        email: 'example@email.com',
      },
      token: 'userToken-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.logIn({
      email: 'example@email.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token', apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user', JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('example@email.com');
  });

  it('should be able restore data from storage when inits', () => {
    const storagedData = {
      user: {
        id: 'userId-123',
        name: 'Dalota',
        email: 'example@email.com',
      },
      token: 'userToken-123',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return storagedData.token;
        case '@GoBarber:user':
          return JSON.stringify(storagedData.user);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('example@email.com');
  });

  it('should be able to log out', async () => {
    const storagedData = {
      user: {
        id: 'userId-123',
        name: 'Dalota',
        email: 'example@email.com',
      },
      token: 'userToken-123',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return storagedData.token;
        case '@GoBarber:user':
          return JSON.stringify(storagedData.user);
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'userId-123',
      name: 'Dalota',
      email: 'example@email.com',
      avatar_url: 'example.j́g',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});

