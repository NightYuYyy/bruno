import React from 'react';
import { render, screen } from '@testing-library/react';
import '../../i18n';
import WelcomeModal from './index';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(() => Promise.resolve()),
  useSelector: (selector) => selector({
    app: {
      preferences: {
        general: {
          defaultLocation: ''
        }
      }
    }
  })
}));

jest.mock('providers/Theme', () => ({
  useTheme: () => ({
    storedTheme: 'system',
    setStoredTheme: jest.fn(),
    themeVariantLight: 'light',
    setThemeVariantLight: jest.fn(),
    themeVariantDark: 'dark',
    setThemeVariantDark: jest.fn()
  })
}));

jest.mock('components/Bruno', () => () => <div data-testid="bruno-logo" />);
jest.mock('ui/Button', () => ({ children, ...props }) => <button {...props}>{children}</button>);
jest.mock('./StyledWrapper', () => ({ children, ...props }) => <div {...props}>{children}</div>);
jest.mock('./WelcomeStep', () => () => <div>Welcome Step</div>);
jest.mock('./ThemeStep', () => () => <div>Theme Step</div>);
jest.mock('./StorageStep', () => () => <div>Storage Step</div>);
jest.mock('./GetStartedStep', () => () => <div>Get Started Step</div>);

describe('WelcomeModal', () => {
  it('renders Chinese onboarding copy on the first step', () => {
    render(
      <WelcomeModal
        onDismiss={jest.fn()}
        onImportCollection={jest.fn()}
        onCreateCollection={jest.fn()}
        onOpenCollection={jest.fn()}
        onStartRequest={jest.fn()}
      />
    );

    expect(screen.getByText('欢迎使用 Bruno')).toBeInTheDocument();
    expect(screen.getByText('快速、Git 友好、开源的 API 客户端。')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '跳过' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始体验' })).toBeInTheDocument();
  });
});
