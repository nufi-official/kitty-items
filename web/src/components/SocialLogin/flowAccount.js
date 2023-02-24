import {ec as EC} from "elliptic"
import {mnemonicToSeed} from "bip39"
import {bip32} from "./bip32"
import {SHA256 as SHA2} from "sha2"
import {getAccountAddress, ensureAccountIsCreatedOnChain} from "./flowportApi"

const seedToKeyPair = rootSeed => {
  const secp256k1 = new EC("secp256k1")
  const path = `m/44'/539'/0'/0/0` // bip44 path
  const rootNode = bip32.fromSeed(Buffer.from(rootSeed, "hex"))
  const child = rootNode.derivePath(path)

  return {
    privateKey: child.privateKey.toString("hex"),
    publicKey: secp256k1
      .keyFromPublic(child.publicKey)
      .getPublic()
      .encode("hex", false)
      .slice(2),
  }
}

export const getAccountData = async (
  mnemonic,
  {onCreateAccountStart, onCreateAccountEnd}
) => {
  const seed = await mnemonicToSeed(mnemonic)
  const {publicKey, privateKey} = seedToKeyPair(
    Buffer.from(seed).toString("hex")
  )
  console.log("getAccountData:publicKey", {publicKey})
  console.log("getAccountData:privateKey", {privateKey})

  await ensureAccountIsCreatedOnChain(publicKey, {
    onCreateAccountStart,
    onCreateAccountEnd,
  })

  return {
    publicKey,
    privateKey,
    address: (await getAccountAddress(publicKey)) ?? null,
  }
}

export const signTxMessage = async (message, privateKey) => {
  const secp256k1 = new EC("secp256k1")
  const signature = secp256k1
    .keyFromPrivate(Buffer.from(privateKey, "hex"))
    .sign(SHA2(Buffer.from(message, "hex")))
  const n = 32
  const r = signature.r.toArrayLike(Buffer, "be", n)
  const s = signature.s.toArrayLike(Buffer, "be", n)
  return await Promise.resolve(Buffer.concat([r, s]).toString("hex"))
}
