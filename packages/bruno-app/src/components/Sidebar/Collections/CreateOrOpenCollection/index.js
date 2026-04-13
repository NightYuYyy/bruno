import { useTheme } from '../../../../providers/Theme';
import { useDispatch } from 'react-redux';
import { openCollection } from 'providers/ReduxStore/slices/collections/actions';

import toast from 'react-hot-toast';
import styled from 'styled-components';
import StyledWrapper from './StyledWrapper';
import { useTranslation } from 'react-i18next';

const LinkStyle = styled.span`
  color: ${(props) => props.theme['text-link']};
`;

const CreateOrOpenCollection = ({ onCreateClick }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleOpenCollection = () => {
    dispatch(openCollection()).catch(
      (err) => {
        console.log(err);
        toast.error(t('SIDEBAR.CREATE_OR_OPEN_COLLECTION.OPEN_COLLECTION_ERROR'));
      }
    );
  };
  const CreateLink = () => (
    <LinkStyle
      className="underline text-link cursor-pointer"
      theme={theme}
      onClick={onCreateClick}
    >
      {t('SIDEBAR.CREATE_OR_OPEN_COLLECTION.CREATE')}
    </LinkStyle>
  );
  const OpenLink = () => (
    <LinkStyle className="underline text-link cursor-pointer" theme={theme} onClick={() => handleOpenCollection(true)}>
      {t('SIDEBAR.CREATE_OR_OPEN_COLLECTION.OPEN')}
    </LinkStyle>
  );

  return (
    <StyledWrapper className="px-2 mt-4">
      <div className="text-xs text-center">
        <div>{t('SIDEBAR.CREATE_OR_OPEN_COLLECTION.NO_COLLECTIONS_FOUND')}</div>
        <div className="mt-2">
          <CreateLink /> or <OpenLink /> Collection.
        </div>
      </div>
    </StyledWrapper>
  );
};

export default CreateOrOpenCollection;
