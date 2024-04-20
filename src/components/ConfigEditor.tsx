// import { ChangeEvent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings, Select } from '@grafana/ui';
import React from 'react';
import { MyDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }


export const ConfigEditor: React.FC<Props> = ({ onOptionsChange, options }) => {

  const BackendOptions = [
    { label: 'Elasticsearch', value: 'ELASTICSEARCH' },
    { label: 'Loki Datasource', value: 'LOKI' }

  ]
  //
  const onBackendOptionsChange = (backendName: string) => {
    onOptionsChange({ ...options, })
  }


  return (
    <div>
      <DataSourceHttpSettings
        defaultUrl="https://elasticsearch:9200"
        dataSourceConfig={options}
        onChange={onOptionsChange}
      />
      <Select
        options={BackendOptions}
        value={options.jsonData.backendName}
        onChange={v => }
      />
    </div>
  );
};
