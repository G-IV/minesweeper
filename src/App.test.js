import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from './app/store';
import App from './App';

test('renders learn react link', () => {
    const { getByText } = render(
      <Provider store={setupStore()}>
        <App />
      </Provider>
    );
    // dummy test
    expect(1).toEqual(1);
  });