import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Loader,
  Notification,
} from '@mantine/core';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getIdea, updateIdea } from '../api/ideaService';
import type { Idea } from '../api/types';

export default function EditIdeaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadIdea = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        const loadedIdea = await getIdea(Number(id));
        
        // Проверка прав доступа (бэкенд должен возвращать 403, но проверяем и на фронте)
        if (loadedIdea.author.id !== user.id) {
          setError('У вас нет прав на редактирование этой идеи');
          return;
        }

        setIdea(loadedIdea);
        setTitle(loadedIdea.title);
        setDescription(loadedIdea.description);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Идея не найдена');
        } else if (err.response?.status === 403) {
          setError('У вас нет прав на редактирование этой идеи');
        } else {
          setError('Ошибка при загрузке идеи');
        }
      } finally {
        setLoading(false);
      }
    };
    loadIdea();
  }, [id, user]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !user || !idea) return;
    
    try {
      setSaving(true);
      setError(null);
      await updateIdea(idea.id, {
        title: title.trim(),
        description: description.trim(),
      });
      // Используем replace: false и добавляем timestamp для обновления данных
      navigate(`/ideas/${id}`, { replace: false, state: { refresh: Date.now() } });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('У вас нет прав на редактирование этой идеи');
      } else {
        setError(err.response?.data?.message || err.message || 'Ошибка при сохранении изменений');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="sm" my={20}>
        <Group justify="center" mt="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error || !idea) {
    return (
      <Container size="sm" my={20}>
        <Title mb="md">{error || 'Идея не найдена'}</Title>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </Container>
    );
  }

  return (
    <Container size="sm" my={20}>
      <ActionIcon size="lg" variant="subtle" onClick={() => navigate(-1)} mb="md">
        <IconArrowLeft />
      </ActionIcon>

      <Title order={2} mb="lg">Редактировать идею</Title>

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
        placeholder="Введите название"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        mb="md"
        disabled={saving}
      />

      <Textarea
        label="Описание"
        placeholder="Опишите идею подробнее"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        required
        minRows={6}
        mb="xl"
        disabled={saving}
      />

      <Group justify="space-between">
        <Button 
          variant="subtle" 
          color="gray" 
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          Отмена
        </Button>
        <Button
          color="blue"
          onClick={handleSave}
          disabled={!title.trim() || !description.trim() || saving}
          loading={saving}
        >
          Сохранить
        </Button>
      </Group>
    </Container>
  );
}