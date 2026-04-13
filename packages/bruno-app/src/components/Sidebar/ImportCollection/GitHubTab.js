import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isGitRepositoryUrl } from 'utils/git';
import Button from 'ui/Button';

const GitHubTab = ({
  handleSubmit,
  setErrorMessage
}) => {
  const { t } = useTranslation();
  const [urlInput, setUrlInput] = useState('');

  const handleGitRepositoryImport = (url) => {
    if (!isGitRepositoryUrl(url)) {
      setErrorMessage(t('IMPORT_COLLECTION.VALID_GIT_URL'));
      return;
    }
    handleSubmit({ repositoryUrl: url, type: 'git-repository' });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      handleGitRepositoryImport(urlInput.trim());
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex gap-2">
        <input
          id="gitUrlInput"
          data-testid="git-url-input"
          type="text"
          value={urlInput}
          autoFocus
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder={t('IMPORT_COLLECTION.GIT_URL_PLACEHOLDER')}
          className="flex-1 px-3 py-1 textbox"
        />
        <Button
          type="submit"
          id="clone-git-button"
          disabled={!urlInput.trim()}
          variant="filled"
          color="primary"
          style={{ height: '100%' }}
        >
          {t('IMPORT_COLLECTION.CLONE')}
        </Button>
      </div>
    </form>
  );
};

export default GitHubTab;
