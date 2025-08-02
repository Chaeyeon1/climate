import styled from 'styled-components';
import { CardContent } from './CardContent';
import { Link, useLocation } from 'react-router-dom';
import { SearchFilter } from '../Filter/SearchFilter';
import { useCardList } from '@/hooks/useCardList';
import { useState } from 'react';
import { CardParams } from '@/types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
`;

export const CardList = () => {
  const [filters, setFilters] = useState<CardParams>({});
  const { pathname } = useLocation();
  const { data, isLoading } = useCardList(filters);

  return (
    <>
      <SearchFilter onChangeFilter={setFilters} />
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <Grid>
          {data.map((item) => (
            <Link key={item.id} style={{ textDecoration: 'none' }} to={`${pathname}/${item.id}`}>
              <CardContent {...item} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};
