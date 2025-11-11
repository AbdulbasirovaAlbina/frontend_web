import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Title,
  Group,
  ActionIcon,
  Text,
  Button,
  Stack,
  Loader,
  Transition,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus, IconBulb, IconUser } from '@tabler/icons-react';
import IdeaCard from '../components/IdeaCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIdeas } from '../api/ideaService';
import type { Idea } from '../api/types';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>('trending');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const reqIdRef = useRef(0);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    const loadIdeas = async () => {
      let thisReq = 0;
      try {
        setLoading(true);
        thisReq = ++reqIdRef.current;
        const params = activeTab === 'trending' ? { sort: 'trending' } : undefined;
        const loadedIdeas = await getIdeas(params);
        if (thisReq === reqIdRef.current) {
          setIdeas(loadedIdeas);
        }
      } catch (err) {
        console.error('Ошибка при загрузке идей:', err);
      } finally {
        if (reqIdRef.current === thisReq) {
          setLoading(false);
        }
      }
    };
    loadIdeas();
  }, [location.pathname, location.state, activeTab]); 

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
      <Container size={isMobile ? 'sm' : 'lg'} py="md">
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Group gap="xs">
            <IconBulb size={isMobile ? 28 : 32} color="white" />
            <Title order={isMobile ? 3 : 2} c="white">IdeaHub</Title>
          </Group>
          <Group gap="xs">
            {user ? (
              <ActionIcon
                size={isMobile ? 'md' : 'lg'}
                radius="xl"
                color="blue"
                onClick={() => navigate('/profile')}
                title="Профиль"
              >
                <IconUser size={18} />
              </ActionIcon>
            ) : (
              <Button variant="subtle" color="blue" onClick={() => navigate('/login')} size={isMobile ? 'xs' : 'sm'}>
                Войти
              </Button>
            )}
          </Group>
        </Group>
      </Container>

      {/* ФИЛЬТРЫ КНОПКАМИ */}
      <Container size={isMobile ? 'sm' : 'lg'}>
        <Group justify="center" wrap="wrap" gap="xs">
          <Button
            radius="xl"
            size={isMobile ? 'xs' : 'sm'}
            variant={activeTab === 'trending' ? 'filled' : 'outline'}
            color="blue"
            onClick={() => setActiveTab('trending')}
            disabled={loading}
          >
            В тренде
          </Button>
          <Button
            radius="xl"
            size={isMobile ? 'xs' : 'sm'}
            variant={activeTab === 'new' ? 'filled' : 'outline'}
            color="blue"
            onClick={() => setActiveTab('new')}
            disabled={loading}
          >
            Новые
          </Button>
          <Button
            radius="xl"
            size={isMobile ? 'xs' : 'sm'}
            variant={activeTab === 'best' ? 'filled' : 'outline'}
            color="blue"
            onClick={() => setActiveTab('best')}
            disabled={loading}
          >
            Лучшие
          </Button>
          {user && (
            <ActionIcon
              size={isMobile ? 'md' : 'lg'}
              radius="xl"
              color="blue"
              onClick={() => navigate('/ideas/new')}
              title="Добавить идею"
            >
              <IconPlus size={18} />
            </ActionIcon>
          )}
        </Group>
      </Container>

      {/* СПИСОК ИДЕЙ */}
      <Container size={isMobile ? 'sm' : 'lg'} mt="md">
        <div style={{ position: 'relative', minHeight: 120 }}>
          {loading && (
            <Group
              justify="center"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.15)',
                backdropFilter: 'blur(2px)',
                zIndex: 1,
              }}
            >
              <Loader size="md" />
            </Group>
          )}
          <Stack gap="md">
            {displayedIdeas.length === 0 ? (
              <Text ta="center" c="dimmed">
                Нет идей в этой категории
              </Text>
            ) : (
              displayedIdeas.map((idea) => (
                <Transition
                  key={idea.id}
                  mounted
                  transition="slide-up"
                  duration={180}
                  timingFunction="ease-out"
                >
                  {(styles) => (
                    <div style={styles}>
                      <IdeaCard idea={idea} />
                    </div>
                  )}
                </Transition>
              ))
            )}
          </Stack>
        </div>
      </Container>
    </>
  );
}