import { useFilter } from '@/hooks/useFilter';
import { CardParams, EnvIndicatorFilterParams, Indicator, Period } from '@/types';
import { Dispatch, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  INDICATOR_HEAT_INDEX,
  INDICATOR_PRECIPITATION,
  INDICATOR_TEMPERATURE,
  INDICATOR_WBGT,
  INDICATOR_WILDFIRE_RISK,
  PERIOD_ALL,
  PERIOD_AVERAGE,
  PERIOD_SUMMER,
} from '../_related/const';
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

export const MapFilter = ({
  filters,
  onPeriodChange,
  onIndicatorChange,
}: {
  filters: EnvIndicatorFilterParams;
  onPeriodChange: (period: Period) => void;
  onIndicatorChange: (indicator: Indicator) => void;
}) => {
  const periodArray: { value: Period; label: string }[] = [
    { value: PERIOD_ALL, label: '전체' },
    { value: PERIOD_AVERAGE, label: '평균' },
    { value: PERIOD_SUMMER, label: '여름' },
  ];

  const indicatorArray: { value: Indicator; label: string }[] = [
    { value: INDICATOR_TEMPERATURE, label: '온도' },
    { value: INDICATOR_WBGT, label: 'WBGT' },
    { value: INDICATOR_HEAT_INDEX, label: '열지수' },
    { value: INDICATOR_WILDFIRE_RISK, label: '산불위험' },
    { value: INDICATOR_PRECIPITATION, label: '강수량' },
  ];

  return (
    <FilterWrapper>
      <StyledOption value="">기간</StyledOption>
      <StyledSelect value={filters.period} onChange={(e) => onPeriodChange(e.target.value as Period)}>
        {periodArray?.map((item) => (
          <StyledOption key={item.value} value={item.value}>
            {item.label}
          </StyledOption>
        ))}
      </StyledSelect>
      <StyledOption value="">지표</StyledOption>
      <StyledSelect value={filters.indicator} onChange={(e) => onIndicatorChange(e.target.value as Indicator)}>
        {indicatorArray?.map((item) => (
          <StyledOption key={item.value} value={item.value}>
            {item.label}
          </StyledOption>
        ))}
      </StyledSelect>
    </FilterWrapper>
  );
};
