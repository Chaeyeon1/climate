import { useFilter } from '@/hooks/useFilter';
import { CardParams } from '@/types';
import { Dispatch, useEffect, useState } from 'react';
import styled from 'styled-components';
const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 32px 0;
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  cursor: text;
`;

const StyledSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 36px 10px 12px;
  color: #18181b;
  background-image: url('/arrow-down.svg');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px;

  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #18181b;
  }
`;

const StyledOption = styled.option`
  background-color: #ffffff;
  color: #18181b;
  font-size: 14px;
  padding: 8px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

export const SearchFilter = ({ onChangeFilter }: { onChangeFilter: Dispatch<React.SetStateAction<CardParams>> }) => {
  const [localQuery, setLocalQuery] = useState('');
  const { data, isLoading } = useFilter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeFilter((prev) => ({ ...prev, query: localQuery }));
    }, 300);

    return () => clearTimeout(timeout);
  }, [localQuery]);

  return (
    <FilterWrapper>
      <StyledSelect onChange={(e) => onChangeFilter((prev) => ({ ...prev, region: e.target.value }))}>
        <StyledOption value="">전체 지역</StyledOption>
        {data?.regions?.map((item) => (
          <StyledOption key={item} value={item}>
            {item}
          </StyledOption>
        ))}
      </StyledSelect>
      <StyledSelect onChange={(e) => onChangeFilter((prev) => ({ ...prev, type: e.target.value }))}>
        <StyledOption value="">전체 종류</StyledOption>
        {data?.types?.map((item) => (
          <StyledOption key={item} value={item}>
            {item}
          </StyledOption>
        ))}
      </StyledSelect>
      <StyledSelect onChange={(e) => onChangeFilter((prev) => ({ ...prev, sector: e.target.value }))}>
        <StyledOption value="">전체 부문</StyledOption>
        {data?.sectors?.map((item) => (
          <StyledOption key={item} value={item}>
            {item}
          </StyledOption>
        ))}
      </StyledSelect>
      <SearchContainer>
        <Input placeholder="검색어 입력" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
      </SearchContainer>
    </FilterWrapper>
  );
};
