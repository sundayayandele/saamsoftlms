// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  'internalEvents': {
    'done.invoke.EdResource.Checking-In-Content:invocation[0]': {
      type: 'done.invoke.EdResource.Checking-In-Content:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'error.platform.EdResource.Checking-In-Content:invocation[0]': {
      type: 'error.platform.EdResource.Checking-In-Content:invocation[0]'
      data: unknown
    }
    'xstate.init': { type: 'xstate.init' }
    'xstate.stop': { type: 'xstate.stop' }
  }
  'invokeSrcNameMap': {
    CreateNewResource: 'done.invoke.EdResource.Checking-In-Content:invocation[0]'
  }
  'missingImplementations': {
    actions:
      | 'cancel_destroy_schedule'
      | 'cancel_meta_autogen_process'
      | 'destroy_all_data'
      | 'notify_creator'
      | 'schedule_destroy'
    delays: never
    guards:
      | 'issuer is admin or system'
      | 'issuer is creator'
      | 'issuer is creator and draft-form is formally valid'
      | 'issuer is creator or admin'
      | 'issuer is creator or admin or system'
      | 'issuer is creator or system'
      | 'issuer is creator+publisher and draft-form is formally valid for publishing'
      | 'issuer is system'
      | 'on creating issuer is not authenticated'
      | 'provided content is formally valid'
      | 'resource is not published and issuer is neither creator, admin or system'
    services: 'CreateNewResource'
  }
  'eventsCausingActions': {
    'assign-draft': 'draft-update'
    'assign-identifiers-and-content': 'done.invoke.EdResource.Checking-In-Content:invocation[0]'
    'assign-rejected-content-reason': 'error.platform.EdResource.Checking-In-Content:invocation[0]'
    'cancel_destroy_schedule': '*' | 'destroy' | 'recover' | 'xstate.stop'
    'cancel_meta_autogen_process': 'cancel-meta-autogen'
    'destroy_all_data': 'destroy'
    'notify_creator':
      | '*'
      | 'accept-content'
      | 'accept-publishing'
      | 'autogenerated-meta'
      | 'error.platform.EdResource.Checking-In-Content:invocation[0]'
      | 'reject-content'
      | 'reject-publishing'
      | 'trash'
      | 'xstate.stop'
    'schedule_destroy':
      | 'error.platform.EdResource.Checking-In-Content:invocation[0]'
      | 'reject-content'
      | 'trash'
  }
  'eventsCausingDelays': {}
  'eventsCausingGuards': {
    'issuer is admin or system': 'accept-publishing' | 'reject-publishing'
    'issuer is creator': 'autogenerate-meta' | 'cancel-meta-autogen' | 'recover' | 'set-draft'
    'issuer is creator and draft-form is formally valid': 'draft-update'
    'issuer is creator or admin': 'set-draft' | 'trash'
    'issuer is creator or admin or system': 'destroy'
    'issuer is creator or system': 'destroy'
    'issuer is creator+publisher and draft-form is formally valid for publishing': 'request-publish'
    'issuer is system': 'accept-content' | 'autogenerated-meta' | 'reject-content'
    'on creating issuer is not authenticated': '*'
    'provided content is formally valid': 'provide-content'
    'resource is not published and issuer is neither creator, admin or system': '*'
  }
  'eventsCausingServices': {
    CreateNewResource: 'provide-content'
  }
  'matchesStates':
    | 'Access-Denied'
    | 'Autogenerated-Meta'
    | 'Autogenerating-Meta'
    | 'Checking-In-Content'
    | 'Content-Rejected'
    | 'Creating'
    | 'Destroyed'
    | 'Draft'
    | 'In-Trash'
    | 'Published'
    | 'Publishing-Moderation'
    | 'Publishing-Rejected'
  'tags': never
}
