import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  constant: 6.5,
};

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface DataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

export interface NodeFields extends KubeArmorLogs {
  id: string;
  title: string;
  mainStat: string;
  color?: string;

}

export interface FrameFieldType {

  name: string;
  type: any;
  config: Record<string, any>;
}

export interface KubeArmorLogs {
  detail__Timestamp: number;
  detail__UpdatedTime: string;
  detail__ClusterName: string;
  detail__HostName: string;
  detail__NamespaceName: string;
  detail__Owner: Podowner;
  detail__PodName: string;
  detail__Labels: string;
  detail__ContainerID: string;
  detail__ContainerName: string;
  detail__ContainerImage: string;
  detail__ParentProcessName: string;
  detail__ProcessName: string;
  detail__HostPPID: number;
  detail__HostPID: number;
  detail__PPID: number;
  detail__PID: number;
  detail__UID: number;
  detail__Type: string;
  detail__Source: string;
  detail__Operation: string;
  detail__Resource: string;
  detail__Data: string;
  detail__Result: string;
  detail__Cwd: string;
  detail__TTY: string;
}

interface Podowner {
  // Define fields for Podowner if necessary
}

export interface EdgeFields {
  id: string;
  source: string;
  target: string;
}


