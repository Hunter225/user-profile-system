import React, { useState } from 'react';
import { PageWrapper } from '../../containers/PageWrapper';
import { AlertWrapper } from '../../containers/AlertWrapper';
import { FormWrapper } from '../../containers/FormWrapper';
import { Form, Input, Button, Alert, DatePicker } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import { apiBaseURL, timeout } from '../../config';
import { api } from '../../cosntant';

export const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const onFinish = async (values) => {
    try {
      if (_.get(values, 'givenName') === '') {
        _.set(values, 'givenName', undefined);
      }

      if (_.get(values, 'surName') === '') {
        _.set(values, 'surName', undefined);
      }

      if (_.get(values, 'DOB') === '') {
        _.set(values, 'DOB', undefined);
      } else {
        const DOBObj = _.get(values, 'DOB');
        const month = DOBObj.format('MM');
        const day = DOBObj.format('DD');
        const year = DOBObj.format('YYYY');

        const DOBStr = `${day}-${month}-${year}`;
        _.set(values, 'DOB', DOBStr);
      }

      await axios({
        method: 'post',
        timeout: timeout,
        url: `${apiBaseURL}${api.signUp}`,
        data: values
      });
      setIsRegistered(true);
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
      {isRegistered ? (
        <AlertWrapper>
          <Alert
            message="Registration finished"
            description="Waiting Admin for approval"
            type="info"
            showIcon
          />
        </AlertWrapper>
      ) : (
        <FormWrapper>
          <Form
            initialValues={{
              surName: '',
              givenName: '',
              DOB: ''
            }}
            name="basic"
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

            <Form.Item label="Surname" name="surName">
              <Input />
            </Form.Item>

            <Form.Item label="Given Name" name="givenName">
              <Input />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="DOB"
              rules={[{ required: false }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </FormWrapper>
      )}
    </PageWrapper>
  );
};
