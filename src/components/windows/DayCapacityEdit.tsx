import Cancel from '../forms/Cancel';
import getCapacityForDay from '../../api/capacities/get-day';
import Input from '../forms/Input';
import putCapacityForDay from '../../api/capacities/put-day';
import queryString from 'query-string';
import Submit from '../forms/Submit';
import TitleBar from '../TitleBar';
import { getLocalizedDate } from '../../utils/days';
import { Row } from '../../styles/global';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../styles/main.css';
import '../../styles/forms.css';
import {
  FormBackground,
  FormCard,
  FormCardButtons,
  FormCardHeader,
  FormColumn,
} from '../../styles/forms';
import {
  closeCurrentElectronWindow,
  setCurrentElectronWindowHeight,
  setCurrentElectronWindowTitle,
} from '../../utils/electron';
import FormRow, {
  FormInfo,
  FormInfoContent,
  FormInfoHeader,
  FormInfoRow,
} from '../forms/FormRow';
import {
  MSGBOX_BUTTONS_OK,
  MSGBOX_BUTTONS_YES_NO,
  MSGBOX_BUTTON_YES,
  MSGBOX_TYPE_ERROR,
  MSGBOX_TYPE_SUCCESS,
  showMessageBox,
} from '../../utils/showMessageBox';

const title = 'capacityForms:titleDay';

const DayCapacityEditPath = '/day-capacity-edit';

const DayCapacityEditPathWithParams = (
  token: string,
  date: string,
  phase: string
) => {
  return (
    DayCapacityEditPath + '?token=' + token + '&day=' + date + '&phase=' + phase
  );
};

const DayCapacityEditSettings = {
  title: title,
  width: 882,
  height: 399,
  maximizable: false,
  resizable: false,
};

const DayCapacityEdit = () => {
  const location = useLocation();
  const params = queryString.parse(location.search);

  const [day] = useState(params.day as string);
  const [phase] = useState(params.phase as string);
  const [capacityData, setCapacityData] = useState<{
    free: number;
    planned: number;
    shiftsCapacity: number;
    shifts: Array<{
      id: string;
      name: string;
      capacity: number;
      free: number;
      planned: number;
      real?: number;
    }>;
  } | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (phase === 'saw' || phase === 'press')
      getCapacityForDay(params.token as string, day, phase, (data) => {
        if (data.status === 200) {
          setCapacityData(data.body);

          if (data.body.shifts.length > 1) {
            setCurrentElectronWindowHeight(
              381 + 247 * (data.body.shifts.length - 1),
              true
            );
          }
        } else
          showMessageBox(
            'capacityForms:errorDay',
            MSGBOX_TYPE_ERROR,
            MSGBOX_BUTTONS_OK,
            () => {
              closeCurrentElectronWindow();
            }
          );
      });
  }, [day]);

  const handleChange = (event, shiftKey: number, type: 'planned' | 'real') => {
    const target = event.target;
    const value = target.value;

    let newData = Object.assign({}, capacityData);
    newData.shifts[shiftKey][type] = parseInt(value);
    setCapacityData(newData);
  };

  const save = () => {
    if (phase === 'saw' || phase === 'press') {
      let shiftsData: Array<{ id: string; planned: number; real: number }> = [];

      capacityData?.shifts.forEach((shift) => {
        shiftsData.push({
          id: shift.id,
          planned: shift.planned,
          real: shift.real ? shift.real : 0,
        });
      });

      putCapacityForDay(
        params.token as string,
        day,
        phase,
        shiftsData,
        (data) => {
          if (data.status === 200) {
            showMessageBox(
              'capacityForms:success',
              MSGBOX_TYPE_SUCCESS,
              MSGBOX_BUTTONS_YES_NO,
              (button) => {
                if (button === MSGBOX_BUTTON_YES) closeCurrentElectronWindow();
                else {
                  setCapacityData(data.body);

                  if (data.body.shifts.length > 1) {
                    setCurrentElectronWindowHeight(
                      381 + 247 * (data.body.shifts.length - 1),
                      true
                    );
                  }
                }
              }
            );
          } else
            showMessageBox(
              'capacityForms:error',
              MSGBOX_TYPE_ERROR,
              MSGBOX_BUTTONS_OK
            );
        }
      );
    }
  };

  setCurrentElectronWindowTitle(t(title));

  return (
    <FormBackground>
      <TitleBar title={t(title)} icon={false} />
      <Row>
        <FormColumn>
          <FormCard>
            <FormRow title={t('capacityForms:info')}>
              <FormInfo>
                <FormInfoRow>
                  <FormInfoHeader>{t('capacityForms:date')}</FormInfoHeader>
                  <FormInfoContent>
                    {getLocalizedDate(new Date(Date.parse(day)), i18n.language)}
                  </FormInfoContent>
                </FormInfoRow>
                <FormInfoRow>
                  <FormInfoHeader>{t('capacityForms:phase')}</FormInfoHeader>
                  <FormInfoContent>
                    {t('phaseForms:phases.' + phase)}
                  </FormInfoContent>
                </FormInfoRow>
              </FormInfo>
            </FormRow>

            <FormRow title={t('capacityForms:capacities')}>
              <FormInfo>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('capacityForms:plannedCapacity')}
                  </FormInfoHeader>
                  <FormInfoContent>{capacityData?.planned}</FormInfoContent>
                </FormInfoRow>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('capacityForms:freeCapacity')}
                  </FormInfoHeader>
                  <FormInfoContent>{capacityData?.free}</FormInfoContent>
                </FormInfoRow>
                <FormInfoRow>
                  <FormInfoHeader>
                    {t('capacityForms:totalCapacity')}
                  </FormInfoHeader>
                  <FormInfoContent>
                    {capacityData?.shiftsCapacity}
                  </FormInfoContent>
                </FormInfoRow>
              </FormInfo>
            </FormRow>
          </FormCard>
        </FormColumn>
        <FormColumn>
          {capacityData?.shifts.map((shift, shiftKey) => (
            <FormCard>
              <FormCardHeader>{shift.name}</FormCardHeader>
              <FormRow
                horizontal
                titleWidth={171}
                title={t('capacityForms:plannedCapacity')}
              >
                <Input
                  type='number'
                  min={0}
                  value={shift.planned}
                  onChange={(e) => handleChange(e, shiftKey, 'planned')}
                />
              </FormRow>
              <FormRow
                horizontal
                titleWidth={171}
                title={t('capacityForms:realCapacity')}
              >
                <Input
                  type='number'
                  min={0}
                  value={shift.real ? shift.real : 0}
                  onChange={(e) => handleChange(e, shiftKey, 'real')}
                />
              </FormRow>
              <FormRow
                horizontal
                titleWidth={171}
                title={t('capacityForms:defaultCapacity')}
              >
                <Input type='number' value={shift.capacity} readOnly />
              </FormRow>
            </FormCard>
          ))}

          <FormCardButtons>
            <Cancel onClick={() => closeCurrentElectronWindow()}>
              {t('messageBox:buttons.cancel')}
            </Cancel>
            <Submit onClick={() => save()}>
              {t('capacityForms:saveCapacity')}
            </Submit>
          </FormCardButtons>
        </FormColumn>
      </Row>
    </FormBackground>
  );
};

export {
  DayCapacityEdit,
  DayCapacityEditPath,
  DayCapacityEditPathWithParams,
  DayCapacityEditSettings,
};
