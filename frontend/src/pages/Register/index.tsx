import React from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, BackgroundImage } from './styles';

const Register: React.FC = () => (
  <>
    <Container>
      <BackgroundImage />

      <Content>
        <img src={logoImg} alt="Go Barber" />

        <form>
          <h1>Faça seu cadastro</h1>

          <Input name='name' icon={FiUser} placeholder="Nome"/>
          <Input name='email' icon={FiMail} placeholder="E-mail"/>
          <Input name='password' icon={FiLock} type="password" placeholder="Senha"/>

          <Button type="submit">Cadastrar</Button>

        </form>

        <a href='create'>
          <FiArrowLeft size={20} />
          Voltar para login
        </a>

      </Content>
    </Container>
  </>
);

export default Register;
