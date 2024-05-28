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

export const sampleNode_fields: FrameFieldType[] = [

  {
    name: 'id',
    type: 'string',
    config: {}
  },

]



export const NetworkNodeframeFields: FrameFieldType[] = [
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
  // {
  //   name: 'detail__PodServicename',
  //   type: 'string',
  //   config: {
  //     displayName: 'PodServiceName'
  //   }
  // },
  //
  // {
  //   name: 'detail__NamespaceName',
  //   type: 'string',
  //   config: {
  //     displayName: 'Namespace'
  //   }
  // }


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
  }, {
    name: 'nodeRadius',
    type: 'string',
    config: {}

  }, {
    name: 'highlighted',
    type: 'boolean',
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
  // {
  //   name: 'detail__Owner',
  //   type: 'Podowner',
  //   config: { displayName: 'Owner' }
  // },
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


export const sample_nodes = [
  {
    id: 'node1',
    title: 'Node Title 1',
    mainStat: '120',
    color: 'blue',
    detail__Timestamp: 1617981123,
    detail__UpdatedTime: '2021-04-09T12:12:03Z',
    detail__ClusterName: 'Cluster A',
    detail__HostName: 'Host1',
    detail__NamespaceName: 'Namespace1',
    detail__PodName: 'Pod1',
    detail__Labels: 'Label1',
    detail__ContainerID: 'c1234567890',
    detail__ContainerName: 'Container1',
    detail__ContainerImage: 'image1:v1',
    detail__ParentProcessName: 'init',
    detail__ProcessName: 'process1',
    detail__HostPPID: 1001,
    detail__HostPID: 1501,
    detail__PPID: 100,
    detail__PID: 150,
    detail__UID: 501,
    detail__Type: 'Service',
    detail__Source: 'Internal',
    detail__Operation: 'Read',
    detail__Resource: 'Resource1',
    detail__Data: 'Data1',
    detail__Result: 'Success',
    detail__Cwd: '/home/user',
    detail__TTY: 'tty1',
  },
  {
    id: 'node2',
    title: 'Node Title 2',
    mainStat: '130',
    color: 'red',
    detail__Timestamp: 1617982123,
    detail__UpdatedTime: '2021-04-09T12:30:03Z',
    detail__ClusterName: 'Cluster B',
    detail__HostName: 'Host2',
    detail__NamespaceName: 'Namespace2',
    detail__PodName: 'Pod2',
    detail__Labels: 'Label2',
    detail__ContainerID: 'c1234567891',
    detail__ContainerName: 'Container2',
    detail__ContainerImage: 'image2:v2',
    detail__ParentProcessName: 'systemd',
    detail__ProcessName: 'process2',
    detail__HostPPID: 2002,
    detail__HostPID: 2502,
    detail__PPID: 200,
    detail__PID: 250,
    detail__UID: 502,
    detail__Type: 'App',
    detail__Source: 'External',
    detail__Operation: 'Write',
    detail__Resource: 'Resource2',
    detail__Data: 'Data2',
    detail__Result: 'Failure',
    detail__Cwd: '/usr/local',
    detail__TTY: 'tty2',
  },
  {
    id: 'node3',
    title: 'Node Title 3',
    mainStat: '140',
    color: 'green',
    detail__Timestamp: 1617983123,
    detail__UpdatedTime: '2021-04-09T12:48:03Z',
    detail__ClusterName: 'Cluster C',
    detail__HostName: 'Host3',
    detail__NamespaceName: 'Namespace3',
    detail__PodName: 'Pod3',
    detail__Labels: 'Label3',
    detail__ContainerID: 'c1234567892',
    detail__ContainerName: 'Container3',
    detail__ContainerImage: 'image3:v3',
    detail__ParentProcessName: 'upstart',
    detail__ProcessName: 'process3',
    detail__HostPPID: 3003,
    detail__HostPID: 3503,
    detail__PPID: 300,
    detail__PID: 350,
    detail__UID: 503,
    detail__Type: 'Database',
    detail__Source: 'Internal',
    detail__Operation: 'Update',
    detail__Resource: 'Resource3',
    detail__Data: 'Data3',
    detail__Result: 'Success',
    detail__Cwd: '/opt',
    detail__TTY: 'tty3',
  },
  {
    id: 'node4',
    title: 'Node Title 4',
    mainStat: '150',
    color: 'yellow',
    detail__Timestamp: 1617984123,
    detail__UpdatedTime: '2021-04-09T13:05:03Z',
    detail__ClusterName: 'Cluster D',
    detail__HostName: 'Host4',
    detail__NamespaceName: 'Namespace4',
    detail__PodName: 'Pod4',
    detail__Labels: 'Label4',
    detail__ContainerID: 'c1234567893',
    detail__ContainerName: 'Container4',
    detail__ContainerImage: 'image4:v4',
    detail__ParentProcessName: 'launchd',
    detail__ProcessName: 'process4',
    detail__HostPPID: 4004,
    detail__HostPID: 4504,
    detail__PPID: 400,
    detail__PID: 450,
    detail__UID: 504,
    detail__Type: 'Middleware',
    detail__Source: 'Internal',
    detail__Operation: 'Delete',
    detail__Resource: 'Resource4',
    detail__Data: 'Data4',
    detail__Result: 'Failure',
    detail__Cwd: '/root',
    detail__TTY: 'tty4',
  },
  {
    id: 'node5',
    title: 'Node Title 5',
    mainStat: '160',
    color: 'purple',
    detail__Timestamp: 1617985123,
    detail__UpdatedTime: '2021-04-09T13:22:03Z',
    detail__ClusterName: 'Cluster E',
    detail__HostName: 'Host5',
    detail__NamespaceName: 'Namespace5',
    detail__PodName: 'Pod5',
    detail__Labels: 'Label5',
    detail__ContainerID: 'c1234567894',
    detail__ContainerName: 'Container5',
    detail__ContainerImage: 'image5:v5',
    detail__ParentProcessName: 'smss',
    detail__ProcessName: 'process5',
    detail__HostPPID: 5005,
    detail__HostPID: 5505,
    detail__PPID: 500,
    detail__PID: 550,
    detail__UID: 505,
    detail__Type: 'Application',
    detail__Source: 'External',
    detail__Operation: 'Access',
    detail__Resource: 'Resource5',
    detail__Data: 'Data5',
    detail__Result: 'Success',
    detail__Cwd: '/var',
    detail__TTY: 'tty5',
  }
];
export const sample_edges = [
  {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
  },
  {
    id: 'edge2',
    source: 'node2',
    target: 'node1',
  },
  {
    id: 'edge3',
    source: 'node3',
    target: 'node1',
  },

];

