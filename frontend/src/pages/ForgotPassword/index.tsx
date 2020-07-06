import React, { useRef, useCallback, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, BackgroundImage } from './styles';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Campo obrigatório').email('Email inválido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/forgot', {
        email: data.email,
      });

      addToast({
        type: 'success',
        title: 'Email de recuperação de senha enviado!',
        description: 'Verifique sua caixa de entrada para definir uma nova senha.'
      });

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Não foi possível fazer a recuperação de senha, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
  <>
    <Container>
      <Content>
        <AnimatedContent>

          <img src={logoImg} alt="Go Barber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>

            <Input name='email' icon={FiMail} placeholder="E-mail"/>

            <Button loading={loading} type="submit">Recuperar senha</Button>

          </Form>

          <Link to="/">Voltar para login</Link>

        </AnimatedContent>
      </Content>

      <BackgroundImage />
    </Container>
  </>
)};

export default ForgotPassword;
