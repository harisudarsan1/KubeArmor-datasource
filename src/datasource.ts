import { getBackendSrv, isFetchError, getTemplateSrv, } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';
import { NodeframeFields, EdgeframeFields, NetworkNodeframeFields, } from './constants';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, ElasticsearchResponse, Log, Hits, NodeFields, EdgeFields, NodeGraph, QueryType, LokiSearchResponse, HealthResponse, NetworkNodeGraph, NetworkData, NetworkNodeFields, NetworkGraph, FrameFieldType } from './types';
import { lastValueFrom } from 'rxjs';
import _, { defaults, random } from 'lodash';


// proxy route
// const routePath = 'nodegraphds';
export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  isProxyAccess: boolean;
  backendName: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
    this.isProxyAccess = instanceSettings.access === 'proxy';
    this.backendName = instanceSettings.jsonData.backendName;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {

    const promises = options.targets.flatMap(async target => {

      const query = defaults(target, DEFAULT_QUERY)
      // const params = getTemplateSrv().replace(query.APIquery, options.scopedVars)
      const filterNamespace = getTemplateSrv().replace(query.NamespaceQuery, options.scopedVars)
      const filterLabels = getTemplateSrv().replace(query.LabelQuery, options.scopedVars)
      const filterOperations = getTemplateSrv().replace(query.Operation, options.scopedVars)
      const myquery: QueryType = {
        NamespaceQuery: filterNamespace,
        LabelQuery: filterLabels,
        Operation: filterOperations

      }
      const logs: Log[] = await this.getGraphData(myquery)


      let FrameFields: FrameFieldType[] = []

      switch (myquery.Operation) {
        case "Network":

          FrameFields = NetworkNodeframeFields
          break
        case "Process":

          FrameFields = NodeframeFields
          break
      }


      const frameMetaData: any = { preferredVisualizationType: 'nodeGraph' };



      const nodeFrame = new MutableDataFrame({
        name: 'Nodes',
        refId: query.refId,
        fields: FrameFields,
        meta: frameMetaData

      })
      const edgeFrame = new MutableDataFrame({
        name: 'Edges',
        refId: query.refId,
        fields: EdgeframeFields,
        meta: frameMetaData
      })


      switch (myquery.Operation) {
        case "Process":
          const GraphData = getProcessGraph(logs, myquery)

          GraphData.nodes.forEach((node: any) => {
            nodeFrame.add(node);
          });

          GraphData.edges.forEach((edge: any) => {
            edgeFrame.add(edge);
          });
          break
        case "Network":
          const GraphData1 = getNetworkGraph(logs, myquery)

          GraphData1.nodes.forEach((node: any) => {
            nodeFrame.add(node);
          });

          GraphData1.edges.forEach((edge: any) => {
            edgeFrame.add(edge);
          });
          break
      }


      return [nodeFrame, edgeFrame];



    })


    return Promise.all(promises).then(data => ({ data: data[0] }));
  }

  async getGraphData(q: QueryType): Promise<Log[]> {
    let logs: Log[] = []

    switch (this.backendName) {
      case "ELASTICSEARCH":


        const response = await this.request<ElasticsearchResponse>("/_search", `size=1000&pretty&q=${(q.Operation === "Process") ? 'TTY:pts0' : 'kprobe'}`);
        const data: ElasticsearchResponse = response.data;

        // if (q.Operation === "Network") {
        //   data.hits.hits.map((item: Hits) => {
        //     if (item._source?.Owner?.Name) {
        //       console.log("Owner name: ", item._source.Owner.Name);
        //     }
        //   });
        // }

        logs = data.hits.hits.map((item: Hits) => item._source)
        break;
      case "LOKI":

        const resp = await this.request<LokiSearchResponse>("/loki/api/v1/query", `query={${(q.Operation === "Process") ? 'body_TTY="pts0"' : 'body_Operation="Network"'}}|json`);
        const Lokidata: LokiSearchResponse = resp.data;
        logs = Lokidata.Data.result.map(i => {
          const lokiLog: Log = {

            UpdatedTime: i.stream.body_UpdatedTime,
            ClusterName: i.stream.body_ClusterName,
            HostName: i.stream.body_HostName,
            NamespaceName: i.stream.body_NamespaceName,
            Owner: {
              ref: i.stream.body_Owner_Ref,
              Name: i.stream.body_Owner_Name,
              Namespace: i.stream.body_NamespaceName
            },
            PodName: i.stream.body_PodName,
            Labels: i.stream.body_Labels,
            ContainerID: i.stream.body_ContainerID,
            ContainerName: i.stream.body_ContainerName,
            ContainerImage: i.stream.body_ContainerImage,
            ParentProcessName: i.stream.body_ParentProcessName,
            ProcessName: i.stream.body_ProcessName,
            HostPPID: Number(i.stream.body_HostPPID),
            HostPID: Number(i.stream.body_HostPID),
            PPID: Number(i.stream.body_PPID),
            PID: Number(i.stream.body_PID),
            UID: Number(i.stream.body_UID),
            Type: i.stream.body_Type,
            Source: i.stream.body_Source,
            Operation: i.stream.body_Operation,
            Resource: i.stream.body_Resource,
            Data: i.stream.body_Data,
            Result: i.stream.body_Result,
            Cwd: i.stream.body_Cwd,
            TTY: i.stream.body_TTY!,
          }
          return lokiLog
        })
        break;
    }



    return logs


  }


  getDefaultQuery(_: CoreApp): Partial<MyQuery> {

    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    return !!query.Operation;
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
      // let testUrl = '/ready'
      // switch (this.backendName) {
      //   case 'elasticsearch':
      //     testUrl = '/_cluster/health'
      //     break;
      //   case 'loki':
      //     testUrl = '/ready'
      //     break;
      //   default:
      //     break;
      // }
      const response = await this.request<HealthResponse>('/_cluster/health');
      if (response.status === 200) {
        return {

          status: `response : ${response.data.number_of_nodes}`,
          message: `response :  clustername: ${response.data.cluster_name}`,
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



function getProcessGraph(logs: Log[], q: QueryType) {


  const colors = ["blue", "green", "orange", "cyan"]

  let nodeGraph: NodeGraph = {
    nodes: [],
    edges: []
  }


  const filteredlogs = logs.filter(item => {
    // const isProcess = item.Operation === "Process"
    const isCorrectOperation = q.Operation === item.Operation
    const isCorrectNamespace = (q.NamespaceQuery === "All") ? true : item.NamespaceName === q.NamespaceQuery
    const isCorrectLabel = (q.LabelQuery === "All") ? true : item.Labels === q.LabelQuery

    return (item.TTY === "pts0" && isCorrectOperation && isCorrectNamespace && isCorrectLabel)
  })

  let ContainerNodes: NodeFields[] = []

  const nodes: NodeFields[] = filteredlogs.map((log: Log) => {
    const isBlocked = log.Result === "Permission denied"
    if (log.PPID === 0) {

      const colorIndex = random(0, colors.length - 1)
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





function getNetworkGraph(logs: Log[], q: QueryType) {

  let networkNodes: NetworkNodeFields[] = []
  let networkEdges: EdgeFields[] = []
  let networkGraphs: NetworkGraph[] = []


  // const requiredFields = [
  //   "ownertype",
  //   "kprobe",
  //   "domain",
  //   "hostname",
  //   "namespace",
  //   "remoteip",
  //   "port",
  //   "protocol"
  // ];
  //
  // const filteredLogs = logs.filter(log => {
  //   if (!log.Data || !log.Resource) {
  //     return false;
  //   }
  //   const dataMap = extractData(log.Data);
  //   const resourceMap = extractData(log.Resource);
  //
  //   const hasRequiredFields = requiredFields.every(field =>
  //     dataMap.hasOwnProperty(field) || resourceMap.hasOwnProperty(field)
  //   );
  //
  //   const hasOwnerFields = log.Owner && log.Owner.Name && log.Owner.Namespace;
  //
  //   return hasRequiredFields && hasOwnerFields;
  // });

  logs.map(log => {
    const dataMap = extractData(log.Data);
    const resourceMap = extractData(log.Resource);

    const peertype = dataMap["ownertype"]

    const kprobeData = dataMap["kprobe"];
    const domainData = dataMap["domain"];

    let peerhostName = resourceMap["hostname"]
    const peernamespace = resourceMap["namespace"]

    let podservicename = resourceMap["podname"]
    const remoteIP = resourceMap["remoteip"];
    const port = resourceMap["port"];
    const protocol = resourceMap["protocol"];

    if (peertype === "service") {
      peerhostName += " SVC";
      if (resourceMap["servicename"]) {
        podservicename = resourceMap["servicename"];
      }
    }

    const networkData: NetworkData = {
      networkType: "kprobe: " + kprobeData,
      kprobe: kprobeData,
      domain: domainData,
      remoteIP: remoteIP,
      hostName: peerhostName,
      port: port,
      protocol: protocol,
    };

    const Ownernode: NetworkNodeFields = {
      id: log.PodName + log.NamespaceName,
      title: log.PodName,
      mainStat: log.Operation,
      color: log.Result === "Permission denied" ? "red" : "white",
    };
    console.log("owner: ", Ownernode);

    const Peernode: NetworkNodeFields = {
      id: podservicename + peernamespace,
      title: peerhostName,
      mainStat: podservicename,
      color: "white",
    };

    switch (kprobeData) {
      case "tcp_accept":
        const ID = log.PodName + podservicename + port + peernamespace + protocol;
        let networkGraph: NetworkGraph = {
          ndata: networkData,
          id: ID,
          source: Peernode,
          target: Ownernode,
        };
        networkGraphs.push(networkGraph);
        break;
      case "tcp_connect":
        const ID1 = podservicename + log.PodName + port + peernamespace + protocol;
        let networkGraph1: NetworkGraph = {
          ndata: networkData,
          id: ID1,
          source: Ownernode,
          target: Peernode,
        };
        networkGraphs.push(networkGraph1);
        break;
    }
  });

  networkGraphs.map(item => {
    networkNodes.push(item.source)

    networkNodes.push(item.target)

    let edge: EdgeFields = {
      id: item.id,
      source: item.source.id,
      target: item.target.id,

    }
    networkEdges.push(edge)

  })

  const nodeGraph: NetworkNodeGraph = {
    nodes: networkNodes,
    edges: networkEdges
  }



  return nodeGraph
}



function extractData(body: string): { [key: string]: string } {

  const pairs = body.split(" ");

  // Initialize an object to store extracted values
  const dataMap: { [key: string]: string } = {};

  // Loop through each key-value pair
  pairs.forEach(pair => {
    // Split each pair by '=' to separate key and value
    const parts = pair.split("=");
    if (parts.length === 2) {
      const key = parts[0];
      const value = parts[1];
      dataMap[key] = value;
    }
  });

  return dataMap;
}


