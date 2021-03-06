import Common from './Settings/01_Common';
import queryString from 'query-string';
import Shifts from './Settings/02_Shifts';
import styled from 'styled-components';
import TitleBar from '../TitleBar';
import { faBriefcase, faCogs, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormBackground, FormCard } from '../../styles/forms';
import { getColorWithOpacity } from '../../styles/theme';
import { Row } from '../../styles/global';
import { setCurrentElectronWindowTitle } from '../../utils/electron';
import { SettingsCategory } from '../../types/settings';
import { Updates } from './Settings/Updates';
import { useLocation } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SettingsPath = '/settings';

const SettingsPathWithParams = (token: string) => {
  return SettingsPath + '?token=' + token;
};

const SettingsSettings = {
  width: 657,
  height: 542,
  maximizable: false,
  resizable: false,
};

const Settings = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const params = queryString.parse(location.search);

  const [token] = useState(params.token as string);
  const [url] = useState(params.url as string);

  const categories: Array<SettingsCategory> = [
    {
      name: 'common',
      icon: faCogs,
      component: <Common />,
    },
    {
      name: 'shifts',
      icon: faBriefcase,
      component: <Shifts token={token} url={url} />,
    },
    {
      name: 'updates',
      icon: faSync,
      component: <Updates />,
    },
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  setCurrentElectronWindowTitle(
    t('settings:title') + ': ' + t('settings:categories.' + activeCategory.name)
  );

  return (
    <FormBackground>
      <TitleBar
        title={
          t('settings:title') +
          ': ' +
          t('settings:categories.' + activeCategory.name)
        }
        icon={false}
      />
      <Row>
        <SettingsWrapper>
          <SettingsCategories>
            {categories.map((category) => (
              <Category
                isActive={activeCategory.name === category.name}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentElectronWindowTitle(
                    t('settings:title') +
                      ': ' +
                      t('settings:categories.' + category.name)
                  );
                }}
              >
                <FontAwesomeIcon icon={category.icon} />{' '}
                {t('settings:categories.' + category.name)}
              </Category>
            ))}
          </SettingsCategories>
          <SettingsContent>{activeCategory.component}</SettingsContent>
        </SettingsWrapper>
      </Row>
    </FormBackground>
  );
};

export { Settings, SettingsPath, SettingsPathWithParams, SettingsSettings };

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  padding: 32px;
`;

const SettingsCategories = styled.div`
  width: 200px;

  background: ${(props) => getColorWithOpacity(props.theme.colors.white, 10)};
`;

const Category = styled.a<{ isActive: boolean }>`
  display: block;

  padding: 16px 24px;

  background: ${(props) =>
    props.isActive
      ? getColorWithOpacity(props.theme.colors.white, 10)
      : 'transparent'};
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.white
      : getColorWithOpacity(props.theme.colors.white, 80)};

  cursor: ${(props) => (props.isActive ? 'default' : 'pointer')};
  transition: all 0.2s ease-out;

  svg {
    margin-right: 8px;
    width: 18px !important;
  }

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

const SettingsContent = styled(FormCard)`
  width: 392px;
`;
