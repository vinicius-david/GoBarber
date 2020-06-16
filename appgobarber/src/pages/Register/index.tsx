import React, { useRef, useCallback } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Title, BackToLogIn, BackToLogInText } from './styles';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

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

      // await api.post('/users', data);

      // history.push('/');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }
      Alert.alert('Erro no cadastro', 'Não foi possível realizar o cadastro, tente novamente.');
    }
  }, []);

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
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit} >

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
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name='password'
                icon='lock'
                placeholder='Senha'
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
                Entrar
              </Button>

            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToLogIn onPress={() => navigation.goBack()} >
        <Icon name='arrow-left' size={20} color='#fff' />
        <BackToLogInText>Voltar para o login</BackToLogInText>
      </BackToLogIn>
    </>
  );
}

export default Register;
