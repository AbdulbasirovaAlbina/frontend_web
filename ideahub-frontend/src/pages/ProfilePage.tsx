import { useState } from 'react';
import { Container, Title, TextInput, Button, Stack, Group, Paper, Divider, Notification, ActionIcon } from '@mantine/core';
import { IconUser, IconCheck, IconLogout, IconMail, IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser } from '../api/authService';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validate: {
      username: (v) => (v.trim().length < 2 ? 'Слишком короткое имя' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Неверный email'),
    },
  });

  const handleSave = async (values: { username: string; email: string }) => {
    setSaving(true);
    try {
      const updated = await updateCurrentUser({ username: values.username, email: values.email });
      updateUser({ username: updated.username, email: updated.email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      form.setErrors({
        username: undefined,
        email: err.response?.data || err.message || 'Не удалось сохранить изменения',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container size="sm" py="md">
      <ActionIcon 
        size="lg" 
        variant="subtle" 
        onClick={() => navigate('/')} 
        mb="md"
        title="На главную"
      >
        <IconArrowLeft />
      </ActionIcon>
      <Paper p="md" withBorder radius="lg">
        <Group align="center" gap="sm" mb="sm">
          <IconUser size={28} />
          <Title order={3}>Профиль</Title>
        </Group>

        {saved && (
          <Notification icon={<IconCheck size={16} />} color="teal" title="Сохранено" mb="md" onClose={() => setSaved(false)}>
            Изменения профиля сохранены!
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            <TextInput
              label="Имя профиля"
              leftSection={<IconUser size={16} />}
              placeholder="Ваше имя"
              required
              {...form.getInputProps('username')}
              styles={{ input: { backgroundColor: '#2a2a3a', color: 'white' } }}
            />
            <TextInput
              label="Email"
              leftSection={<IconMail size={16} />}
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
              styles={{ input: { backgroundColor: '#2a2a3a', color: 'white' } }}
            />
            <Group justify="center">
              <Button type="submit" loading={saving} color="blue">
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>

        <Divider my="lg" />

        <Button
          variant="light"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          fullWidth
        >
          Выйти
        </Button>
      </Paper>
    </Container>
  );
}

