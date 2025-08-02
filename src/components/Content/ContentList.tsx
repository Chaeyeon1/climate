import styled from 'styled-components';
import { ContentCard } from './ContentCard';
import { Link } from 'react-router-dom';
import { SearchFilter } from '../Filter/SearchFilter';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
`;

export const ContentList = ({ items }: { items: { title: string; description: string; image: string }[] }) => {
  return (
    <>
      <SearchFilter onSearch={() => console.log('검색')} />
      <Grid>
        {items.map((item, idx) => (
          <Link style={{ textDecoration: 'none' }} to={`/inventory/${idx}`}>
            <ContentCard key={idx} {...item} />
          </Link>
        ))}
      </Grid>
    </>
  );
};
