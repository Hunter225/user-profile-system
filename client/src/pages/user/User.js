import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../../containers/PageWrapper';
import { AlertWrapper } from '../../containers/AlertWrapper';
import { FormWrapper } from '../../containers/FormWrapper';
import { Form, Input, Button, Alert, DatePicker, Spin, Typography } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import { apiBaseURL, timeout } from '../../config';
import moment from 'moment';
import { api, cookies } from '../../cosntant';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import styled from 'styled-components';

const UserNameWrapper = styled.div`
  margin: 0 0 20px 0;
`;

export const User = () => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [userProfile, setUserProfile] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(undefined);

  const token = Cookies.get(cookies.jwt);

  const getUser = async (id, token) => {
    return await axios({
      method: 'get',
      timeout: timeout,
      url: `${apiBaseURL}${api.users}/${id}`,
      headers: { authorization: token }
    });
  };

  useEffect(() => {
    const decodedToken = jwt_decode(token);
    const id = _.get(decodedToken, 'id');
    setUserId(id);
    getUser(id, token).then((res) => {
      const userProfile = _.get(res, 'data.user');
      setUserProfile(userProfile);
      setIsLoading(false);
    });
  }, []);

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      const DOBObj = _.get(values, 'DOB');

      if (_.isNull(DOBObj) || _.isUndefined(DOBObj)) {
        _.set(values, 'DOB', undefined);
      } else {
        const month = DOBObj.format('MM');
        const day = DOBObj.format('DD');
        const year = DOBObj.format('YYYY');
        const DOBStr = `${day}-${month}-${year}`;
        _.set(values, 'DOB', DOBStr);
      }

      const res = await axios({
        method: 'patch',
        timeout: timeout,
        url: `${apiBaseURL}${api.users}/${userId}`,
        data: values,
        headers: { authorization: token }
      });
      const userProfile = _.get(res, 'data.user');
      setUserProfile(userProfile);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = _.get(err, 'response.data.message');
      setErrorMessage(errorMessage);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <PageWrapper>
      {errorMessage !== undefined && (
        <AlertWrapper>
          <Alert
            message="Error"
            description={errorMessage}
            type="error"
            showIcon
            closable
          />
        </AlertWrapper>
      )}
      {isLoading ? (
        <Spin />
      ) : (
        <FormWrapper>
          <Form
            name="basic"
            initialValues={{
              surName: userProfile.surName,
              givenName: userProfile.givenName,
              DOB: moment(userProfile.DOB)
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <UserNameWrapper>
              <Typography> Username: {userProfile.userName}</Typography>
            </UserNameWrapper>

            <Form.Item label="Surname" name="surName">
              <Input />
            </Form.Item>

            <Form.Item label="Given Name" name="givenName">
              <Input />
            </Form.Item>

            <Form.Item label="Date of Birth" name="DOB">
              <DatePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update user profile
              </Button>
            </Form.Item>
          </Form>
        </FormWrapper>
      )}
    </PageWrapper>
  );
};
