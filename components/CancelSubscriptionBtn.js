import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import gql from 'graphql-tag';
import { FormattedMessage } from 'react-intl';

import { getErrorFromGraphqlException } from '../lib/errors';

import SmallButton from './SmallButton';

class CancelSubscriptionBtn extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    onError: PropTypes.func,
    cancelSubscription: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      result: {},
      loading: false,
    };
  }

  async onClick() {
    const { id, onError } = this.props;
    this.setState({ loading: true });
    try {
      await this.props.cancelSubscription(id);
    } catch (err) {
      onError(getErrorFromGraphqlException(err).message);
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="CancelSubscriptionBtn">
        <SmallButton className="yes" onClick={this.onClick}>
          <FormattedMessage id="subscription.cancel.btn" defaultMessage="yes" disabled={this.state.loading} />
        </SmallButton>
        {this.state.loading && <div className="loading">Processing...</div>}
      </div>
    );
  }
}

const cancelSubscriptionMutation = gql`
  mutation CancelSubscription($id: Int!) {
    cancelSubscription(id: $id) {
      id
      isSubscriptionActive
      status
    }
  }
`;

const addCancelSubscriptionMutation = graphql(cancelSubscriptionMutation, {
  props: ({ mutate }) => ({
    cancelSubscription: async id => {
      return await mutate({ variables: { id } });
    },
  }),
});

export default addCancelSubscriptionMutation(CancelSubscriptionBtn);
