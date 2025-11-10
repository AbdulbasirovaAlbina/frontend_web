import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Group,
  ActionIcon,
  Tabs,
  Text,
  Button,
  Stack,
  Loader,
} from '@mantine/core';
import { IconPlus, IconBulb } from '@tabler/icons-react';
import IdeaCard from '../components/IdeaCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIdeas } from '../api/ideaService';
import type { Idea } from '../api/types';

// Преобразование Idea в формат для IdeaCard
const transformIdeaForCard = (idea: Idea) => {
  const avgRating =
    idea.avgNovelty && idea.avgFeasibility
      ? (idea.avgNovelty + idea.avgFeasibility) / 2
      : 0;
  return {
  id: idea.id,
  title: idea.title,
  description: idea.description,
  author: {
    username: idea.author.username,
      createdAt: idea.createdAt, 
  },
  likes: idea.likes || 0,
  comments: idea.commentsCount || 0,
  trend: idea.trend || 'neutral',
  averageRating: avgRating > 0 ? avgRating : undefined,
  novelty: idea.avgNovelty,
  feasibility: idea.avgFeasibility,
  };
};

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>('trending');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка идей из API
  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true);
        const params = activeTab === 'trending' ? { sort: 'trending' } : undefined;
        const loadedIdeas = await getIdeas(params);
        setIdeas(loadedIdeas);
      } catch (err) {
        console.error('Ошибка при загрузке идей:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIdeas();
  }, [location.pathname, location.state, activeTab]); 

  // ФИЛЬТРАЦИЯ
  const getFilteredIdeas = () => {
    let filtered = [...ideas].map(transformIdeaForCard);

    if (activeTab === 'trending') {
      return filtered;
    }

    if (activeTab === 'new') {
      return filtered.sort((a, b) => b.id - a.id);
    }

    if (activeTab === 'best') {
    const score = (i: ReturnType<typeof transformIdeaForCard>) =>
      ((i.novelty || 0) + (i.feasibility || 0)) / 2;
    const withRatings = filtered.filter(
      (i) => typeof i.averageRating === 'number' && i.averageRating > 0
    );
    return withRatings.sort((a, b) => score(b) - score(a));
    }

    return filtered;
  };

  const displayedIdeas = getFilteredIdeas();

  return (
    <>
      {/* ШАПКА */}
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Group>
            <IconBulb size={32} color="white" />
            <Title order={2} c="white">IdeaHub</Title>
          </Group>
          <Group>
            <ActionIcon
              size="lg"
              radius="xl"
              color="blue"
              onClick={() => navigate('/ideas/new')}
            >
              <IconPlus size={20} />
            </ActionIcon>
            {user ? (
              <Button variant="subtle" color="gray" onClick={logout}>
                Выйти
              </Button>
            ) : (
              <Button variant="subtle" color="blue" onClick={() => navigate('/login')}>
                Войти
              </Button>
            )}
          </Group>
        </Group>
      </Container>

      {/* ТАБЫ */}
      <Tabs value={activeTab} onChange={setActiveTab} color="blue">
        <Tabs.List grow>
          <Tabs.Tab value="trending">В тренде</Tabs.Tab>
          <Tabs.Tab value="new">Новые</Tabs.Tab>
          <Tabs.Tab value="best">Лучшие</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* СПИСОК ИДЕЙ */}
      <Container size="lg" mt="md">
        {loading ? (
          <Group justify="center" mt="xl">
            <Loader size="lg" />
          </Group>
        ) : (
          <Stack gap="md">
            {displayedIdeas.length === 0 ? (
              <Text ta="center" c="dimmed">
                Нет идей в этой категории
              </Text>
            ) : (
              displayedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))
            )}
          </Stack>
        )}
      </Container>
    </>
  );
}