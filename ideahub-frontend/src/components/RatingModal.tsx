import { useState } from 'react';
import {
  Modal,
  Title,
  Stack,
  Text,
  Group,
  Rating,
  Button,
  ActionIcon,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface RatingModalProps {
  opened: boolean;
  onClose: () => void;
  ideaId: number;
  onRate: (novelty: number, feasibility: number) => void;
}

export default function RatingModal({ opened, onClose, onRate }: RatingModalProps) {
  const [novelty, setNovelty] = useState(0);
  const [feasibility, setFeasibility] = useState(0);

  const handleSubmit = () => {
    if (novelty === 0 || feasibility === 0) return;
    onRate(novelty, feasibility);
    // Сбрасываем значения после отправки
    setNovelty(0);
    setFeasibility(0);
    onClose();
  };

  // Сбрасываем значения при закрытии модалки
  const handleClose = () => {
    setNovelty(0);
    setFeasibility(0);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size="sm"
      padding="lg"
      radius="lg"
      withCloseButton={false}
      overlayProps={{ opacity: 0.7, blur: 3 }}
      styles={{
        content: { backgroundColor: '#1a1a2e' },
        header: { display: 'none' },
      }}
    >
      {/* Крестик */}
      <ActionIcon
        size="sm"
        variant="subtle"
        color="gray"
        onClick={handleClose}
        style={{ position: 'absolute', top: 16, right: 16 }}
      >
        <IconX size={18} />
      </ActionIcon>

      <Stack gap="lg" align="center">
        <Title order={3} ta="center">
          Оцените идею
        </Title>

        {/* Новизна */}
        <Stack gap="xs" w="100%">
          <Group justify="space-between">
            <Text size="sm">Новизна</Text>
            <Text size="sm" c="dimmed">
              {novelty}/5
            </Text>
          </Group>
        <Rating
            value={novelty}
            onChange={setNovelty}
            size="lg"
            emptySymbol={
                <span style={{ fontSize: '36px', color: '#555' }}>☆</span>
            }
            fullSymbol={
                <span style={{ fontSize: '36px', color: '#ffd43b' }}>★</span>
            }
            count={5}
            styles={{
                symbolBody: { cursor: 'pointer' },
            }}
            />
        </Stack>

        {/* Реализуемость */}
        <Stack gap="xs" w="100%">
          <Group justify="space-between">
            <Text size="sm">Реализуемость</Text>
            <Text size="sm" c="dimmed">
              {feasibility}/5
            </Text>
          </Group>
          <Rating
            value={feasibility}
            onChange={setFeasibility}
            size="lg"
            emptySymbol={
                <span style={{ fontSize: '36px', color: '#555' }}>☆</span>
            }
            fullSymbol={
                <span style={{ fontSize: '36px', color: '#ffd43b' }}>★</span>
            }
            count={5}
            styles={{
                symbolBody: { cursor: 'pointer' },
            }}
            />
        </Stack>

        <Button
          fullWidth
          color="blue"
          size="md"
          onClick={handleSubmit}
          disabled={novelty === 0 || feasibility === 0}
        >
          Оценить
        </Button>
      </Stack>
    </Modal>
  );
}