import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../src/app/layout';

describe('Layout component', () => {
  test('共通レイアウトが正しくレンダリングされる', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
