import React, { useRef, useCallback } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/AuthContext';

import { Container, BackButton, Title, UserAvatarButton, UserAvatar } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

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

      Alert.alert('Perfil atualizado com sucesso!');

      navigation.goBack();

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }
      Alert.alert('Erro ao atualizar o perfil', 'Não foi possível atualizar o perfil, tente novamente.');
    }
  }, [navigation, updateUser]);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation.goBack]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker({
        title: 'Escolha uma foto',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) return;

        if (response.error) {
          Alert.alert('Erro ao atualizar imagem de perfil');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        })

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });
      }
    );
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
      style= {{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={navigateBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleSubmit} >

              <Input
                autoCorrect
                autoCapitalize='words'
                name='name'
                icon='user'
                placeholder='Nome'
                returnKeyType='next'
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                name='email'
                icon='mail'
                placeholder='E-mail'
                keyboardType='email-address'
                autoCorrect={false}
                autoCapitalize='none'
                returnKeyType='next'
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                name='old_password'
                icon='lock'
                containerStyle={{ marginTop: 16 }}
                placeholder='Senha antiga'
                secureTextEntry
                textContentType='newPassword'
                returnKeyType='next'
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name='password'
                icon='lock'
                placeholder='Nova senha'
                secureTextEntry
                textContentType='newPassword'
                returnKeyType='next'
                onSubmitEditing={() => {
                  passwordConfirmInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordConfirmInputRef}
                name='password_confirmation'
                icon='lock'
                placeholder='Confirmar senha'
                secureTextEntry
                textContentType='newPassword'
                returnKeyType='send'
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm();
              }} >
                Confirmar mudanças
              </Button>

            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default Profile;
