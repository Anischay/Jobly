import { render, screen } from '@testing-library/react';
import SkillGraph from '../SkillGraph';
import { SkillGraph as SkillGraphType } from '@/lib/types';

describe('SkillGraph', () => {
  const mockData: SkillGraphType = {
    nodes: [
      { id: '1', name: 'React', category: 'frontend', weight: 1 },
      { id: '2', name: 'TypeScript', category: 'language', weight: 1 },
      { id: '3', name: 'Node.js', category: 'backend', weight: 1 }
    ],
    edges: [
      { source: '1', target: '2', weight: 0.8 },
      { source: '2', target: '3', weight: 0.6 }
    ]
  };

  it('renders without crashing', () => {
    render(<SkillGraph data={mockData} />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('applies custom dimensions', () => {
    const width = 400;
    const height = 300;
    
    render(<SkillGraph data={mockData} width={width} height={height} />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveStyle({
      width: `${width}px`,
      height: `${height}px`
    });
  });
});
