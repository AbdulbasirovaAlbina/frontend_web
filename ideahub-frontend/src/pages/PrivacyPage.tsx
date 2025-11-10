import { Container, Title, Text, Stack, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';

export default function PrivacyPage() {
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
      <Title order={2} c="white" mb="md">Политика конфиденциальности</Title>
      <Stack gap="sm">
        <Text c="dimmed" size="sm">
          Мы храним только необходимые данные аккаунта (имя, email) и информацию,
          которую вы сами публикуете в сервисе. Данные используются для входа,
          персонализации и работы функций IdeaHub.
        </Text>
        <Text c="dimmed" size="sm">
          Мы не передаём ваши персональные данные третьим лицам без вашего согласия,
          за исключением случаев, предусмотренных законом.
        </Text>
        <Text c="dimmed" size="sm">
          Вы можете запросить удаление своего аккаунта и данных, обратившись к нам.
          Используя сервис, вы даёте согласие на обработку персональных данных.
        </Text>
      </Stack>
    </Container>
  );
}


