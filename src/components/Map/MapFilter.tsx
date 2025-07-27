import styled from 'styled-components';

const Filter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

export const MapFilter = () => {
  return (
    <Filter>
      <select>
        <option>2023년 1분기</option>
      </select>
      <select>
        <option>미세먼지</option>
      </select>
      <button>CSV 다운로드</button>
    </Filter>
  );
};
