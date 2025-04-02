import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, BoxProps } from '@chakra-ui/react';

interface DraggableCardProps extends BoxProps {
  id: string;
  children: React.ReactNode;
  isDraggable?: boolean;
}

export function DraggableCard({ id, children, isDraggable = true, ...props }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDraggable ? 'grab' : 'default',
    touchAction: 'none',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
      bg="dark.200"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      {...props}
    >
      <Box onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </Box>
  );
} 