import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, BackgroundImage } from './styles';
import api from '../../services/api';

interface ResetPasswordData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Campo obrigatório'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password'), undefined],
          'Senhas diferentes'
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if (!token) throw new Error();

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      });

      history.push('/');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na definição de senha',
        description: 'Não foi possível redefinir a senha, tente novamente.'
      });
    }
  }, [addToast, history, location.search]);

  return (
  <>
    <Container>
      <Content>
        <AnimatedContent>

          <img src={logoImg} alt="Go Barber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Redefinição de senha</h1>

            <Input name='password' icon={FiLock} type="password" placeholder="Nova senha"/>
            <Input name='password_confirmation' icon={FiLock} type="password" placeholder="Confirme sua senha"/>

            <Button type="submit">Redefinir</Button>
          </Form>

        </AnimatedContent>
      </Content>

      <BackgroundImage />
    </Container>
  </>
)};

export default ResetPassword;
