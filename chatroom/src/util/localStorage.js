import config from './config'

export const LocalStorageKey = {
  Theme: 'theme',
  PrimaryColor: 'primaryColor',
  PrimaryTextColor: 'primaryTextColor',
  BackgroundImage: 'backgroundImage',
  Aero: 'aero'
}

/**
 * 获取localStorage中的文本值
 * @param key
 * @param defaultValue
 * @returns {string | string}
 */
function getTextValue (key, defaultValue = '') {
  const value = localStorage.getItem(key)
  return value || defaultValue
}

function getSwitchValue (key, defaultValue = true) {
  const value = window.localStorage.getItem(key)
  return value ? value === 'true' : defaultValue
}

/**
 * 获取localStorage的值
 */
export default function getData () {
  const defaultTheme = 'default'
  const theme = getTextValue(LocalStorageKey.Theme, defaultTheme)
  let themeConfig = {
    primaryColor: '',
    primaryTextColor: '',
    backgroundImage: '',
    aero: false
  }
  if (theme && config.theme[theme]) {
    themeConfig = config.theme[theme]
  } else {
    themeConfig = {
      primaryColor: getTextValue(
        LocalStorageKey.PrimaryColor,
        config.theme[defaultTheme].primaryColor
      ),
      primaryTextColor: getTextValue(
        LocalStorageKey.PrimaryTextColor,
        config.theme[defaultTheme].primaryTextColor
      ),
      backgroundImage: getTextValue(
        LocalStorageKey.BackgroundImage,
        config.theme[defaultTheme].backgroundImage
      ),
      aero: getSwitchValue(
        LocalStorageKey.Aero,
        false
      )
    }
  }
  return {
    theme,
    ...themeConfig
  }
}
