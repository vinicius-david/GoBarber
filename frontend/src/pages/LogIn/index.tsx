import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, BackgroundImage } from './styles';

interface LogInFormData {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { logIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: LogInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Campo obrigatório').email('Email inválido'),
        password: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await logIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Não foi possível fazer o login, cheque as credenciais.'
      });
    }
  }, [addToast, history, logIn]);

  return (
  <>
    <Container>
      <Content>
        <AnimatedContent>

          <img src={logoImg} alt="Go Barber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input name='email' icon={FiMail} placeholder="E-mail"/>
            <Input name='password' icon={FiLock} type="password" placeholder="Senha"/>

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to='/register'>
            <FiLogIn size={20} />
            Criar conta
          </Link>

        </AnimatedContent>
      </Content>

      <BackgroundImage />
    </Container>
  </>
)};

export default LogIn;
