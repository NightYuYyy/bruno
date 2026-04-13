import i18n from 'i18next';

const invalidCharacters = /[<>:"/\\|?*\x00-\x1F]/g; // replace invalid characters with hyphens
const reservedDeviceNames = /^(CON|PRN|AUX|NUL|COM[0-9]|LPT[0-9])$/i;
const firstCharacter = /^[^\s\-<>:"/\\|?*\x00-\x1F]/; // no space, hyphen and `invalidCharacters`
const middleCharacters = /^[^<>:"/\\|?*\x00-\x1F]*$/; // no `invalidCharacters`
const lastCharacter = /[^.\s<>:"/\\|?*\x00-\x1F]$/; // no dot, space and `invalidCharacters`

export const variableNameRegex = /^[\w-.]*$/;

// HTTP header name should not contain spaces, newlines, or control characters
export const headerNameRegex = /^[^\s\r\n]*$/;

// HTTP header value should not contain newlines
export const headerValueRegex = /^[^\r\n]*$/;

export const sanitizeName = (name) => {
  name = name
    .replace(invalidCharacters, '-') // replace invalid characters with hyphens
    .replace(/^[\s\-]+/, '') // remove leading spaces and hyphens
    .replace(/[.\s]+$/, ''); // remove trailing dots and spaces
  return name;
};

export const validateName = (name) => {
  if (!name) return false;
  if (name.length > 255) return false; // max name length

  if (reservedDeviceNames.test(name)) return false; // windows reserved names

  return (
    firstCharacter.test(name)
    && middleCharacters.test(name)
    && lastCharacter.test(name)
  );
};

export const validateNameError = (name) => {
  if (!name) return i18n.t('VALIDATION.NAME_REQUIRED_GENERIC');

  if (name.length > 255) {
    return i18n.t('VALIDATION.NAME_MAX_255');
  }

  if (reservedDeviceNames.test(name)) {
    return i18n.t('VALIDATION.NAME_RESERVED_DEVICE');
  }

  if (!firstCharacter.test(name[0])) {
    return i18n.t('VALIDATION.NAME_INVALID_CHARACTER', { char: name[0] });
  }

  for (let i = 1; i < name.length - 1; i++) {
    if (!middleCharacters.test(name[i])) {
      return i18n.t('VALIDATION.NAME_INVALID_CHARACTER', { char: name[i] });
    }
  }

  if (!lastCharacter.test(name[name.length - 1])) {
    return i18n.t('VALIDATION.NAME_INVALID_CHARACTER', { char: name[name.length - 1] });
  }

  return '';
};
