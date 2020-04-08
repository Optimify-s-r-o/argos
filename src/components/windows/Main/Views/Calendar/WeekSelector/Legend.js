import React from 'react';
import { withTranslation } from 'react-i18next';

class Legend extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div id='Legend'>
        <button className='btn btn-text'>
          {t('calendar:weekSelector.legend')}
        </button>
      </div>
    );
  }
}

export default withTranslation()(Legend);
