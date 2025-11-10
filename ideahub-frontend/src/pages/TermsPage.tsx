import { Container, Title, Text, Stack, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <Container size="md" my={40}>
      <ActionIcon 
        size="lg"
        variant="subtle"
        color="blue"
        onClick={() => navigate(-1)}
        mb="md"
      >
        <IconArrowLeft />
      </ActionIcon>
      <Title order={2} c="white" mb="md">Условия обслуживания</Title>
      <Stack gap="sm">
        <Text c="dimmed" size="sm">
          Используя IdeaHub, вы подтверждаете, что публикуете только свой контент
          и не нарушаете права третьих лиц. Вы соглашаетесь соблюдать законы,
          уважать других пользователей и не размещать запрещённые материалы.
        </Text>
        <Text c="dimmed" size="sm">
          Мы можем модерировать и удалять контент, который нарушает правила,
          а также ограничивать доступ к сервису при систематических нарушениях.
        </Text>
        <Text c="dimmed" size="sm">
          Сервис предоставляется «как есть». Мы стараемся обеспечивать стабильную
          работу, но не гарантируем отсутствие ошибок и простоев.
        </Text>
      </Stack>
    </Container>
  );
}


