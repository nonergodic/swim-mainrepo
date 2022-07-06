/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface IRoutingInterface extends utils.Interface {
  functions: {
    "onChainSwap(address,uint256,address,address,uint256)": FunctionFragment;
    "receiveAndOverride(bytes,address,uint256)": FunctionFragment;
    "receiveAndSwap(bytes)": FunctionFragment;
    "registerToken(uint16,address,address,uint8)": FunctionFragment;
    "swapAndTransfer(address,uint256,uint256,uint16,bytes32,uint16,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "onChainSwap"
      | "receiveAndOverride"
      | "receiveAndSwap"
      | "registerToken"
      | "swapAndTransfer"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "onChainSwap",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "receiveAndOverride",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "receiveAndSwap",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerToken",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapAndTransfer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "onChainSwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveAndOverride",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveAndSwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapAndTransfer",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IRouting extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRoutingInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    onChainSwap(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<string>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    receiveAndOverride(
      _encodedVm: PromiseOrValue<BytesLike>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    receiveAndSwap(
      _encodedVm: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerToken(
      _tokenId: PromiseOrValue<BigNumberish>,
      _tokenContract: PromiseOrValue<string>,
      _chainPool: PromiseOrValue<string>,
      _tokenIndexInPool: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapAndTransfer(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _firstMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      _wormholeRecipientChain: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<BytesLike>,
      _toTokenId: PromiseOrValue<BigNumberish>,
      _secondMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  onChainSwap(
    _fromToken: PromiseOrValue<string>,
    _inputAmount: PromiseOrValue<BigNumberish>,
    _toOwner: PromiseOrValue<string>,
    _toToken: PromiseOrValue<string>,
    _minimumOutputAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  receiveAndOverride(
    _encodedVm: PromiseOrValue<BytesLike>,
    _toToken: PromiseOrValue<string>,
    _minimumOutputAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  receiveAndSwap(
    _encodedVm: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerToken(
    _tokenId: PromiseOrValue<BigNumberish>,
    _tokenContract: PromiseOrValue<string>,
    _chainPool: PromiseOrValue<string>,
    _tokenIndexInPool: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapAndTransfer(
    _fromToken: PromiseOrValue<string>,
    _inputAmount: PromiseOrValue<BigNumberish>,
    _firstMinimumOutputAmount: PromiseOrValue<BigNumberish>,
    _wormholeRecipientChain: PromiseOrValue<BigNumberish>,
    _toOwner: PromiseOrValue<BytesLike>,
    _toTokenId: PromiseOrValue<BigNumberish>,
    _secondMinimumOutputAmount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    onChainSwap(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<string>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    receiveAndOverride(
      _encodedVm: PromiseOrValue<BytesLike>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    receiveAndSwap(
      _encodedVm: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerToken(
      _tokenId: PromiseOrValue<BigNumberish>,
      _tokenContract: PromiseOrValue<string>,
      _chainPool: PromiseOrValue<string>,
      _tokenIndexInPool: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    swapAndTransfer(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _firstMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      _wormholeRecipientChain: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<BytesLike>,
      _toTokenId: PromiseOrValue<BigNumberish>,
      _secondMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    onChainSwap(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<string>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    receiveAndOverride(
      _encodedVm: PromiseOrValue<BytesLike>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    receiveAndSwap(
      _encodedVm: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerToken(
      _tokenId: PromiseOrValue<BigNumberish>,
      _tokenContract: PromiseOrValue<string>,
      _chainPool: PromiseOrValue<string>,
      _tokenIndexInPool: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapAndTransfer(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _firstMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      _wormholeRecipientChain: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<BytesLike>,
      _toTokenId: PromiseOrValue<BigNumberish>,
      _secondMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    onChainSwap(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<string>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    receiveAndOverride(
      _encodedVm: PromiseOrValue<BytesLike>,
      _toToken: PromiseOrValue<string>,
      _minimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    receiveAndSwap(
      _encodedVm: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerToken(
      _tokenId: PromiseOrValue<BigNumberish>,
      _tokenContract: PromiseOrValue<string>,
      _chainPool: PromiseOrValue<string>,
      _tokenIndexInPool: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapAndTransfer(
      _fromToken: PromiseOrValue<string>,
      _inputAmount: PromiseOrValue<BigNumberish>,
      _firstMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      _wormholeRecipientChain: PromiseOrValue<BigNumberish>,
      _toOwner: PromiseOrValue<BytesLike>,
      _toTokenId: PromiseOrValue<BigNumberish>,
      _secondMinimumOutputAmount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
