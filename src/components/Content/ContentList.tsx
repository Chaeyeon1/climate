import styled from 'styled-components';
import { ContentCard } from './ContentCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
`;

export const ContentList = ({
  items,
}: {
  items: { title: string; description: string; image: string }[];
}) => {
  return (
    <Grid>
      {items.map((item, idx) => (
        <ContentCard key={idx} {...item} />
      ))}
    </Grid>
  );
};
