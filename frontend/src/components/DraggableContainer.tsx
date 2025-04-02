import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box } from '@chakra-ui/react';

interface DraggableContainerProps {
  items: any[];
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function DraggableContainer({
  items,
  onDragEnd,
  children,
  className,
  style,
  disabled = false,
}: DraggableContainerProps) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <Box 
          className={className} 
          style={style}
          display="flex"
          flexDirection="column"
          gap={4}
        >
          {children}
        </Box>
      </SortableContext>
      <DragOverlay>
        <Box
          bg="dark.200"
          p={4}
          borderRadius="lg"
          boxShadow="xl"
          opacity={0.8}
          cursor="grabbing"
        >
          Drag to reorder
        </Box>
      </DragOverlay>
    </DndContext>
  );
} 