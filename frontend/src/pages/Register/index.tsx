import React, { useRef, useCallback } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/ToastContext';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimatedContent, BackgroundImage } from './styles';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().required('Campo obrigatório').email('Email inválido'),
        password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      addToast({
        type: 'success',
        title: 'Cadastro realizado',
        description: 'Você ja pode fazer seu login no GoBarber!.'
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
        title: 'Erro no cadastro',
        description: 'Não foi possível realizar o cadastro, tente novamente.'
      });
    }
  }, [addToast, history]);

return (
  <>
    <Container>
      <BackgroundImage />

      <Content>
        <AnimatedContent>

          <img src={logoImg} alt="Go Barber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name='name' icon={FiUser} placeholder="Nome"/>
            <Input name='email' icon={FiMail} placeholder="E-mail"/>
            <Input name='password' icon={FiLock} type="password" placeholder="Senha"/>

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to='/'>
            <FiArrowLeft size={20} />
            Voltar para login
          </Link>

        </AnimatedContent>
      </Content>
    </Container>
  </>
)};

export default Register;
