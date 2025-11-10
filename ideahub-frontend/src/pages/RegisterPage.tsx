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
  Progress,
  Group,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { register } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validate: {
      username: (value) =>
        value.length >= 3 ? null : 'Имя должно быть не менее 3 символов',
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Неверный email',
      password: (value) =>
        value.length >= 8 ? null : 'Пароль должен быть не менее 8 символов',
    },
  });

  

  // Сила пароля
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/\d/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(form.values.password);
  const strengthColor = strength < 50 ? 'red' : strength < 75 ? 'yellow' : 'green';
  const strengthLabel = strength < 50 ? 'Слабый' : strength < 75 ? 'Средний' : 'Надёжный';

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError('');
    try {
      const res = await register(values.username, values.email, values.password);
      loginUser(res.token, res.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <IconBulb size={48} color="white" stroke={1.5} />
      </Center>

      <Title ta="center" c="white" size="h3">
        IdeaHub
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Присоединяйтесь к инновациям
      </Text>

      <Title ta="center" c="white" mt="md">
        Создайте свой аккаунт
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt="xl" gap="md">
          <TextInput
            label="Имя пользователя"
            placeholder="например, innovator123"
            required
            {...form.getInputProps('username')}
          />
          

          <TextInput
            label="Электронная почта"
            placeholder="you@example.com"
            required
            {...form.getInputProps('email')}
          />

          <div>
            <PasswordInput
              label="Пароль"
              placeholder="Введите надёжный пароль"
              required
              {...form.getInputProps('password')}
            />
            {form.values.password && (
              <>
                <Progress value={strength} color={strengthColor} size="sm" mt={5} />
                <Group justify="space-between" mt={5}>
                  <Badge color={strengthColor} variant="light" size="sm">
                    {strengthLabel}
                  </Badge>
                </Group>
              </>
            )}
          </div>

          {error && <Text c="red" size="sm">{error}</Text>}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            color="blue"
            size="md"
            disabled={
              strength < 50 ||
              form.values.username.length < 3 ||
              form.values.password.length < 8 ||
              !form.values.email.match(/^\S+@\S+$/)
            }
          >
            Создать аккаунт
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            Регистрируясь, вы соглашаетесь с нашими{' '}
            <Anchor href="/terms" c="blue" size="sm">
              Условиями обслуживания
            </Anchor>{' '}
            и{' '}
            <Anchor href="/privacy" c="blue" size="sm">
              Политикой конфиденциальности
            </Anchor>
            .
          </Text>

          <Text ta="center" size="sm" c="dimmed">
            Уже есть аккаунт?{' '}
            <Anchor href="/login" c="blue">
              Войти
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Container>
  );
}