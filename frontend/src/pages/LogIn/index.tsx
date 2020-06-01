import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.svg';
import { Container, Content, BackgroundImage } from './styles';

const LogIn: React.FC = () => (
  <>
    <Container>
      <Content>
        <img src={logoImg} alt="Go Barber" />

        <form>
          <h1>Faça seu login</h1>

          <Input name='email' icon={FiMail} placeholder="E-mail"/>
          <Input name='password' icon={FiLock} type="password" placeholder="Senha"/>

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </form>

        <a href='create'>
          <FiLogIn size={20} />
          Criar conta
        </a>

      </Content>

      <BackgroundImage />
    </Container>
  </>
);

export default LogIn;
