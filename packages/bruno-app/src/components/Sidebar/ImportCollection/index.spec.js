import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../../i18n';
import ImportCollection from './index';

jest.mock('providers/Theme', () => ({
  useTheme: () => ({
    theme: {
      status: {
        danger: {
          background: '#fee2e2',
          border: '#fecaca',
          text: '#b91c1c'
        }
      }
    }
  })
}));

jest.mock('components/Modal', () => ({ title, children }) => (
  <div>
    <div>{title}</div>
    {children}
  </div>
));

jest.mock('./StyledWrapper', () => ({ children, ...props }) => <div {...props}>{children}</div>);
jest.mock('./FileTab', () => () => <div>File Tab</div>);
jest.mock('./GitHubTab', () => () => <div>GitHub Tab</div>);
jest.mock('./UrlTab', () => () => <div>Url Tab</div>);
jest.mock('./FullscreenLoader/index', () => () => <div>Loading</div>);

describe('ImportCollection', () => {
  it('renders Chinese import tab labels', () => {
    render(<ImportCollection onClose={jest.fn()} handleSubmit={jest.fn()} />);

    expect(screen.getByText('导入 Collection')).toBeInTheDocument();
    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getByText('Git 仓库')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
  });
});
