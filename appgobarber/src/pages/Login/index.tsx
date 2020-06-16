import React, { useCallback, useRef } from 'react';
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

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles';

interface LogInFormData {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

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

      // await logIn({
      //   email: data.email,
      //   password: data.password,
      // });

      // history.push('/dashboard');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Erro na autenticação', 'Não foi possível fazer o login, cheque as credenciais.');

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
              <Title>Faça seu login</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>

              <Input
                name='email'
                icon='mail'
                placeholder='E-mail'
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='email-address'
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
                returnKeyType='send'
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>

            </Form>

            <ForgotPassword onPress={() => {}} >
              <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
            </ForgotPassword>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccount onPress={() => navigation.navigate('Register')} >
        <Icon name='log-in' size={20} color='#ff9000' />
        <CreateAccountText>Criar conta</CreateAccountText>
      </CreateAccount>
    </>
  );
}

export default LogIn;
