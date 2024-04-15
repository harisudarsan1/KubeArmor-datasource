import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  // backendURL?: string;
  APIquery?: string;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  APIquery: ""
};

// export interface DataPoint {
//   Time: number;
//   Value: number;
// }
//
// export interface DataSourceResponse {
//   datapoints: DataPoint[];
// }

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
// export interface MySecureJsonData {
//   apiKey?: string;
// }

export interface NodeGraph {
  nodes: NodeFields[];
  edges: EdgeFields[];

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
  // detail__Owner: Podowner;
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
  ref: string;
  Name: string;
  Namespace: string;

  // Define fields for Podowner if necessary
}

export interface EdgeFields {
  id: string;
  source: string;
  target: string;
}


export interface Hits {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Log;
}

interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

interface Total {
  value: number;
  relation: string;
}

export interface ElasticsearchResponse {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: {
    total: Total;
    max_score: number;
    hits: Hits[];
  };
}

export interface Log {
  Timestamp: number;
  UpdatedTime: string;
  ClusterName: string;
  HostName: string;
  NamespaceName: string;
  Owner: Podowner;
  PodName: string;
  Labels: string;
  ContainerID: string;
  ContainerName: string;
  ContainerImage: string;
  ParentProcessName: string;
  ProcessName: string;
  HostPPID: number;
  HostPID: number;
  PPID: number;
  PID: number;
  UID: number;
  Type: string;
  Source: string;
  Operation: string;
  Resource: string;
  Data: string;
  Result: string;
  Cwd: string;
  TTY: string;
}

export type HealthResponse = {
  cluster_name: string;
  status: string;
  timed_out: boolean;
  number_of_nodes: number;
  number_of_data_nodes: number;
  active_primary_shards: number;
  active_shards: number;
  relocating_shards: number;
  initializing_shards: number;
  unassigned_shards: number;
  delayed_unassigned_shards: number;
  number_of_pending_tasks: number;
  number_of_in_flight_fetch: number;
  task_max_waiting_in_queue_millis: number;
  active_shards_percent_as_number: number;
};

