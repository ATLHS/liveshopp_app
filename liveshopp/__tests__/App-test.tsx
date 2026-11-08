import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { beforeEach, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

import App from '../App';
import RootStack from '../src/navigation/RootStack';
import authService from '../src/services/auth';

jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn() }));
jest.mock('@sentry/react-native', () => ({ init: jest.fn(), setUser: jest.fn() }));
jest.mock('../src/navigation/RootStack', () => jest.fn(() => null));
jest.mock('../src/components/ToastComponent/ToastComponent', () => () => null);
jest.mock('../src/services/auth', () => ({
  __esModule: true,
  default: { isAuthenticate: jest.fn() },
}));
jest.mock('../src/services/config/axiosConfig', () => ({
  __esModule: true,
  default: { defaults: { headers: {} } },
}));
jest.mock('../src/services/notifications', () => ({ updateUserDevice: () => Promise.resolve() }));
jest.mock('../src/redux/store', () => ({ store: { dispatch: jest.fn() } }));
jest.mock('../src/redux/slices/userSlice', () => ({
  setIsAuthenticate: jest.fn(),
  setUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('checks a saved session once during startup', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValue('saved-token');
  jest
    .mocked(authService.isAuthenticate)
    .mockResolvedValue({ user: { id: 'user-1' }, isAuthenticate: true });

  await act(async () => {
    renderer.create(<App />);
  });

  expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  expect(authService.isAuthenticate).toHaveBeenCalledTimes(1);
  const calls = (RootStack as unknown as { mock: { calls: Array<[{ isLoading: boolean }]> } }).mock
    .calls;
  expect(calls.at(-1)?.[0].isLoading).toBe(false);
});

it('finishes startup when reading storage fails', async () => {
  jest.mocked(AsyncStorage.getItem).mockRejectedValue(new Error('Storage unavailable'));

  await act(async () => {
    renderer.create(<App />);
  });

  const calls = (RootStack as unknown as { mock: { calls: Array<[{ isLoading: boolean }]> } }).mock
    .calls;
  expect(calls.at(-1)?.[0].isLoading).toBe(false);
  expect(authService.isAuthenticate).not.toHaveBeenCalled();
});
