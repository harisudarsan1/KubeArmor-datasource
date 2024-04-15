import { getBackendSrv, isFetchError, getTemplateSrv } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';
import { NodeframeFields, EdgeframeFields, } from './constants';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, ElasticsearchResponse, Log, Hits, NodeFields, EdgeFields, NodeGraph, } from './types';
import { lastValueFrom } from 'rxjs';
import _, { defaults } from 'lodash';


// proxy route
// const routePath = 'nodegraphds';
export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  isProxyAccess: boolean

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
    this.isProxyAccess = instanceSettings.access === 'proxy';
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.flatMap(async target => {
      const query = defaults(target, DEFAULT_QUERY)
      const params = getTemplateSrv().replace(query.APIquery, options.scopedVars)
      const GraphData: NodeGraph = await this.getGraphData("/_search", params)
      const frameMetaData: any = { preferredVisualizationType: 'nodeGraph' };
      const nodeFrame = new MutableDataFrame({
        name: 'Nodes',
        refId: query.refId,
        fields: NodeframeFields,
        meta: frameMetaData

      })
      const edgeFrame = new MutableDataFrame({
        name: 'Edges',
        refId: query.refId,
        fields: EdgeframeFields,
        meta: frameMetaData
      })
      GraphData.nodes.forEach((node: any) => {
        nodeFrame.add(node);
      });

      GraphData.edges.forEach((edge: any) => {
        edgeFrame.add(edge);
      });
      return [nodeFrame, edgeFrame];



    })


    return Promise.all(promises).then(data => ({ data: data[0] }));
  }

  async getGraphData(url: string, params?: string): Promise<NodeGraph> {
    let nodeGraph: NodeGraph = {
      nodes: [],
      edges: []
    }

    const response = await this.request<ElasticsearchResponse>('/_search');

    const data: ElasticsearchResponse = response.data;
    const logs: Log[] = data.hits.hits.map((item: Hits) => item._source)
    const nodes: NodeFields[] = logs.map((log: Log) => {
      const node: NodeFields = {
        id: `${log.HostPID}`,
        title: log.ProcessName,
        mainStat: log.Source,
        detail__UpdatedTime: log.UpdatedTime,
        detail__Timestamp: log.Timestamp,
        detail__ClusterName: log.ClusterName,
        detail__HostName: log.HostName,
        detail__NamespaceName: log.NamespaceName,
        detail__PodName: log.PodName,
        detail__Labels: log.Labels,
        detail__ContainerID: log.ContainerID,
        detail__ContainerName: log.ContainerName,
        detail__ContainerImage: log.ContainerImage,
        detail__ParentProcessName: log.ParentProcessName,
        detail__ProcessName: log.ProcessName,
        detail__HostPPID: log.HostPPID,
        detail__HostPID: log.HostPID,
        detail__PPID: log.PPID,
        detail__PID: log.PID,
        detail__UID: log.UID,
        detail__Type: log.Type,
        detail__Source: log.Source,
        detail__Operation: log.Operation,
        detail__Resource: log.Resource,
        detail__Data: log.Data,
        detail__Result: log.Result,
        detail__Cwd: log.Cwd,
        detail__TTY: log.TTY,
      }
      return node;

    })
    const edges: EdgeFields[] = logs.map(item => {
      const edge: EdgeFields = {
        id: `${item.HostPID}`,
        source: `${item.HostPPID}`,

        target: `${item.HostPID}`,

      }
      return edge


    })

    nodeGraph = {
      nodes: nodes,
      edges: edges
    }
    return nodeGraph

  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    return !!query.APIquery;
  }


  async request<T>(endpoint: string, params?: string) {

    const result = getBackendSrv().fetch<T>({
      url: `${this.baseUrl}${endpoint}${params?.length ? `?${params}` : ''}`,
      method: "GET",
      showSuccessAlert: true,
      showErrorAlert: true,

    });
    return lastValueFrom(result);
  }

  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request<ElasticsearchResponse>('/_search');
      if (response.status === 200) {
        return {

          status: 'sucess',
          message: `responses: ${response.data.took} ${response.data.hits.hits.map(i => i._source.TTY)}`,
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = '';
      if (_.isString(err)) {
        message = err;
      } else if (isFetchError(err)) {
        message = 'Fetch error: ' + (err.statusText ? err.statusText : defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}

