import { useState } from 'react';
import { IconBulb } from '@tabler/icons-react';
import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Anchor,
  Stack,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { login } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Неверный email',
      password: (value: string) =>
        value.length >= 6 ? null : 'Пароль должен быть не менее 6 символов',
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(values.email, values.password);
      loginUser(res.token, res.user);
      navigate('/'); // → на главную
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    // иконка
    <Container size={420} my={40}> 
    <Center mb="xl">
        <IconBulb size={60} color="white" stroke={1.5} />
    </Center>

      <Title ta="center" c="white">
        С возвращением в IdeaHub!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Пожалуйста, войдите в свой аккаунт.
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt="xl" gap="md">
          <TextInput
            label="Электронная почта"
            placeholder="example@email.com"
            required
            {...form.getInputProps('email')}
            styles={{ input: { backgroundColor: '#2a2a3a', color: 'white' } }}
          />

          <PasswordInput
            label="Пароль"
            placeholder="••••••"
            required
            {...form.getInputProps('password')}
            styles={{ input: { backgroundColor: '#2a2a3a', color: 'white' } }}
          />

          

          {error && <Text c="red" size="sm">{error}</Text>}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            color="blue"
            size="md"
          >
            Войти
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            Ещё нет аккаунта?{' '}
            <Anchor href="/register" c="blue">
              Зарегистрироваться
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Container>
  );
}