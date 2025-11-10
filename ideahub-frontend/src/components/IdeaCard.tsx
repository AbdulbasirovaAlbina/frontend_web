import { Card, Text, Group, Avatar, Button, Badge } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconMessageCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface Idea {
  id: number;
  title: string;
  description: string;
  author: { username: string; createdAt?: string };
  likes: number;
  comments: number;
  trend: 'up' | 'down' | 'neutral';
  averageRating?: number;
  novelty?: number;
  feasibility?: number;
}

export default function IdeaCard({ idea }: { idea: Idea }) {
  const navigate = useNavigate();

  return (
    <Card shadow="sm" padding="md" radius="lg" withBorder mb="md">
      {/* Автор + (опционально) средний рейтинг */}
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Avatar size="sm" radius="xl" />
          <Text size="sm" fw={500}>
            {idea.author.username}
          </Text>
        </Group>
        {typeof idea.averageRating === 'number' && idea.averageRating > 0 && (
        <Badge color="yellow" variant="light" size="sm">
          ★ {idea.averageRating.toFixed(1)}
        </Badge>
        )}
      </Group>

      {/* Заголовок */}
      <Text 
        fw={700} 
        size="lg" 
        mb={4} 
        lineClamp={2}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {idea.title}
      </Text>

      {/* Описание */}
      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
        {idea.description}
      </Text>

      {/* Лайки, комментарии, тренд */}
      <Group justify="space-between" align="center">
        <Group gap="sm">
          {/* Тренд */}
          <Group gap={4}>
            {idea.trend === 'up' ? (
              <IconArrowUp size={16} color="#40c057" />
            ) : idea.trend === 'down' ? (
              <IconArrowDown size={16} color="#fa5252" />
            ) : null}
            <Text size="sm" c={idea.trend === 'up' ? 'green' : idea.trend === 'down' ? 'red' : 'dimmed'}>
              {idea.likes}
            </Text>
          </Group>

          {/* Комментарии */}
          <Group gap={4}>
            <IconMessageCircle size={16} color="#868e96" />
            <Text size="sm" c="dimmed">
              {idea.comments}
            </Text>
          </Group>
        </Group>

        {/* Кнопка Подробнее */}
        <Button
          variant="subtle"
          color="blue"
          size="sm"
          onClick={() => navigate(`/ideas/${idea.id}`)}
        >
          Подробнее
        </Button>
      </Group>
    </Card>
  );
}