import { useState } from 'react';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  ActionIcon,
  Loader,
  Notification,
} from '@mantine/core';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createIdea } from '../api/ideaService';

export default function AddIdeaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !user) return;
    
    try {
      setSubmitting(true);
      setError(null);
      const newIdea = await createIdea({
        title: title.trim(),
        description: description.trim(),
      });

      navigate('/', { state: { refresh: Date.now() } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка при создании идеи');
    } finally {
      setSubmitting(false);
    }
  };

  // Проверка авторизации
  if (!user) {
    return (
      <Container size="sm" my={20}>
        <Title mb="md">Необходима авторизация</Title>
        <Button onClick={() => navigate('/login')}>Войти</Button>
      </Container>
    );
  }

  return (
    <Container size="sm" my={20}>
      {/* Кнопка назад */}
      <ActionIcon 
        size="lg" 
        variant="subtle" 
        onClick={() => navigate('/', { state: { refresh: Date.now() } })} 
        mb="md"
      >
        <IconArrowLeft />
      </ActionIcon>

      <Title order={2} mb="lg">
        Опубликовать идею
      </Title>

      {error && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title="Ошибка"
          mb="md"
          onClose={() => setError(null)}
        >
          {error}
        </Notification>
      )}

      <TextInput
        label="Название"
        placeholder="Например, персональный финансовый тренер"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        mb="md"
        disabled={submitting}
      />

      <Textarea
        label="Описание"
        placeholder="Например, мобильное приложение, которое подключается к вашим банковским счетам..."
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        required
        minRows={6}
        mb="xl"
        disabled={submitting}
      />

      <Button
        fullWidth
        color="blue"
        size="lg"
        onClick={handleSubmit}
        disabled={!title.trim() || !description.trim() || submitting}
        loading={submitting}
      >
        Опубликовать идею
      </Button>
    </Container>
  );
}