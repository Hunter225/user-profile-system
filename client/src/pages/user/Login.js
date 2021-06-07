import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import axios from 'axios';
import { apiBaseURL, timeout } from '../../config';
import { api, cookies, pageUrl } from '../../cosntant';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from '../../containers/PageWrapper';
import { AlertWrapper } from '../../containers/AlertWrapper';
import { FormWrapper } from '../../containers/FormWrapper';

const ButtonWrapper = styled.div`
  margin: 0 10px 0 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Login = () => {
  const [userStatus, setUserStatus] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const history = useHistory();

  const onFinish = async (values) => {
    setUserStatus(undefined);

    try {
      const response = await axios({
        method: 'post',
        timeout: timeout,
        url: `${apiBaseURL}${api.signIn}`,
        data: values
      });

      const userStatus = _.get(response, 'data.status');
      setUserStatus(userStatus);

      if (userStatus === 'ACTIVE') {
        const jwt = _.get(response, 'data.token');
        const userRole = _.get(response, 'data.role');
        Cookies.set(cookies.jwt, jwt);
        Cookies.set(cookies.userRole, userRole);

        if (userRole === 'USER') {
          history.push(pageUrl.user);
        } else if (userRole === 'ADMIN') {
          history.push(pageUrl.adminUser);
        }
      }
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
      {userStatus !== undefined && userStatus !== 'ACTIVE' && (
        <AlertWrapper>
          <Alert
            message="Warning"
            description={`User status is ${userStatus}`}
            type="warning"
            showIcon
            closable
          />
        </AlertWrapper>
      )}
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
      <FormWrapper>
        <Form
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="userName"
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <ButtonsWrapper>
              <ButtonWrapper>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </ButtonWrapper>
              <ButtonWrapper>
                <Button
                  type="primary"
                  onClick={() => history.push(pageUrl.register)}
                >
                  Register
                </Button>
              </ButtonWrapper>
            </ButtonsWrapper>
          </Form.Item>
        </Form>
      </FormWrapper>
    </PageWrapper>
  );
};
