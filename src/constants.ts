import { FrameFieldType } from "types";

export const EdgeframeFields: FrameFieldType[] = [
  {
    name: 'id',
    type: 'string',
    config: {}
  },
  {
    name: 'source',
    type: 'string',
    config: {}
  },
  {
    name: 'target',
    type: 'string',
    config: {}
  },
]

export const NodeframeFields: FrameFieldType[] = [
  {
    name: 'id',
    type: 'string',
    config: {}
  },
  {
    name: 'title',
    type: 'string',
    config: {}
  },
  {
    name: 'mainStat',
    type: 'string',
    config: {}
  },
  {
    name: 'color',
    type: 'string',
    config: {}
  },
  {
    name: 'detail__Timestamp',
    type: 'number',
    config: { displayName: 'Timestamp' }
  },
  {
    name: 'detail__UpdatedTime',
    type: 'string',
    config: { displayName: 'Updated Time' }
  },
  {
    name: 'detail__ClusterName',
    type: 'string',
    config: { displayName: 'Cluster Name' }
  },
  {
    name: 'detail__HostName',
    type: 'string',
    config: { displayName: 'Host Name' }
  },
  {
    name: 'detail__NamespaceName',
    type: 'string',
    config: { displayName: 'Namespace Name' }
  },
  {
    name: 'detail__Owner',
    type: 'Podowner',
    config: { displayName: 'Owner' }
  },
  {
    name: 'detail__PodName',
    type: 'string',
    config: { displayName: 'Pod Name' }
  },
  {
    name: 'detail__Labels',
    type: 'string',
    config: { displayName: 'Labels' }
  },
  {
    name: 'detail__ContainerID',
    type: 'string',
    config: { displayName: 'Container ID' }
  },
  {
    name: 'detail__ContainerName',
    type: 'string',
    config: { displayName: 'Container Name' }
  },
  {
    name: 'detail__ContainerImage',
    type: 'string',
    config: { displayName: 'Container Image' }
  },
  {
    name: 'detail__ParentProcessName',
    type: 'string',
    config: { displayName: 'Parent Process Name' }
  },
  {
    name: 'detail__ProcessName',
    type: 'string',
    config: { displayName: 'Process Name' }
  },
  {
    name: 'detail__HostPPID',
    type: 'number',
    config: { displayName: 'Host PPID' }
  },
  {
    name: 'detail__HostPID',
    type: 'number',
    config: { displayName: 'Host PID' }
  },
  {
    name: 'detail__PPID',
    type: 'number',
    config: { displayName: 'PPID' }
  },
  {
    name: 'detail__PID',
    type: 'number',
    config: { displayName: 'PID' }
  },
  {
    name: 'detail__UID',
    type: 'number',
    config: { displayName: 'UID' }
  },
  {
    name: 'detail__Type',
    type: 'string',
    config: { displayName: 'Type' }
  },
  {
    name: 'detail__Source',
    type: 'string',
    config: { displayName: 'Source' }
  },
  {
    name: 'detail__Operation',
    type: 'string',
    config: { displayName: 'Operation' }
  },
  {
    name: 'detail__Resource',
    type: 'string',
    config: { displayName: 'Resource' }
  },
  {
    name: 'detail__Data',
    type: 'string',
    config: { displayName: 'Data' }
  },
  {
    name: 'detail__Result',
    type: 'string',
    config: { displayName: 'Result' }
  },
  {
    name: 'detail__Cwd',
    type: 'string',
    config: { displayName: 'Cwd' }
  },
  {
    name: 'detail__TTY',
    type: 'string',
    config: { displayName: 'TTY' }
  },
];

