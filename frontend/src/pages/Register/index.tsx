import React, { useRef, useCallback } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, BackgroundImage } from './styles';

const Register: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
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

    } catch (error) {
      const errors = getValidationErrors(error);
      formRef.current?.setErrors(errors);
    }
  }, []);

return (
  <>
    <Container>
      <BackgroundImage />

      <Content>
        <img src={logoImg} alt="Go Barber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name='name' icon={FiUser} placeholder="Nome"/>
          <Input name='email' icon={FiMail} placeholder="E-mail"/>
          <Input name='password' icon={FiLock} type="password" placeholder="Senha"/>

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href='create'>
          <FiArrowLeft size={20} />
          Voltar para login
        </a>

      </Content>
    </Container>
  </>
)};

export default Register;
