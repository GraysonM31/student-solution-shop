import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Network } from 'vis-network/dist/vis-network';
import type { Node as VisNode, Edge as VisEdge, Options as VisOptions } from 'vis-network/dist/types';
import { DataSet } from 'vis-data';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface MindMapProps {
  tasks: Task[];
  todos: Todo[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return '#4A5568';
    case 'in-progress': return '#4299E1';
    case 'completed': return '#48BB78';
    default: return '#4A5568';
  }
};

export const MindMap = ({ tasks, todos }: MindMapProps) => {
  useEffect(() => {
    const container = document.getElementById('mindmap');
    if (!container) {
      console.error('Mindmap container not found');
      return;
    }

    // Create nodes for all items
    const nodes = new DataSet<VisNode>(
      [...tasks, ...todos.map(todo => ({
        id: `todo-${todo.id}`,
        text: todo.text,
        description: '',
        status: todo.status,
        priority: 'medium' as const,
        dueDate: todo.createdAt,
      }))].map((item) => {
        const isTask = 'title' in item;
        return {
          id: item.id,
          label: isTask ? item.title : item.text,
          color: {
            background: getStatusColor(item.status),
            border: '#2D3748'
          },
          shape: 'box',
          margin: { top: 10, right: 10, bottom: 10, left: 10 },
          font: {
            color: 'white',
            size: 14
          },
          widthConstraint: {
            minimum: 150,
            maximum: 200
          },
          heightConstraint: {
            minimum: 50,
            maximum: 100
          }
        };
      })
    );

    // Create edges based on status and relationships
    const edges: VisEdge[] = [];
    
    // Connect items based on their status flow
    todos.forEach(todo => {
      if (todo.status === 'in-progress') {
        // Connect from todo to in-progress
        const todoNode = todos.find(t => t.id === todo.id && t.status === 'todo');
        if (todoNode) {
          edges.push({
            id: `edge-${todoNode.id}-${todo.id}`,
            from: `todo-${todoNode.id}`,
            to: `todo-${todo.id}`,
            arrows: 'to',
            color: '#4299E1',
            width: 2
          });
        }
      } else if (todo.status === 'completed') {
        // Connect from in-progress to completed
        const inProgressNode = todos.find(t => t.id === todo.id && t.status === 'in-progress');
        if (inProgressNode) {
          edges.push({
            id: `edge-${inProgressNode.id}-${todo.id}`,
            from: `todo-${inProgressNode.id}`,
            to: `todo-${todo.id}`,
            arrows: 'to',
            color: '#48BB78',
            width: 2
          });
        }
      }
    });

    // Connect tasks to related todos based on similar text
    tasks.forEach(task => {
      todos.forEach(todo => {
        if (task.title.toLowerCase().includes(todo.text.toLowerCase()) || 
            todo.text.toLowerCase().includes(task.title.toLowerCase())) {
          edges.push({
            id: `edge-task-${task.id}-todo-${todo.id}`,
            from: task.id,
            to: `todo-${todo.id}`,
            arrows: 'to',
            color: '#ED8936',
            width: 2,
            dashes: true
          });
        }
      });
    });

    const data = { nodes, edges: new DataSet<VisEdge>(edges) };
    const options: VisOptions = {
      nodes: {
        shape: 'box',
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        font: {
          color: 'white'
        },
        shadow: true
      },
      edges: {
        arrows: 'to',
        smooth: {
          enabled: true,
          type: 'curvedCW',
          roundness: 0.2
        },
        shadow: true
      },
      physics: {
        enabled: true,
        hierarchicalRepulsion: {
          nodeDistance: 150,
          centralGravity: 0.1
        },
        solver: 'hierarchicalRepulsion'
      },
      layout: {
        hierarchical: {
          direction: 'LR',
          sortMethod: 'directed',
          levelSeparation: 200
        }
      }
    };

    try {
      const network = new Network(container, data, options);
      console.log('Network created successfully');
      
      // Center the network after a short delay to ensure nodes are positioned
      setTimeout(() => {
        network.fit({
          animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
          }
        });
      }, 100);
    } catch (error) {
      console.error('Error creating network:', error);
    }
  }, [tasks, todos]);

  return (
    <Box
      bg="dark.200"
      p={4}
      borderRadius="lg"
      height="800px"
      position="relative"
      overflow="hidden"
    >
      <div id="mindmap" style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default MindMap; 