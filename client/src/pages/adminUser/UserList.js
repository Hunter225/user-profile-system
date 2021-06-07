import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { apiBaseURL, timeout } from '../../config';
import { adminApi, cookies } from '../../cosntant';
import Cookies from 'js-cookie';
import { PageWrapper } from '../../containers/PageWrapper';
import { AlertWrapper } from '../../containers/AlertWrapper';
import { TableWrapper } from '../../containers/TableWrapper';
import { Button, Spin, Alert, Table, Space, Input } from 'antd';

const { Search } = Input;

export const UserList = () => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [userList, setUserList] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(undefined);
  const [searchName, setSearchName] = useState(undefined);
  const token = Cookies.get(cookies.jwt);
  const [userRole, setUserRole] = useState(Cookies.get(cookies.userRole));
  const [triggerEffect, setTriggerEffect] = useState(false);

  const getUsers = async (token, page, limit, name) => {
    try {
      return await axios({
        method: 'get',
        params: { page, limit, userName: name, surName: name, givenName: name },
        timeout: timeout,
        url: `${apiBaseURL}${adminApi.users}`,
        headers: { authorization: token }
      });
    } catch (err) {
      const errorMessage = _.get(err, 'response.data.message');
      setErrorMessage(errorMessage);
    }
  };

  const activateUser = async (userId) => {
    try {
      setIsLoading(true);
      await axios({
        method: 'patch',
        data: { status: 'ACTIVE' },
        timeout: timeout,
        url: `${apiBaseURL}${adminApi.users}/${userId}`,
        headers: { authorization: token }
      });
      setTriggerEffect(!triggerEffect);
    } catch (err) {
      const errorMessage = _.get(err, 'response.data.message');
      setErrorMessage(errorMessage);
    }
  };

  const banUser = async (userId) => {
    try {
      setIsLoading(true);
      await axios({
        method: 'patch',
        data: { status: 'BANNED' },
        timeout: timeout,
        url: `${apiBaseURL}${adminApi.users}/${userId}`,
        headers: { authorization: token }
      });
      setTriggerEffect(!triggerEffect);
    } catch (err) {
      const errorMessage = _.get(err, 'response.data.message');
      setErrorMessage(errorMessage);
    }
  };

  const transformDOB = (DOB) => {
    const DOBStrArr = DOB.split('T')[0].split('-');
    const transformedDOB = `${DOBStrArr[2]}-${DOBStrArr[1]}-${DOBStrArr[0]}`;
    return transformedDOB;
  };

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      return;
    }
    setIsLoading(true);
    getUsers(token, page, pageSize, searchName).then((res) => {
      const userList = _.get(res, 'data.result');
      for (var user of userList) {
        var dobDateTime = _.get(user, 'DOB');
        if (!_.isUndefined(dobDateTime)) {
          var transformedDOB = transformDOB(_.get(user, 'DOB'));
          _.set(user, 'DOB', transformedDOB);
        }
      }
      const total = _.get(res, 'data.total');

      setUserList(userList);
      setTotal(total);
      setIsLoading(false);
    });
  }, [page, pageSize, searchName, token, triggerEffect]);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Surname',
      dataIndex: 'surName',
      key: 'surName'
    },
    {
      title: 'Given Name',
      dataIndex: 'givenName',
      key: 'givenName'
    },
    {
      title: 'Date of Birth (dd-mm-yyyy)',
      dataIndex: 'DOB',
      key: 'DOB'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => activateUser(record.id)}>
            Activate
          </Button>
          <Button type="danger" onClick={() => banUser(record.id)}>
            Ban
          </Button>
        </Space>
      )
    }
  ];

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

      {userRole === 'ADMIN' ? (
        <TableWrapper>
          {isLoading ? (
            <Spin />
          ) : (
            <Space direction="vertical">
              <Search
                placeholder="search users"
                onSearch={(search) => {
                  setSearchName(search);
                }}
                style={{ width: 200 }}
              />
              <Table
                columns={columns}
                dataSource={userList}
                pagination={{
                  defaultCurrent: page,
                  defaultPageSize: pageSize,
                  total: total,
                  showSizeChanger: true,
                  onChange: (current, pageSize) => {
                    setPage(current);
                    setPageSize(pageSize);
                  }
                }}
              />
            </Space>
          )}
        </TableWrapper>
      ) : (
        <AlertWrapper>
          <Alert
            message="Unathorized"
            description="Only Admin can access this page."
            type="error"
            showIcon
          />
        </AlertWrapper>
      )}
    </PageWrapper>
  );
};
