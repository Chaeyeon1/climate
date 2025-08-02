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

export const SearchFilter = ({ onSearch }: { onSearch: () => void }) => {
  return (
    <FilterWrapper>
      <StyledSelect>
        <StyledOption>전체 지역</StyledOption>
        <StyledOption>한국</StyledOption>
        <StyledOption>미국</StyledOption>
        <StyledOption>중국</StyledOption>
      </StyledSelect>
      <StyledSelect>
        <StyledOption>전체 종류</StyledOption>
        <StyledOption>논문</StyledOption>
        <StyledOption>뉴스</StyledOption>
        <StyledOption>기사</StyledOption>
      </StyledSelect>
      <StyledSelect>
        <StyledOption>전체 부문</StyledOption>
        <StyledOption>정책</StyledOption>
        <StyledOption>연구</StyledOption>
      </StyledSelect>
      <SearchContainer>
        <Input placeholder="검색어 입력" />
        <button onClick={onSearch}>검색</button>
      </SearchContainer>
    </FilterWrapper>
  );
};
