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
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, ElasticsearchResponse, Log, Hits, NodeFields, EdgeFields, NodeGraph, HealthResponse, QueryType } from './types';
import { lastValueFrom } from 'rxjs';
import _, { defaults, random } from 'lodash';


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
      const filterNamespace = getTemplateSrv().replace(query.NamespaceQuery, options.scopedVars)
      const filterLabels = getTemplateSrv().replace(query.LabelQuery, options.scopedVars)
      const myquery: QueryType = {
        APIquery: params,
        NamespaceQuery: filterNamespace,
        LabelQuery: filterLabels

      }
      const GraphData: NodeGraph = await this.getGraphData("/_search", myquery)
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

  async getGraphData(url: string, q: QueryType): Promise<NodeGraph> {
    const colors = ["blue", "green", "orange", "cyan"]

    let nodeGraph: NodeGraph = {
      nodes: [],
      edges: []
    }

    const response = await this.request<ElasticsearchResponse>(url, q.APIquery);

    const data: ElasticsearchResponse = response.data;
    const logs: Log[] = data.hits.hits.map((item: Hits) => item._source)
    const filteredlogs = logs.filter(item => {
      const isProcess = item.Operation === "Process"
      const isCorrectNamespace = (q.NamespaceQuery === "All") ? true : item.NamespaceName === q.NamespaceQuery
      const isCorrectLabel = (q.LabelQuery === "All") ? true : item.Labels === q.LabelQuery

      return (item.TTY === "pts0" && isProcess && isCorrectNamespace && isCorrectLabel)
    })

    let ContainerNodes: NodeFields[] = []

    const nodes: NodeFields[] = filteredlogs.map((log: Log) => {
      const isBlocked = log.Result === "Permission denied"
      if (log.PPID === 0) {

        const colorIndex = random(0, 4)
        const containerNode: NodeFields = {
          id: `${log.ContainerName + log.NamespaceName}`,
          title: log.ContainerName,
          color: colors[colorIndex],
          detail__ContainerName: log.ContainerName,
          detail__NamespaceName: log.NamespaceName,
          childNode: `${log.HostPID + log.ContainerName + log.NamespaceName}`,


        }
        ContainerNodes.push(containerNode)
      }
      const node: NodeFields = {
        id: `${log.HostPID + log.ContainerName + log.NamespaceName}`,
        title: log.ProcessName,
        mainStat: log.Source,
        color: 'white',
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
      if (isBlocked) {
        node.color = "red"
      }
      return node;

    })

    const finalNodes: NodeFields[] = nodes.concat(ContainerNodes)

    const filteredEdges = nodes.filter(i => i.detail__PPID !== 0)

    const edges: EdgeFields[] =

      filteredEdges.map(item => {

        const edge: EdgeFields = {
          id: `${item.id + item.detail__PPID + item.detail__HostPID}`,
          source: `${item.detail__HostPPID! + item.detail__ContainerName! + item.detail__NamespaceName!}`,

          target: `${item.detail__HostPID + item.detail__ContainerName! + item.detail__NamespaceName}`,

        }
        return edge


      })

    const containerEdges: EdgeFields[] = ContainerNodes.map(node => {
      const edge: EdgeFields = {
        id: `${node.id + node.childNode + node.detail__ContainerName + node.detail__NamespaceName}`,
        source: `${node.id}`,
        target: `${node.childNode}`

      }
      return edge
    })

    const finalEdges: EdgeFields[] = edges.concat(containerEdges)

    nodeGraph = {
      nodes: finalNodes,
      edges: finalEdges
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
      const response = await this.request<HealthResponse>('/_cluster/health');
      if (response.status === 200) {
        return {

          status: 'sucess',
          message: `responses_clustername: ${response.data.cluster_name}`,
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

