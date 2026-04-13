import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import path from 'utils/common/path';
import { IconCaretDown } from '@tabler/icons';
import { browseDirectory } from 'providers/ReduxStore/slices/collections/actions';
import { postmanToBruno } from 'utils/importers/postman-collection';
import { convertInsomniaToBruno } from 'utils/importers/insomnia-collection';
import { convertOpenapiToBruno } from 'utils/importers/openapi-collection';
import { processBrunoCollection } from 'utils/importers/bruno-collection';
import { processOpenCollection } from 'utils/importers/opencollection';
import { wsdlToBruno } from '@usebruno/converters';
import { toastError } from 'utils/common/error';
import { useBetaFeature, BETA_FEATURES } from 'utils/beta-features';
import Modal from 'components/Modal';
import Help from 'components/Help';
import Dropdown from 'components/Dropdown';
import StyledWrapper from './StyledWrapper';
import { DEFAULT_COLLECTION_FORMAT } from 'utils/common/constants';

// Extract collection name from raw data
const getCollectionName = (format, rawData) => {
  if (!rawData) return i18n.t('IMPORT_COLLECTION_LOCATION.GENERIC_COLLECTION');

  switch (format) {
    case 'openapi':
      return rawData.info?.title || i18n.t('IMPORT_COLLECTION_LOCATION.OPENAPI_COLLECTION');
    case 'postman':
      return rawData.info?.name || rawData.collection?.info?.name || i18n.t('IMPORT_COLLECTION_LOCATION.POSTMAN_COLLECTION');
    case 'insomnia':
      // For Insomnia v4 format, name is in the workspace resource
      if (rawData.resources && Array.isArray(rawData.resources)) {
        const workspace = rawData.resources.find((r) => r._type === 'workspace');
        if (workspace?.name) {
          return workspace.name;
        }
      }
      // Fallback to root name property
      return rawData.name || i18n.t('IMPORT_COLLECTION_LOCATION.INSOMNIA_COLLECTION');
    case 'bruno':
      return rawData.name || i18n.t('IMPORT_COLLECTION_LOCATION.BRUNO_COLLECTION');
    case 'opencollection':
      return rawData.info?.name || i18n.t('CREATE_COLLECTION.OPEN_COLLECTION_FORMAT');
    case 'wsdl':
      return i18n.t('IMPORT_COLLECTION_LOCATION.WSDL_COLLECTION');
    case 'bruno-zip':
      return rawData.collectionName || i18n.t('IMPORT_COLLECTION_LOCATION.BRUNO_COLLECTION');
    default:
      return i18n.t('IMPORT_COLLECTION_LOCATION.GENERIC_COLLECTION');
  }
};

// Convert raw data to Bruno collection format
const convertCollection = async (format, rawData, groupingType, collectionFormat) => {
  try {
    let collection;

    switch (format) {
      case 'openapi':
        collection = convertOpenapiToBruno(rawData, { groupBy: groupingType, collectionFormat });
        break;
      case 'wsdl':
        collection = await wsdlToBruno(rawData);
        break;
      case 'postman':
        collection = await postmanToBruno(rawData);
        break;
      case 'insomnia':
        collection = convertInsomniaToBruno(rawData);
        break;
      case 'bruno':
        collection = await processBrunoCollection(rawData);
        break;
      case 'opencollection':
        collection = await processOpenCollection(rawData);
        break;
      case 'bruno-zip':
        // ZIP doesn't need conversion
        collection = rawData;
        break;
      default:
        throw new Error('Unknown collection format');
    }

    return collection;
  } catch (err) {
    console.error('Conversion error:', err);
    toastError(err, i18n.t('IMPORT_COLLECTION_LOCATION.FAILED_TO_CONVERT'));
    throw err;
  }
};

const groupingOptions = [
  { value: 'tags', label: i18n.t('COMMON.TAGS'), description: 'Group requests by OpenAPI/Swagger tags', testId: 'grouping-option-tags' },
  { value: 'path', label: i18n.t('COMMON.PATHS'), description: 'Group requests by URL path structure', testId: 'grouping-option-path' }
];

const ImportCollectionLocation = ({ onClose, handleSubmit, rawData, format, sourceUrl, filePath, rawContent }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [groupingType, setGroupingType] = useState('tags');
  const [collectionFormat, setCollectionFormat] = useState(DEFAULT_COLLECTION_FORMAT);
  const isOpenAPISyncEnabled = useBetaFeature(BETA_FEATURES.OPENAPI_SYNC);
  const [enableCheckForSpecUpdates, setEnableCheckForSpecUpdates] = useState(isOpenAPISyncEnabled);
  const dropdownTippyRef = useRef();
  const isOpenApi = format === 'openapi';
  const isZipImport = format === 'bruno-zip';
  const isOpenApiFromUrl = isOpenApi && !!sourceUrl && !filePath;
  const isOpenApiFromFile = isOpenApi && !!filePath && !sourceUrl;
  const isSwagger2 = isOpenApi && rawData?.swagger && String(rawData.swagger).startsWith('2');
  const showCheckForSpecUpdatesOption = isOpenAPISyncEnabled && (isOpenApiFromUrl || isOpenApiFromFile);

  const { workspaces, activeWorkspaceUid } = useSelector((state) => state.workspaces);
  const preferences = useSelector((state) => state.app.preferences);
  const activeWorkspace = workspaces.find((w) => w.uid === activeWorkspaceUid);
  const isDefaultWorkspace = !activeWorkspace || activeWorkspace.type === 'default';

  const defaultLocation = isDefaultWorkspace
    ? get(preferences, 'general.defaultLocation', '')
    : (activeWorkspace?.pathname ? path.join(activeWorkspace.pathname, 'collections') : '');

  const collectionName = getCollectionName(format, rawData);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionLocation: defaultLocation
    },
    validationSchema: Yup.object({
      collectionLocation: Yup.string()
        .min(1, t('VALIDATION.LOCATION_REQUIRED'))
        .max(500, t('VALIDATION.MAX_500_CHARACTERS'))
        .required(t('VALIDATION.LOCATION_REQUIRED'))
    }),
    onSubmit: async (values) => {
      const convertedCollection = await convertCollection(format, rawData, groupingType, collectionFormat);
      const options = { format: collectionFormat };

      if (showCheckForSpecUpdatesOption && enableCheckForSpecUpdates) {
        const syncSourceUrl = sourceUrl || filePath; // URL or absolute path (backend converts to relative)
        const baseBrunoConfig = {
          version: convertedCollection.version || '1',
          name: convertedCollection.name || 'Untitled Collection',
          type: 'collection',
          ignore: ['node_modules', '.git']
        };

        convertedCollection.brunoConfig = {
          ...baseBrunoConfig,
          ...convertedCollection.brunoConfig,
          openapi: [
            {
              sourceUrl: syncSourceUrl,
              groupBy: groupingType,
              autoCheck: true,
              autoCheckInterval: 5
            }
          ]
        };

        options.rawOpenAPISpec = rawContent || rawData;
      }

      handleSubmit(convertedCollection, values.collectionLocation, options);
    }
  });

  const onDropdownCreate = (ref) => {
    dropdownTippyRef.current = ref;
  };

  const GroupingDropdownIcon = forwardRef((props, ref) => {
    const selectedOption = groupingOptions.find((option) => option.value === groupingType);
    return (
      <div ref={ref} className="flex items-center justify-between w-full current-group" data-testid="grouping-dropdown">
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{selectedOption.label}</div>
        </div>
        <IconCaretDown size={16} className="text-gray-400 ml-[0.25rem]" fill="currentColor" />
      </div>
    );
  });
  const browse = () => {
    dispatch(browseDirectory())
      .then((dirPath) => {
        if (typeof dirPath === 'string' && dirPath.length > 0) {
          formik.setFieldValue('collectionLocation', dirPath);
        }
      })
      .catch((error) => {
        formik.setFieldValue('collectionLocation', '');
        console.error(error);
      });
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = async () => {
    if (isZipImport) {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched({ collectionLocation: true });
        return;
      }
      const collectionLocation = formik.values.collectionLocation;
      handleSubmit(rawData, collectionLocation, { format: collectionFormat, isZipImport: true });
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title={t('IMPORT_COLLECTION.TITLE')}
        confirmText={t('COMMON.IMPORT')}
        handleConfirm={onSubmit}
        handleCancel={onClose}
        dataTestId="import-collection-location-modal"
      >
        <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="collectionName" className="block font-medium">
              {t('COMMON.NAME')}
            </label>
            <div className="mt-2">{collectionName}</div>

            <>
              <label htmlFor="collectionLocation" className="font-medium mt-4 flex items-center">
                {t('COMMON.LOCATION')}
                <Help>
                  <p>{t('IMPORT_COLLECTION_LOCATION.FILESYSTEM_HELP_1')}</p>
                  <p className="mt-2">{t('IMPORT_COLLECTION_LOCATION.FILESYSTEM_HELP_2')}</p>
                </Help>
              </label>
              <input
                id="collection-location"
                type="text"
                name="collectionLocation"
                className="block textbox mt-2 w-full cursor-pointer"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={formik.values.collectionLocation || ''}
                onClick={browse}
                onChange={(e) => {
                  formik.setFieldValue('collectionLocation', e.target.value);
                }}
              />
            </>
            {formik.touched.collectionLocation && formik.errors.collectionLocation ? (
              <div className="text-red-500">{formik.errors.collectionLocation}</div>
            ) : null}

            <div className="mt-1">
              <span className="text-link cursor-pointer hover:underline" onClick={browse}>
                {t('COMMON.BROWSE')}
              </span>
            </div>

            {!isZipImport && (
              <div className="mt-4">
                <label htmlFor="format" className="flex items-center font-medium">
                  {t('COMMON.FILE_FORMAT')}
                  <Help width="300">
                    <p>{t('IMPORT_COLLECTION_LOCATION.FILE_FORMAT_HELP_1')}</p>
                    <p className="mt-2">
                      <strong>{t('IMPORT_COLLECTION_LOCATION.FILE_FORMAT_HELP_2')}</strong>
                    </p>
                    <p className="mt-1">
                      <strong>{t('IMPORT_COLLECTION_LOCATION.FILE_FORMAT_HELP_3')}</strong>
                    </p>
                  </Help>
                </label>
                <select
                  id="format"
                  name="format"
                  className="block textbox mt-2 w-full"
                  value={collectionFormat}
                  onChange={(e) => setCollectionFormat(e.target.value)}
                >
                  <option value="yml">{t('IMPORT_COLLECTION_LOCATION.OPEN_COLLECTION_FORMAT')}</option>
                  <option value="bru">{t('IMPORT_COLLECTION_LOCATION.BRU_FORMAT')}</option>
                </select>
              </div>
            )}
          </div>

          {isOpenApi && (
            <div className="mt-4 flex gap-4 items-center justify-between">
              <div>
                <label htmlFor="groupingType" className="block font-medium">
                  {t('IMPORT_COLLECTION_LOCATION.FOLDER_ARRANGEMENT')}
                </label>
                <p className="text-muted text-xs mt-1 mb-2">
                  {t('IMPORT_COLLECTION_LOCATION.FOLDER_ARRANGEMENT_DESC')}
                </p>
              </div>
              <div className="relative">
                <Dropdown onCreate={onDropdownCreate} icon={<GroupingDropdownIcon />} placement="bottom-start">
                  {groupingOptions.map((option) => (
                    <div
                      key={option.value}
                      className="dropdown-item"
                      data-testid={option.testId}
                      onClick={() => {
                        dropdownTippyRef?.current?.hide();
                        setGroupingType(option.value);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </Dropdown>
              </div>
            </div>
          )}

          {showCheckForSpecUpdatesOption && (
            <div className={`mt-4 ${isSwagger2 ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className={`flex items-center gap-2 ${isSwagger2 ? '' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={isSwagger2 ? false : enableCheckForSpecUpdates}
                  onChange={(e) => setEnableCheckForSpecUpdates(e.target.checked)}
                  disabled={isSwagger2}
                  className={`checkbox ${isSwagger2 ? '' : 'cursor-pointer'}`}
                />
                <span className="font-medium">{t('IMPORT_COLLECTION_LOCATION.CHECK_FOR_SPEC_UPDATES')}</span>
              </label>
              <p className="text-muted text-xs mt-1">
                {isSwagger2
                  ? t('IMPORT_COLLECTION_LOCATION.CHECK_FOR_SPEC_UPDATES_UNSUPPORTED')
                  : t('IMPORT_COLLECTION_LOCATION.CHECK_FOR_SPEC_UPDATES_HELP')}
              </p>
            </div>
          )}
        </form>
      </Modal>
    </StyledWrapper>
  );
};

export default ImportCollectionLocation;
