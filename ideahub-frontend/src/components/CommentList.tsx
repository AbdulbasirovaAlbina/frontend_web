import { Stack, Paper, Group, Avatar, Text } from '@mantine/core';
import { formatDate } from '../utils/dateFormatter';

interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" mt="md">
        Пока нет комментариев. Будьте первым!
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {comments.map((c) => (
        <Paper key={c.id} p="sm" withBorder>
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <Avatar size="xs" radius="xl" />
              <Text size="sm" fw={500}>{c.author}</Text>
            </Group>
            <Text size="xs" c="dimmed">{formatDate(c.createdAt)}</Text>
          </Group>
          <Text size="sm">{c.text}</Text>
        </Paper>
      ))}
    </Stack>
  );
}