import { render, screen, fireEvent } from '@testing-library/react';
import SkillMatchVisualizer from '../SkillMatchVisualizer';
import { MatchResult } from '@/lib/types';

describe('SkillMatchVisualizer', () => {
  const mockMatchResult: MatchResult = {
    score: 0.75,
    jobId: '1',
    userId: 'user1',
    matchedSkills: ['React', 'TypeScript'],
    missingSkills: ['Next.js', 'TailwindCSS'],
    createdAt: new Date()
  };

  it('renders match score correctly', () => {
    render(<SkillMatchVisualizer matchResult={mockMatchResult} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays matched skills', () => {
    render(<SkillMatchVisualizer matchResult={mockMatchResult} />);
    
    mockMatchResult.matchedSkills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('shows missing skills when expanded', () => {
    render(<SkillMatchVisualizer matchResult={mockMatchResult} />);
    
    // Initially missing skills should not be visible
    mockMatchResult.missingSkills.forEach(skill => {
      expect(screen.queryByText(skill)).not.toBeInTheDocument();
    });

    // Click show more
    fireEvent.click(screen.getByText('Show More'));

    // Now missing skills should be visible
    mockMatchResult.missingSkills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('calls onSkillClick when skill is clicked', () => {
    const handleSkillClick = jest.fn();
    render(
      <SkillMatchVisualizer
        matchResult={mockMatchResult}
        onSkillClick={handleSkillClick}
      />
    );
    
    // Click a matched skill
    fireEvent.click(screen.getByText(mockMatchResult.matchedSkills[0]));
    expect(handleSkillClick).toHaveBeenCalledWith(mockMatchResult.matchedSkills[0]);

    // Expand and click a missing skill
    fireEvent.click(screen.getByText('Show More'));
    fireEvent.click(screen.getByText(mockMatchResult.missingSkills[0]));
    expect(handleSkillClick).toHaveBeenCalledWith(mockMatchResult.missingSkills[0]);
  });

  it('toggles expanded state correctly', () => {
    render(<SkillMatchVisualizer matchResult={mockMatchResult} />);
    
    // Initially should show "Show More"
    expect(screen.getByText('Show More')).toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('Show More'));
    expect(screen.getByText('Show Less')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(screen.getByText('Show Less'));
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });
});
