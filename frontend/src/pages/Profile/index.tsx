import React, { useRef, useCallback, ChangeEvent } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/ToastContext';
import { useAuth } from '../../hooks/AuthContext';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarUpdate } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const history = useHistory();

  const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.files) {
      const data = new FormData();

      data.append('avatar', event.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      });
    };
  }, [addToast, updateUser]);

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().required('Campo obrigatório').email('Email inválido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: value => !!value.length,
          then: Yup.string().required('Campo obrigtório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: value => !!value.length,
            then: Yup.string().required('Campo obrigtório'),
            otherwise: Yup.string(),
          })
          .oneOf([Yup.ref('password'), undefined],'Senhas diferentes'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const {
        name,
        email,
        old_password,
        password,
        password_confirmation
      } = data;

      const formData = {
        name,
        email,
        ...(old_password ? {
          old_password,
          password,
          password_confirmation,
        } : {})
      }

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
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
        title: 'Erro na atualização do perfil',
        description: 'Não foi possível atualizar o perfil, tente novamente.'
      });
    }
  }, [addToast, history, updateUser]);

return (
  <>
    <Container>
      <Content>

        <header>
          <Link to="/dashboard">
            <FiArrowLeft size={32} />
          </Link>
        </header>

        <Form
          ref={formRef}
          initialData = {{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >

          <AvatarUpdate>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera size={20} />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarUpdate>

          <h1>Meu perfil</h1>

          <Input name='name' icon={FiUser} placeholder="Nome"/>
          <Input name='email' icon={FiMail} placeholder="E-mail"/>

          <Input name='old_password' icon={FiLock} type="password" placeholder="Senha atual"/>
          <Input name='password' icon={FiLock} type="password" placeholder="Nova senha"/>
          <Input name='password_confirmation' icon={FiLock} type="password" placeholder="Confirmar senha"/>

          <Button type="submit">Confirmar mudanças</Button>

        </Form>

      </Content>
    </Container>
  </>
)};

export default Profile;
