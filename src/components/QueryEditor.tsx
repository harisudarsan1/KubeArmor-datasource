import React, { ChangeEvent } from 'react';
import { InlineField, Input, Stack } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, data }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, APIquery: event.target.value });

    onRunQuery();
  };

  // const onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   onChange({ ...query, constant: parseFloat(event.target.value) });
  //   // executes the query
  //   onRunQuery();
  // };

  const { APIquery } = query;
  // const nodes = data?.series.map()

  return (
    <Stack gap={0}>
      <InlineField label="queries" labelWidth={16} tooltip="Enter API queries">
        <Input
          id="query-editor-query-text"
          onChange={onQueryTextChange}
          value={APIquery || ''}
          required
          placeholder="api queries"
        />
      </InlineField>
    </Stack>
  );
}
