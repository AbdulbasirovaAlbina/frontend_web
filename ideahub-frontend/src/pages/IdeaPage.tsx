import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Avatar,
  Rating,
  Button,
  Stack,
  Paper,
  Textarea,
  ActionIcon,
  Modal,
  Loader,
  Notification,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/CommentList';
import RatingModal from '../components/RatingModal';
import { getIdea, deleteIdea, rateIdea, hasUserRated } from '../api/ideaService';
import { getComments, addComment } from '../api/commentService';
import { formatDate } from '../utils/dateFormatter';
import type { Idea } from '../api/types';
import type { Comment } from '../api/types';

export default function IdeaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [modalOpened, setModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [currentNovelty, setCurrentNovelty] = useState(0);
  const [currentFeasibility, setCurrentFeasibility] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [userHasRated, setUserHasRated] = useState<boolean>(false);
  const [checkingRated, setCheckingRated] = useState(false);

  useEffect(() => {
    const loadIdea = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const loadedIdea = await getIdea(Number(id));
        setIdea(loadedIdea);
        setCurrentNovelty(loadedIdea.avgNovelty);
        setCurrentFeasibility(loadedIdea.avgFeasibility);

        const loadedComments = await getComments(Number(id));
        setComments(loadedComments);

        if (user && user.id !== loadedIdea.author.id) {
          try {
            setCheckingRated(true);
            const rated = await hasUserRated(Number(id));
            setUserHasRated(rated);
          } catch (err) {
            console.error('Ошибка при проверке оценки:', err);
            setUserHasRated(false);
          } finally {
            setCheckingRated(false);
          }
        } else {
          setUserHasRated(false);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Идея не найдена');
        } else {
          setError('Ошибка при загрузке идеи');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadIdea();
  }, [id, location.state, user]);

  if (loading) {
    return (
      <Container size="md" my={20}>
        <Group justify="center" mt="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error || !idea) {
    return (
      <Container size="md" my={20}>
        <Title mb="md">{error || 'Идея не найдена'}</Title>
        <Button onClick={() => navigate('/')}>На главную</Button>
      </Container>
    );
  }

  const handleRate = async (novelty: number, feasibility: number) => {
    if (!user || !idea) return;
    
    try {

      const updatedIdea = await rateIdea(idea.id, { novelty, feasibility });
      
      setIdea(updatedIdea);
      setCurrentNovelty(updatedIdea.avgNovelty);
      setCurrentFeasibility(updatedIdea.avgFeasibility);
      
      setUserHasRated(true);

      setModalOpened(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Вы не можете оценить свою собственную идею');
      } else {
        setError(err.response?.data?.message || err.message || 'Ошибка при сохранении оценки');
      }
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !id) return;
    
    try {
      setCommentLoading(true);
      const newComment = await addComment(Number(id), comment.trim());
      setComments([...comments, newComment]);
      setComment('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка при добавлении комментария');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !idea) return;
    
    try {
      setDeleting(true);
      await deleteIdea(idea.id);

      navigate('/', { state: { refresh: Date.now() } });
    } catch (err: any) {
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          err.message || 
                          'Ошибка при удалении идеи';
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('У вас нет прав на удаление этой идеи');
      } else if (err.response?.status === 404) {
        setError('Идея не найдена');
      } else {
        setError(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при удалении идеи');
      }
      setDeleteModalOpened(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Container size={isMobile ? 'sm' : 'md'} my={20}>
      <ActionIcon 
        size={isMobile ? 'md' : 'lg'} 
        variant="subtle" 
        onClick={() => navigate('/', { state: { refresh: Date.now() } })} 
        mb="md"
      >
        <IconArrowLeft />
      </ActionIcon>

        <Title 
          order={1} 
          mb="xs"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            lineHeight: 1.3,
          }}
        >
          {idea.title}
        </Title>

        {/* КНОПКИ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ */}
        {user && user.id === idea.author.id && (
          <Group justify="flex-end" mb="md" wrap="wrap" gap="xs">
            <Button
              variant="subtle"
              color="blue"
              size={isMobile ? 'xs' : 'sm'}
              onClick={() => navigate(`/ideas/${idea.id}/edit`)}
            >
              Редактировать
            </Button>
            <Button
              variant="subtle"
              color="red"
              size={isMobile ? 'xs' : 'sm'}
              onClick={() => setDeleteModalOpened(true)}
            >
              Удалить
            </Button>
          </Group>
        )}

        <Group gap="xs" mb="lg" wrap="wrap">
          <Avatar size={isMobile ? 'xs' : 'sm'} radius="xl" />
          <Text size={isMobile ? 'xs' : 'sm'} c="dimmed">
            Автор: {idea.author.username} · {formatDate(idea.createdAt)}
          </Text>
        </Group>

        <Text size={isMobile ? 'sm' : 'md'} mb="xl" style={{ lineHeight: 1.6 }}>
          {idea.description}
        </Text>

        {/* Блок оценки - показываем только если пользователь не является автором */}
        {user && user.id !== idea.author.id && (
          <Paper p="md" withBorder mb="xl">
            <Title order={3} mb="md">Оцените эту идею</Title>
            <Stack gap="md">
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <Text w={120} size={isMobile ? 'sm' : 'md'}>Новизна</Text>
                <Rating value={currentNovelty} readOnly fractions={2} />
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ml="xs">{currentNovelty > 0 ? currentNovelty.toFixed(2) : '0'}/5</Text>
              </Group>
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <Text w={120} size={isMobile ? 'sm' : 'md'}>Реализуемость</Text>
                <Rating value={currentFeasibility} readOnly fractions={2} />
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ml="xs">{currentFeasibility > 0 ? currentFeasibility.toFixed(2) : '0'}/5</Text>
              </Group>
              {userHasRated ? (
                <Text size="sm" c="dimmed" ta="center" mt="xs">
                  Вы уже оценили эту идею
                </Text>
              ) : (
                <Button 
                  fullWidth 
                  color="blue" 
                  onClick={() => {
                    if (!userHasRated) {
                      setModalOpened(true);
                    }
                  }}
                  loading={checkingRated}
                  disabled={checkingRated || userHasRated}
                >
                Оставить оценку
              </Button>
              )}
            </Stack>
          </Paper>
        )}
        
        {/* Показываем рейтинг для всех (включая автора) */}
        {(!user || user.id === idea.author.id) && (
          <Paper p="md" withBorder mb="xl">
            <Title order={3} mb="md">Рейтинг идеи</Title>
            <Stack gap="md">
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <Text w={120} size={isMobile ? 'sm' : 'md'}>Новизна</Text>
                <Rating value={currentNovelty} readOnly fractions={2} />
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ml="xs">{currentNovelty > 0 ? currentNovelty.toFixed(2) : '0'}/5</Text>
              </Group>
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <Text w={120} size={isMobile ? 'sm' : 'md'}>Реализуемость</Text>
                <Rating value={currentFeasibility} readOnly fractions={2} />
                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ml="xs">{currentFeasibility > 0 ? currentFeasibility.toFixed(2) : '0'}/5</Text>
              </Group>
              {user && user.id === idea.author.id && (
                <Text size="sm" c="dimmed" ta="center" mt="xs">
                  Вы не можете оценить свою собственную идею
                </Text>
              )}
            </Stack>
          </Paper>
        )}

        <Title order={3} mb="md">Обсуждение ({comments.length})</Title>
        <CommentList comments={comments.map(c => ({
          id: c.id,
          author: c.author.username,
          text: c.text,
          createdAt: c.createdAt,
        }))} />

        {user && (
          <Stack mt="lg" gap="xs">
            <Textarea
              placeholder="Добавить свой комментарий..."
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              minRows={2}
              autosize
              disabled={commentLoading}
              styles={{
                input: { backgroundColor: '#2a2a3a', color: 'white', borderRadius: '8px' },
              }}
            />
            <Button 
              fullWidth 
              color="blue" 
              onClick={handleAddComment} 
              disabled={!comment.trim() || commentLoading}
              loading={commentLoading}
            >
              Отправить
            </Button>
          </Stack>
        )}
      </Container>

      {/* Модалка оценки */}
      <RatingModal
        opened={modalOpened && !userHasRated}
        onClose={() => {
          setModalOpened(false);
          setError(null); // Очищаем ошибки при закрытии
        }}
        ideaId={idea.id}
        onRate={handleRate}
      />
      
      {/* Уведомление об ошибке */}
      {error && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          title="Ошибка"
          onClose={() => setError(null)}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          {error}
        </Notification>
      )}

      {/* Модалка удаления */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        centered
        size="sm"
        title="Удалить идею?"
        overlayProps={{ opacity: 0.7, blur: 3 }}
      >
        <Text size="sm" mb="md">
          Вы уверены, что хотите удалить идею "<strong>{idea.title}</strong>"?
          Это действие нельзя отменить.
        </Text>
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
        <Group justify="space-between">
          <Button 
            variant="subtle" 
            color="gray" 
            onClick={() => setDeleteModalOpened(false)}
            disabled={deleting}
          >
            Отмена
          </Button>
          <Button 
            color="red" 
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}
          >
            Удалить
          </Button>
        </Group>
      </Modal>
    </>
  );
}