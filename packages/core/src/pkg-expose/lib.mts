import assert from 'assert'
import { Readable } from 'stream'
import { assertCallInitiator, getSetCoreAsyncContext } from '../async-context/lib.mjs'
import { RpcStatusType } from '../exports.mjs'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgIdentifier, PkgModuleRef } from '../types.mjs'
import codes, { RpcStatusName } from './rpc-status-codes.mjs'
import { PkgExpose, PkgExposeDef, RpcFile } from './types.mjs'

type ExposedRegItem = {
  pkgId: PkgIdentifier
  // exposeDef: PkgExposeDef
  expose: PkgExpose
}
const _PKG_EXPOSED_REG: ExposedRegItem[] = []

export function pkgExpose(pkg_module_ref: PkgModuleRef) {
  return async function expose<_PkgExposeDef extends PkgExposeDef>(
    exposeDef: _PkgExposeDef,
  ): Promise<PkgExpose<_PkgExposeDef>> {
    const { pkgId } = await ensureRegisterPkg(pkg_module_ref)
    assert(
      !getExposedByPkgIdentifier(pkgId),
      `cannot expose twice for ${pkgId.name}@${pkgId.version}`,
    )
    // FIXME: ensure in "init" phase
    const pkgExpose: PkgExpose<_PkgExposeDef> = {
      ...exposeDef,
      pkgId,
    }

    const pkgExposeRegItem: ExposedRegItem = { /* exposeDef,  */ pkgId, expose: pkgExpose }
    _PKG_EXPOSED_REG.push(pkgExposeRegItem)

    return pkgExpose
  }
}

export function getExposedByPkgIdentifier(pkgId: PkgIdentifier) {
  const exposed = getExposedByPkgName(pkgId.name)
  //FIXME: check pkg version compatibility
  return exposed
}

export function getExposes() {
  return _PKG_EXPOSED_REG.slice()
}

export function getExposedByPkgName(pkgName: string) {
  return _PKG_EXPOSED_REG.find(({ pkgId: { name } }) => name === pkgName)
}

const RPC_FILE_HANDLER_SYM = Symbol('RPC_FILE_HANDLER_SYMBOL')

export function readableRpcFile(
  rpcFile: RpcFile,
  getReadable: () => Readable | Promise<Readable>,
): RpcFile {
  assert(!!rpcFile, 'cannot attach getReadable to unvalued RpcFile')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore brute force symbol prop mixin
  // rpcFile[RPC_FILE_HANDLER_SYM] = getReadable
  Object.defineProperty(rpcFile, RPC_FILE_HANDLER_SYM, {
    enumerable: false,
    value: getReadable,
  })
  return rpcFile
}

export async function assertRpcFileReadable(rpcFile: RpcFile): Promise<Readable> {
  const readable = await getMaybeRpcFileReadable(rpcFile)
  assert(readable, 'this RpcFile has no getReadable attached')
  return readable
}

export async function getMaybeRpcFileReadable(rpcFile: RpcFile): Promise<undefined | Readable> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore brute force symbol prop mixin
  const getReadable = rpcFile?.[RPC_FILE_HANDLER_SYM]
  if (!getReadable) {
    return
  }
  return await getReadable()
}

export function setRpcStatusCode(status: RpcStatusName | number, payload?: any) {
<<<<<<< HEAD
  const rpcStatusCode = typeof status === 'number' ? status : codes[status]

  const initiator = assertCallInitiator()
  getSetCoreAsyncContext.set(_ => ({ ..._, initiator, rpcStatus: { rpcStatusCode, payload } }))
=======
  const rpcStatus = RpcStatus(status, payload)

  const initiator = assertCallInitiator()
  getSetCoreAsyncContext.set(_ => ({ ..._, initiator, rpcStatus }))
}

export function RpcStatus(status: RpcStatusName | number, payload?: any): RpcStatusType {
  const rpcStatusCode = typeof status === 'number' ? status : codes[status]
  return { rpcStatusCode, payload }
>>>>>>> origin/fix/resource-review-finalize
}

export function getRpcStatusCode() {
  const rpcStatus = getSetCoreAsyncContext.get()?.rpcStatus
  if (rpcStatus === undefined) {
    return undefined
  }
  const { rpcStatusCode, payload } = rpcStatus
  // const statusDesc =
  //   typeof code === 'string' ? code : Object.entries(codes).find(([, _code]) => _code === code)?.[0]

  const rpcStatusType: RpcStatusType = {
    rpcStatusCode,
    payload,
  }
  return rpcStatusType
}
export function isRpcStatusType(_: any): _ is RpcStatusType {
<<<<<<< HEAD
  return 'number' === typeof _?.statusCode
=======
  return 'number' === typeof _?.rpcStatusCode
>>>>>>> origin/fix/resource-review-finalize
}
