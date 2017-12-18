import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { mutations } from '../graphql';
import { Alert } from 'modules/common/utils';
import { CONVERSATION_STATUSES } from 'modules/inbox/constants';
import { Resolver } from '../components';

const ResolverContainer = props => {
  const { changeStatusMutation, afterResolve } = props;

  // change conversation status
  const changeStatus = (conversationIds, status) => {
    changeStatusMutation({ variables: { _ids: conversationIds, status } })
      .then(() => {
        if (status === CONVERSATION_STATUSES.CLOSED) {
          Alert.success('The conversation has been resolved!');
        } else {
          Alert.info(
            'The conversation has been reopened and restored to Inbox.'
          );
        }
        if (afterResolve) {
          afterResolve();
        }
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    changeStatus
  };

  return <Resolver {...updatedProps} />;
};

ResolverContainer.propTypes = {
  changeStatusMutation: PropTypes.func.isRequired,
  afterResolve: PropTypes.func
};

export default compose(
  graphql(gql(mutations.conversationsChangeStatus), {
    name: 'changeStatusMutation'
  })
)(ResolverContainer);
