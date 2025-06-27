import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/authService';
import { getUserProfile } from '@/services/ant-design-pro/profileService';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, Link, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import NexKoalaLogo from '../../../../public/nex-icon.png';

const useStyles = createStyles(({ token }) => ({
  action: {
    marginLeft: '8px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: token.colorPrimaryActive,
    },
  },
  lang: {
    width: 42,
    height: 42,
    lineHeight: '42px',
    position: 'fixed',
    right: 16,
    borderRadius: token.borderRadius,
    ':hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: '100% 100%',
  },
}));

const Lang = () => {
  const { styles } = useStyles();
  return <div className={styles.lang}>{SelectLang && <SelectLang />}</div>;
};

const LoginMessage: React.FC<{ content: string }> = ({ content }) => (
  <Alert message={content} type="error" showIcon style={{ marginBottom: 24 }} />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState('account');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { styles } = useStyles();
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const checkProfileComplete = async (email?: string): Promise<boolean> => {
    if (!email) return false;
    try {
      const res = await getUserProfile({ email });
      return !!res.data.data?.tin;
    } catch (err) {
      console.error('Failed to verify profile completeness:', err);
      return false;
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitLoading(true);
    try {
      const res = await login(values);
      if (res.data.succeeded) {
        const currentUser = res.data.data;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        let isProfileComplete = currentUser.roles.includes('Admin')
          ? true
          : await checkProfileComplete(values.email);

        localStorage.setItem('isProfileComplete', JSON.stringify(isProfileComplete));

        message.success(intl.formatMessage({ id: 'pages.login.success' }));

        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser,
          }));
        });

        const redirect = new URL(window.location.href).searchParams.get('redirect');
        const basePath = '/web-portal';
        let finalRedirect = redirect || '/dashboard';

        if (finalRedirect.startsWith(basePath)) {
          finalRedirect = finalRedirect.slice(basePath.length);
        }

        history.push(finalRedirect);
        return;
      }

      setUserLoginState(res.data.data);
    } catch (err) {
      message.error(intl.formatMessage({ id: 'pages.login.failure' }));
    } finally {
      setSubmitLoading(false);
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'menu.login', defaultMessage: '登录页' })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div style={{ flex: 1, padding: '32px 0' }}>
        <LoginForm
          title={<img alt="logo" src={NexKoalaLogo} width={190} />}
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{ autoLogin: true }}
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({ id: 'pages.login.submit', defaultMessage: '登录' }),
            },
            submitButtonProps: { loading: submitLoading },
          }}
        >
          <Tabs
            centered
            activeKey={type}
            onChange={setType}
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}

          {type === 'account' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                placeholder={intl.formatMessage({ id: 'pages.login.email.placeholder' })}
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: <FormattedMessage id="pages.login.email.required" />,
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          <div>
            <Link
              to="/user/forgot-password"
              style={{
                float: 'right',
                marginBottom: 24,
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
