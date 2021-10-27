import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { AuthId } from '@moodlenet/common/lib/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { getBaseOperatorsAdapter, getGraphOperatorsAdapter } from './common'

export const sendTextToProfileAdapter = plug<
  (_: { sender: GraphNode; recipient: GraphNode; text: string }) => Promise<boolean>
>(ns(__dirname, 'send-text-to-profile-adapter'))

export type SendTextToProfile = {
  authId: AuthId
  toProfileId: GraphNodeIdentifier
  text: string
}
export const sendTextToProfile = plug(
  ns(__dirname, 'send-text-to-profile'),
  async ({ authId, toProfileId, text }: SendTextToProfile) => {
    const { getBV } = await getBaseOperatorsAdapter()
    const { graphNode } = await getGraphOperatorsAdapter()

    const recipient = await getBV(graphNode(toProfileId))
    const sender = await getBV(graphNode({ _authKey: authId.key, _type: authId.profileType }))

    if (!(recipient && sender)) {
      return false
    }

    return sendTextToProfileAdapter({ sender, recipient, text })
  },
)
