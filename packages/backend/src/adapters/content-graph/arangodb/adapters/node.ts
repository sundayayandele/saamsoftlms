import { GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import {
  BySlugAdapter,
  CreateNodeAdapter,
  DeleteNodeAdapter,
  EditNodeAdapter,
} from '../../../../ports/content-graph/node'
import { aqlGraphNode2GraphNode } from '../aql/helpers'
import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { createNodeQ } from '../aql/writes/createNode'
import { deleteNodeQ } from '../aql/writes/deleteNode'
import { updateNodeQ } from '../aql/writes/updateNode'
import { ContentGraphDB } from '../types'

export const getNodeBySlugAdapter = (db: ContentGraphDB): BySlugAdapter => ({
  async getNodeBySlug(slugId) {
    type T = typeof slugId._type
    const q = getAqlNodeByGraphNodeIdentifierQ<T>(slugId)
    const mAqlNode = await getOneResult(q, db)
    if (!mAqlNode) {
      return mAqlNode
    }
    const graphNode = aqlGraphNode2GraphNode<T>(mAqlNode)
    return graphNode
  },
})
export const getNodeByIdentifierAdapter = (db: ContentGraphDB) => ({
  async getNodeByIdentifier<NT extends GraphNodeType = GraphNodeType>(nodeIdentifier: GraphNodeIdentifier<NT>) {
    const q = getAqlNodeByGraphNodeIdentifierQ<NT>(nodeIdentifier)
    const mAqlNode = await getOneResult(q, db)
    if (!mAqlNode) {
      return null
    }
    const graphNode = aqlGraphNode2GraphNode(mAqlNode)
    return graphNode
  },
})

export const createNodeAdapter = (db: ContentGraphDB): Pick<CreateNodeAdapter, 'storeNode'> => ({
  storeNode: async ({ node }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node })
    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphNode2GraphNode<NT>(aqlResult)

    return result as any
  },
})

export const editNodeAdapter = (db: ContentGraphDB): EditNodeAdapter => ({
  updateNode: async ({ nodeData, nodeId }) => {
    type NT = typeof nodeId._type
    const q = updateNodeQ<NT>({ nodeData, nodeId })
    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphNode2GraphNode<NT>(aqlResult)

    return result as any
  },
})

export const deleteNodeAdapter = (db: ContentGraphDB): DeleteNodeAdapter => ({
  deleteNode: async ({ node }) => {
    const q = deleteNodeQ(node)
    const result = await getOneResult(q, db)
    return !!result
  },
})