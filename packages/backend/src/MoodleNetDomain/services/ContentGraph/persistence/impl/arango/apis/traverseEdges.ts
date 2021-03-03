import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { RelPage } from '../../../../ContentGraph.graphql.gen'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { aqlMergeTypenameById, cursorPaginatedQuery } from './helpers'

export const traverseEdges: ContentGraphPersistence['traverseEdges'] = async ({
  ctx,
  edgeType,
  page,
  parentNodeId,
  inverse,
  targetNodeType,
  edgePolicy,
  targetNodePolicy,
  sort,
}): Promise<Types.RelPage> => {
  const targetSide = inverse ? 'from' : 'to'
  const sourceSide = inverse ? 'to' : 'from'

  // TODO: define and implement sorting
  const aqlSort = (sort ?? [])
    .map(({ desc = false, edge = false, prop }) => `${edge ? 'edge' : 'node'}.${prop} ${desc ? 'DESC' : 'ASC'}`)
    .join(',')

  const targetEdgeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'edge',
    policy: edgePolicy,
    engine: basicArangoAccessFilterEngine,
  })

  const targetNodeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'node',
    policy: targetNodePolicy,
    engine: basicArangoAccessFilterEngine,
  })

  return cursorPaginatedQuery<RelPage>({
    pageTypename: 'RelPage',
    pageEdgeTypename: 'RelPageEdge',
    cursorProp: `edge._key`,
    page,
    mapQuery: pageFilterSortLimit => `
      FOR edge IN ${edgeType}
        FILTER edge.${targetSide} == '${targetNodeType}' 
          && edge._${sourceSide} == ${aqlstr(parentNodeId)}
          && ${targetEdgeAccessFilter}
        LET targetNode=Document(edge._${targetSide})
        
        FILTER ${targetNodeAccessFilter}
      

      ${pageFilterSortLimit}

      RETURN  {
        cursor,
        edge,
        node: ${aqlMergeTypenameById('targetNode')}
      }
    `,
  })
}
