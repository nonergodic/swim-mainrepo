export type Propeller = {
  "version": "0.1.0",
  "name": "propeller",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "propeller",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "propellerSender",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sender"
              }
            ]
          }
        },
        {
          "name": "propellerRedeemer",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "redeemer"
              }
            ]
          }
        },
        {
          "name": "propellerRedeemerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "pool_token_mint_0"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "pool_token_mint_1"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenMint0",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenMint1",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeParams"
          }
        }
      ]
    },
    {
      "name": "createTokenIdMap",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller.token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool.lp_mint_key"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "tokenIdMap",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "token_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "target_token_index"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetTokenIndex",
          "type": "u16"
        },
        {
          "name": "pool",
          "type": "publicKey"
        },
        {
          "name": "poolTokenIndex",
          "type": "u8"
        },
        {
          "name": "poolTokenMint",
          "type": "publicKey"
        },
        {
          "name": "poolIx",
          "type": {
            "defined": "PoolInstruction"
          }
        }
      ]
    },
    {
      "name": "add",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inputAmounts",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        },
        {
          "name": "minimumMintAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "swapExactInput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactInputAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "swapExactOutput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumInputAmount",
          "type": "u64"
        },
        {
          "name": "exactOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "removeUniform",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactBurnAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmounts",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        },
        {
          "name": "memo",
          "type": "bytes"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "removeExactBurn",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactBurnAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeExactOutput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumBurnAmount",
          "type": "u64"
        },
        {
          "name": "exactOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "transferNativeWithPayload",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBridgeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "userTokenBridgeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBridge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody_signer"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "token_bridge"
            }
          }
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority_signer"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "token_bridge"
            }
          }
        },
        {
          "name": "wormholeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Bridge"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Note:",
            "switched to using a `Signer`",
            "instead of a PDA since a normal token bridge transfer",
            "uses a Keypair.generate()",
            "",
            "A new one needs to be used for every transfer",
            "",
            "WH expects this to be an uninitialized account so might",
            "be able to use a PDA still in the future.",
            "maybe [b\"propeller\".as_ref(), payer, sequence_value]"
          ]
        },
        {
          "name": "wormholeEmitter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "emitter"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Sequence"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "wormhole_emitter"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "fee_collector"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Transfers with payload also include the address of the account or contract",
            "that sent the transfer. Semantically this is identical to \"msg.sender\" on",
            "EVM chains, i.e. it is the address of the immediate caller of the token",
            "bridge transaction.",
            "Since on Solana, a transaction can have multiple different signers, getting",
            "this information is not so straightforward.",
            "The strategy we use to figure out the sender of the transaction is to",
            "require an additional signer ([`SenderAccount`]) for the transaction.",
            "If the transaction was sent by a user wallet directly, then this may just be",
            "the wallet's pubkey. If, however, the transaction was initiated by a",
            "program, then we require this to be a PDA derived from the sender program's",
            "id and the string \"sender\". In this case, the sender program must also",
            "attach its program id to the instruction data. If the PDA verification",
            "succeeds (thereby proving that [[`cpi_program_id`]] indeed signed the",
            "transaction), then the program's id is attached to the VAA as the sender,",
            "otherwise the transaction is rejected.",
            "",
            "Note that a program may opt to forego the PDA derivation and instead just",
            "pass on the original wallet as the wallet account (or any other signer, as",
            "long as they don't provide their program_id in the instruction data). The",
            "sender address is provided as a means for protocols to verify on the",
            "receiving end that the message was emitted by a contract they trust, so",
            "foregoing this check is not advised. If the receiving contract needs to know",
            "the sender wallet's address too, then that information can be included in",
            "the additional payload, along with any other data that the protocol needs to",
            "send across. The legitimacy of the attached data can be verified by checking",
            "that the sender contract is a trusted one.",
            "",
            "Also note that attaching the correct PDA as [[`SenderAccount`]] but missing the",
            "[[`cpi_program_id`]] field will result in a successful transaction, but in",
            "that case the PDA's address will directly be encoded into the payload",
            "instead of the sender program's id."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sender"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormhole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "targetChain",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetTokenId",
          "type": "u16"
        },
        {
          "name": "owner",
          "type": "bytes"
        },
        {
          "name": "gasKickstart",
          "type": "bool"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "memo",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "completeNativeWithPayload",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller.token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBridgeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "message",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "contains the VAA",
            "{",
            "...MessageData:",
            "payload: PayloadTransferWithPayload = {",
            "pub amount: U256,",
            "}",
            "}"
          ]
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "seeds = [",
            "vaa.emitter_address, vaa.emitter_chain, vaa.sequence",
            "],",
            "seeds::program = token_bridge"
          ]
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "owned by redeemer"
          ]
        },
        {
          "name": "redeemer",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "redeemer will be PDA derived from [\"redeemer\"], seeds::program = propeller::id()",
            "will have to be signed when it invokes complete_transfer_with_payload",
            "if complete transfer with payload not meant to be handled by a contract redeemer will be the same as vaa.to",
            "(NOT the `to` account)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "redeemer"
              }
            ]
          }
        },
        {
          "name": "feeRecipient",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "this is \"to_fees\"",
            "TODO: type as TokenAccount?"
          ]
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormhole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "propellerMessage",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "claim"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "message"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "tokenIdMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "outputTokenIndex",
            "type": "u16"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "poolTokenIndex",
            "type": "u8"
          },
          {
            "name": "poolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "poolIx",
            "type": {
              "defined": "PoolInstruction"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propellerClaim",
      "docs": [
        "Works similarly to WH claim account",
        "prevents \"double spend\" of `SwimPayload`",
        "can be used to check if `ProcessSwimPayload` has been completed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "propellerMessage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "whMessage",
            "type": "publicKey"
          },
          {
            "name": "claim",
            "type": "publicKey"
          },
          {
            "name": "vaaEmitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "vaaEmitterChain",
            "type": "u16"
          },
          {
            "name": "vaaSequence",
            "type": "u64"
          },
          {
            "name": "transferAmount",
            "type": "u64"
          },
          {
            "name": "swimPayload",
            "type": {
              "defined": "SwimPayload"
            }
          }
        ]
      }
    },
    {
      "name": "propellerSender",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propellerRedeemer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propeller",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "wormhole",
            "type": "publicKey"
          },
          {
            "name": "tokenBridge",
            "type": "publicKey"
          },
          {
            "name": "tokenBridgeMint",
            "type": "publicKey"
          },
          {
            "name": "senderBump",
            "type": "u8"
          },
          {
            "name": "redeemerBump",
            "type": "u8"
          },
          {
            "name": "gasKickstartAmount",
            "type": "u64"
          },
          {
            "name": "propellerFee",
            "docs": [
              "TODO: should this be in swimUSD or native gas?",
              "fee that payer of complete txn will take from transferred amount"
            ],
            "type": "u64"
          },
          {
            "name": "propellerMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "propellerEthMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "marginalPricePool",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenIndex",
            "type": "u8"
          },
          {
            "name": "evmRoutingContractAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "chainMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chainId",
            "type": "u16"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gasKickstartAmount",
            "type": "u64"
          },
          {
            "name": "propellerFee",
            "type": "u64"
          },
          {
            "name": "propellerMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "propellerEthMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "marginalPricePool",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenIndex",
            "type": "u8"
          },
          {
            "name": "marginalPricePoolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "evmRoutingContractAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "AnchorSwimPayloadVAA",
      "docs": [
        "This is \"raw\" VAA directly from guardian network",
        "probably not needed."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guardianSetIndex",
            "type": "u32"
          },
          {
            "name": "signatures",
            "type": {
              "vec": {
                "defined": "AnchorVAASignature"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "emitterChain",
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "sequence",
            "type": "u64"
          },
          {
            "name": "consistencyLevel",
            "type": "u8"
          },
          {
            "name": "payload",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "AnchorVAASignature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signature",
            "type": "bytes"
          },
          {
            "name": "guardianIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CompleteNativeWithPayloadData",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "SwimPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "swimPayloadVersion",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetTokenId",
            "type": "u16"
          },
          {
            "name": "memo",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "propellerEnabled",
            "type": "bool"
          },
          {
            "name": "minThreshold",
            "type": "u64"
          },
          {
            "name": "gasKickstart",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "VerifySignaturesData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signers",
            "docs": [
              "instruction indices of signers (-1 for missing)"
            ],
            "type": {
              "array": [
                "i8",
                19
              ]
            }
          }
        ]
      }
    },
    {
      "name": "TransferData",
      "docs": [
        "* Same as TransferNative & TransferWrapped Data."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetChain",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "TransferWithPayloadData",
      "docs": [
        "* Same as TransferNativeWithPayloadData & TransferWrappedWithPayloadData.\n* this is the data that goes into the Instruction."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetChain",
            "type": "u16"
          },
          {
            "name": "payload",
            "type": "bytes"
          },
          {
            "name": "cpiProgramId",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "PostMessageData",
      "docs": [
        "Data that goes into a [`wormhole::Instruction::PostMessage`]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "docs": [
              "Unique nonce for this message"
            ],
            "type": "u32"
          },
          {
            "name": "payload",
            "docs": [
              "Message payload"
            ],
            "type": "bytes"
          },
          {
            "name": "consistencyLevel",
            "docs": [
              "Commitment Level required for an attestation to be produced"
            ],
            "type": {
              "defined": "ConsistencyLevel"
            }
          }
        ]
      }
    },
    {
      "name": "BridgeData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetIndex",
            "docs": [
              "The current guardian set index, used to decide which signature sets to accept."
            ],
            "type": "u32"
          },
          {
            "name": "lastLamports",
            "docs": [
              "Lamports in the collection account"
            ],
            "type": "u64"
          },
          {
            "name": "config",
            "docs": [
              "Bridge configuration, which is set once upon initialization."
            ],
            "type": {
              "defined": "BridgeConfig"
            }
          }
        ]
      }
    },
    {
      "name": "BridgeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetExpirationTime",
            "docs": [
              "Period for how long a guardian set is valid after it has been replaced by a new one.  This",
              "guarantees that VAAs issued by that set can still be submitted for a certain period.  In",
              "this period we still trust the old guardian set."
            ],
            "type": "u32"
          },
          {
            "name": "fee",
            "docs": [
              "Amount of lamports that needs to be paid to the protocol to post a message"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MessageData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaaVersion",
            "docs": [
              "Header of the posted VAA"
            ],
            "type": "u8"
          },
          {
            "name": "consistencyLevel",
            "docs": [
              "Level of consistency requested by the emitter"
            ],
            "type": "u8"
          },
          {
            "name": "vaaTime",
            "docs": [
              "Time the vaa was submitted"
            ],
            "type": "u32"
          },
          {
            "name": "vaaSignatureAccount",
            "docs": [
              "Account where signatures are stored"
            ],
            "type": "publicKey"
          },
          {
            "name": "submissionTime",
            "docs": [
              "Time the posted message was created"
            ],
            "type": "u32"
          },
          {
            "name": "nonce",
            "docs": [
              "Unique nonce for this message"
            ],
            "type": "u32"
          },
          {
            "name": "sequence",
            "docs": [
              "Sequence number of this message"
            ],
            "type": "u64"
          },
          {
            "name": "emitterChain",
            "docs": [
              "Emitter of the message"
            ],
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "docs": [
              "Emitter of the message"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "payload",
            "docs": [
              "Message payload aka `PayloadTransferWithPayload`"
            ],
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "ClaimData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PostVAAData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guardianSetIndex",
            "type": "u32"
          },
          {
            "name": "timestamp",
            "type": "u32"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "emitterChain",
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "sequence",
            "type": "u64"
          },
          {
            "name": "consistencyLevel",
            "type": "u8"
          },
          {
            "name": "payload",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "PoolInstruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "RemoveExactBurn"
          },
          {
            "name": "SwapExactInput"
          }
        ]
      }
    },
    {
      "name": "SwimPayloadVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V0"
          },
          {
            "name": "V1"
          }
        ]
      }
    },
    {
      "name": "ConsistencyLevel",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Confirmed"
          },
          {
            "name": "Finalized"
          }
        ]
      }
    },
    {
      "name": "Instruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialize"
          },
          {
            "name": "PostMessage"
          },
          {
            "name": "PostVAA"
          },
          {
            "name": "SetFees"
          },
          {
            "name": "TransferFees"
          },
          {
            "name": "UpgradeContract"
          },
          {
            "name": "UpgradeGuardianSet"
          },
          {
            "name": "VerifySignatures"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "InsufficientFunds"
    },
    {
      "code": 6001,
      "name": "InvalidAccount",
      "msg": "InvalidAccount"
    },
    {
      "code": 6002,
      "name": "InvalidRemainingAccounts",
      "msg": "InvalidRemainingAccounts"
    },
    {
      "code": 6003,
      "name": "InvalidTokenBridgeAddress",
      "msg": "InvalidTokenBridgeAddress"
    },
    {
      "code": 6004,
      "name": "InvalidTokenDecimals",
      "msg": "InvalidTokenDecimals"
    },
    {
      "code": 6005,
      "name": "InvalidTokenIndex",
      "msg": "InvalidTokenIndex"
    },
    {
      "code": 6006,
      "name": "InvalidVaaAction",
      "msg": "InvalidVaaAction"
    },
    {
      "code": 6007,
      "name": "InvalidWormholeAddress",
      "msg": "InvalidWormholeAddress"
    },
    {
      "code": 6008,
      "name": "InvalidVaaPayload",
      "msg": "InvalidVaaPayload"
    },
    {
      "code": 6009,
      "name": "NothingToClaim",
      "msg": "NothingToClaim"
    },
    {
      "code": 6010,
      "name": "TransferNotAllowed",
      "msg": "TransferNotAllowed"
    },
    {
      "code": 6011,
      "name": "InvalidCpiReturnProgramId",
      "msg": "Incorrect ProgramId for CPI return value"
    },
    {
      "code": 6012,
      "name": "InvalidCpiReturnValue",
      "msg": "Invalid CPI Return value"
    },
    {
      "code": 6013,
      "name": "InvalidMint",
      "msg": "Invalid Mint"
    },
    {
      "code": 6014,
      "name": "InvalidAddAndWormholeTransferMint",
      "msg": "Invalid Mint for AddAndWormholeTransfer"
    },
    {
      "code": 6015,
      "name": "InvalidSwapExactInputOutputTokenIndex",
      "msg": "Invalid output token index for SwapExactInput params"
    },
    {
      "code": 6016,
      "name": "InvalidSwapExactInputInputAmount",
      "msg": "Invalid input amount for SwapExactInput params"
    },
    {
      "code": 6017,
      "name": "InvalidTokenBridgeMint",
      "msg": "Invalid Token Bridge Mint"
    },
    {
      "code": 6018,
      "name": "InvalidPayloadTypeInVaa",
      "msg": "Invalid Payload Type in VAA"
    },
    {
      "code": 6019,
      "name": "SerializeError",
      "msg": "Serializing error"
    },
    {
      "code": 6020,
      "name": "DeserializeError",
      "msg": "Deserializing error"
    },
    {
      "code": 6021,
      "name": "UserRedeemerSignatureNotDetected",
      "msg": "User redeemer needs to be signer"
    },
    {
      "code": 6022,
      "name": "InvalidSwitchboardAccount",
      "msg": "Not a valid Switchboard account"
    },
    {
      "code": 6023,
      "name": "StaleFeed",
      "msg": "Switchboard feed has not been updated in 5 minutes"
    },
    {
      "code": 6024,
      "name": "ConfidenceIntervalExceeded",
      "msg": "Switchboard feed exceeded provided confidence interval"
    },
    {
      "code": 6025,
      "name": "InsufficientAmount",
      "msg": "Insufficient Amount being transferred"
    },
    {
      "code": 6026,
      "name": "InvalidClaimData",
      "msg": "Invalid claim data"
    },
    {
      "code": 6027,
      "name": "ClaimNotClaimed",
      "msg": "Claim Account not claimed"
    },
    {
      "code": 6028,
      "name": "InvalidPoolTokenIndex",
      "msg": "Invalid Pool Token Index"
    },
    {
      "code": 6029,
      "name": "InvalidSwimPayloadGasKickstart",
      "msg": "Invalid Gas Kickstart parameter in Swim Payload"
    }
  ]
};

export const IDL: Propeller = {
  "version": "0.1.0",
  "name": "propeller",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "propeller",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "propellerSender",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sender"
              }
            ]
          }
        },
        {
          "name": "propellerRedeemer",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "redeemer"
              }
            ]
          }
        },
        {
          "name": "propellerRedeemerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "pool_token_mint_0"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "pool_token_mint_1"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenMint0",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolTokenMint1",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeParams"
          }
        }
      ]
    },
    {
      "name": "createTokenIdMap",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller.token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "pool.lp_mint_key"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "tokenIdMap",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "token_id"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller"
              },
              {
                "kind": "arg",
                "type": "u16",
                "path": "target_token_index"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetTokenIndex",
          "type": "u16"
        },
        {
          "name": "pool",
          "type": "publicKey"
        },
        {
          "name": "poolTokenIndex",
          "type": "u8"
        },
        {
          "name": "poolTokenMint",
          "type": "publicKey"
        },
        {
          "name": "poolIx",
          "type": {
            "defined": "PoolInstruction"
          }
        }
      ]
    },
    {
      "name": "add",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "inputAmounts",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        },
        {
          "name": "minimumMintAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "swapExactInput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactInputAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "swapExactOutput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumInputAmount",
          "type": "u64"
        },
        {
          "name": "exactOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "removeUniform",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactBurnAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmounts",
          "type": {
            "array": [
              "u64",
              2
            ]
          }
        },
        {
          "name": "memo",
          "type": "bytes"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "removeExactBurn",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "exactBurnAmount",
          "type": "u64"
        },
        {
          "name": "minimumOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeExactOutput",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              }
            ]
          }
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "two_pool"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_0.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "pool_token_account_1.mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "lp_mint"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "two_pool_program"
            }
          }
        },
        {
          "name": "poolTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "governanceFee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTransferAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "twoPoolProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumBurnAmount",
          "type": "u64"
        },
        {
          "name": "exactOutputAmount",
          "type": "u64"
        },
        {
          "name": "memo",
          "type": "bytes"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "targetChain",
          "type": "u16"
        }
      ],
      "returns": {
        "vec": "u64"
      }
    },
    {
      "name": "transferNativeWithPayload",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBridgeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "userTokenBridgeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBridgeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBridge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody_signer"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "token_bridge"
            }
          }
        },
        {
          "name": "authoritySigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority_signer"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "path": "token_bridge"
            }
          }
        },
        {
          "name": "wormholeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Bridge"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeMessage",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Note:",
            "switched to using a `Signer`",
            "instead of a PDA since a normal token bridge transfer",
            "uses a Keypair.generate()",
            "",
            "A new one needs to be used for every transfer",
            "",
            "WH expects this to be an uninitialized account so might",
            "be able to use a PDA still in the future.",
            "maybe [b\"propeller\".as_ref(), payer, sequence_value]"
          ]
        },
        {
          "name": "wormholeEmitter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "emitter"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeSequence",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Sequence"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "wormhole_emitter"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "wormholeFeeCollector",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "fee_collector"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Transfers with payload also include the address of the account or contract",
            "that sent the transfer. Semantically this is identical to \"msg.sender\" on",
            "EVM chains, i.e. it is the address of the immediate caller of the token",
            "bridge transaction.",
            "Since on Solana, a transaction can have multiple different signers, getting",
            "this information is not so straightforward.",
            "The strategy we use to figure out the sender of the transaction is to",
            "require an additional signer ([`SenderAccount`]) for the transaction.",
            "If the transaction was sent by a user wallet directly, then this may just be",
            "the wallet's pubkey. If, however, the transaction was initiated by a",
            "program, then we require this to be a PDA derived from the sender program's",
            "id and the string \"sender\". In this case, the sender program must also",
            "attach its program id to the instruction data. If the PDA verification",
            "succeeds (thereby proving that [[`cpi_program_id`]] indeed signed the",
            "transaction), then the program's id is attached to the VAA as the sender,",
            "otherwise the transaction is rejected.",
            "",
            "Note that a program may opt to forego the PDA derivation and instead just",
            "pass on the original wallet as the wallet account (or any other signer, as",
            "long as they don't provide their program_id in the instruction data). The",
            "sender address is provided as a means for protocols to verify on the",
            "receiving end that the message was emitted by a contract they trust, so",
            "foregoing this check is not advised. If the receiving contract needs to know",
            "the sender wallet's address too, then that information can be included in",
            "the additional payload, along with any other data that the protocol needs to",
            "send across. The legitimacy of the attached data can be verified by checking",
            "that the sender contract is a trusted one.",
            "",
            "Also note that attaching the correct PDA as [[`SenderAccount`]] but missing the",
            "[[`cpi_program_id`]] field will result in a successful transaction, but in",
            "that case the PDA's address will directly be encoded into the payload",
            "instead of the sender program's id."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sender"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormhole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "memo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "targetChain",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetTokenId",
          "type": "u16"
        },
        {
          "name": "owner",
          "type": "bytes"
        },
        {
          "name": "gasKickstart",
          "type": "bool"
        },
        {
          "name": "propellerEnabled",
          "type": "bool"
        },
        {
          "name": "memo",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "completeNativeWithPayload",
      "accounts": [
        {
          "name": "propeller",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Propeller",
                "path": "propeller.token_bridge_mint"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenBridgeConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ],
            "programId": {
              "kind": "account",
              "type": "publicKey",
              "account": "Propeller",
              "path": "propeller"
            }
          }
        },
        {
          "name": "message",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "contains the VAA",
            "{",
            "...MessageData:",
            "payload: PayloadTransferWithPayload = {",
            "pub amount: U256,",
            "}",
            "}"
          ]
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "seeds = [",
            "vaa.emitter_address, vaa.emitter_chain, vaa.sequence",
            "],",
            "seeds::program = token_bridge"
          ]
        },
        {
          "name": "endpoint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "owned by redeemer"
          ]
        },
        {
          "name": "redeemer",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "redeemer will be PDA derived from [\"redeemer\"], seeds::program = propeller::id()",
            "will have to be signed when it invokes complete_transfer_with_payload",
            "if complete transfer with payload not meant to be handled by a contract redeemer will be the same as vaa.to",
            "(NOT the `to` account)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "redeemer"
              }
            ]
          }
        },
        {
          "name": "feeRecipient",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "this is \"to_fees\"",
            "TODO: type as TokenAccount?"
          ]
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodySigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wormhole",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBridge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "propellerMessage",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "propeller"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "claim"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "message"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "tokenIdMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "outputTokenIndex",
            "type": "u16"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "poolTokenIndex",
            "type": "u8"
          },
          {
            "name": "poolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "poolIx",
            "type": {
              "defined": "PoolInstruction"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propellerClaim",
      "docs": [
        "Works similarly to WH claim account",
        "prevents \"double spend\" of `SwimPayload`",
        "can be used to check if `ProcessSwimPayload` has been completed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "propellerMessage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "whMessage",
            "type": "publicKey"
          },
          {
            "name": "claim",
            "type": "publicKey"
          },
          {
            "name": "vaaEmitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "vaaEmitterChain",
            "type": "u16"
          },
          {
            "name": "vaaSequence",
            "type": "u64"
          },
          {
            "name": "transferAmount",
            "type": "u64"
          },
          {
            "name": "swimPayload",
            "type": {
              "defined": "SwimPayload"
            }
          }
        ]
      }
    },
    {
      "name": "propellerSender",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propellerRedeemer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "propeller",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "wormhole",
            "type": "publicKey"
          },
          {
            "name": "tokenBridge",
            "type": "publicKey"
          },
          {
            "name": "tokenBridgeMint",
            "type": "publicKey"
          },
          {
            "name": "senderBump",
            "type": "u8"
          },
          {
            "name": "redeemerBump",
            "type": "u8"
          },
          {
            "name": "gasKickstartAmount",
            "type": "u64"
          },
          {
            "name": "propellerFee",
            "docs": [
              "TODO: should this be in swimUSD or native gas?",
              "fee that payer of complete txn will take from transferred amount"
            ],
            "type": "u64"
          },
          {
            "name": "propellerMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "propellerEthMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "marginalPricePool",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenIndex",
            "type": "u8"
          },
          {
            "name": "evmRoutingContractAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "chainMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chainId",
            "type": "u16"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gasKickstartAmount",
            "type": "u64"
          },
          {
            "name": "propellerFee",
            "type": "u64"
          },
          {
            "name": "propellerMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "propellerEthMinTransferAmount",
            "type": "u64"
          },
          {
            "name": "marginalPricePool",
            "type": "publicKey"
          },
          {
            "name": "marginalPricePoolTokenIndex",
            "type": "u8"
          },
          {
            "name": "marginalPricePoolTokenMint",
            "type": "publicKey"
          },
          {
            "name": "evmRoutingContractAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "AnchorSwimPayloadVAA",
      "docs": [
        "This is \"raw\" VAA directly from guardian network",
        "probably not needed."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guardianSetIndex",
            "type": "u32"
          },
          {
            "name": "signatures",
            "type": {
              "vec": {
                "defined": "AnchorVAASignature"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "emitterChain",
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "sequence",
            "type": "u64"
          },
          {
            "name": "consistencyLevel",
            "type": "u8"
          },
          {
            "name": "payload",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "AnchorVAASignature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signature",
            "type": "bytes"
          },
          {
            "name": "guardianIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CompleteNativeWithPayloadData",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "SwimPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "swimPayloadVersion",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetTokenId",
            "type": "u16"
          },
          {
            "name": "memo",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "propellerEnabled",
            "type": "bool"
          },
          {
            "name": "minThreshold",
            "type": "u64"
          },
          {
            "name": "gasKickstart",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "VerifySignaturesData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signers",
            "docs": [
              "instruction indices of signers (-1 for missing)"
            ],
            "type": {
              "array": [
                "i8",
                19
              ]
            }
          }
        ]
      }
    },
    {
      "name": "TransferData",
      "docs": [
        "* Same as TransferNative & TransferWrapped Data."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetChain",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "TransferWithPayloadData",
      "docs": [
        "* Same as TransferNativeWithPayloadData & TransferWrappedWithPayloadData.\n* this is the data that goes into the Instruction."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "targetAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "targetChain",
            "type": "u16"
          },
          {
            "name": "payload",
            "type": "bytes"
          },
          {
            "name": "cpiProgramId",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "PostMessageData",
      "docs": [
        "Data that goes into a [`wormhole::Instruction::PostMessage`]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "docs": [
              "Unique nonce for this message"
            ],
            "type": "u32"
          },
          {
            "name": "payload",
            "docs": [
              "Message payload"
            ],
            "type": "bytes"
          },
          {
            "name": "consistencyLevel",
            "docs": [
              "Commitment Level required for an attestation to be produced"
            ],
            "type": {
              "defined": "ConsistencyLevel"
            }
          }
        ]
      }
    },
    {
      "name": "BridgeData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetIndex",
            "docs": [
              "The current guardian set index, used to decide which signature sets to accept."
            ],
            "type": "u32"
          },
          {
            "name": "lastLamports",
            "docs": [
              "Lamports in the collection account"
            ],
            "type": "u64"
          },
          {
            "name": "config",
            "docs": [
              "Bridge configuration, which is set once upon initialization."
            ],
            "type": {
              "defined": "BridgeConfig"
            }
          }
        ]
      }
    },
    {
      "name": "BridgeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardianSetExpirationTime",
            "docs": [
              "Period for how long a guardian set is valid after it has been replaced by a new one.  This",
              "guarantees that VAAs issued by that set can still be submitted for a certain period.  In",
              "this period we still trust the old guardian set."
            ],
            "type": "u32"
          },
          {
            "name": "fee",
            "docs": [
              "Amount of lamports that needs to be paid to the protocol to post a message"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MessageData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaaVersion",
            "docs": [
              "Header of the posted VAA"
            ],
            "type": "u8"
          },
          {
            "name": "consistencyLevel",
            "docs": [
              "Level of consistency requested by the emitter"
            ],
            "type": "u8"
          },
          {
            "name": "vaaTime",
            "docs": [
              "Time the vaa was submitted"
            ],
            "type": "u32"
          },
          {
            "name": "vaaSignatureAccount",
            "docs": [
              "Account where signatures are stored"
            ],
            "type": "publicKey"
          },
          {
            "name": "submissionTime",
            "docs": [
              "Time the posted message was created"
            ],
            "type": "u32"
          },
          {
            "name": "nonce",
            "docs": [
              "Unique nonce for this message"
            ],
            "type": "u32"
          },
          {
            "name": "sequence",
            "docs": [
              "Sequence number of this message"
            ],
            "type": "u64"
          },
          {
            "name": "emitterChain",
            "docs": [
              "Emitter of the message"
            ],
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "docs": [
              "Emitter of the message"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "payload",
            "docs": [
              "Message payload aka `PayloadTransferWithPayload`"
            ],
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "ClaimData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PostVAAData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guardianSetIndex",
            "type": "u32"
          },
          {
            "name": "timestamp",
            "type": "u32"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "emitterChain",
            "type": "u16"
          },
          {
            "name": "emitterAddress",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "sequence",
            "type": "u64"
          },
          {
            "name": "consistencyLevel",
            "type": "u8"
          },
          {
            "name": "payload",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "PoolInstruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "RemoveExactBurn"
          },
          {
            "name": "SwapExactInput"
          }
        ]
      }
    },
    {
      "name": "SwimPayloadVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V0"
          },
          {
            "name": "V1"
          }
        ]
      }
    },
    {
      "name": "ConsistencyLevel",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Confirmed"
          },
          {
            "name": "Finalized"
          }
        ]
      }
    },
    {
      "name": "Instruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialize"
          },
          {
            "name": "PostMessage"
          },
          {
            "name": "PostVAA"
          },
          {
            "name": "SetFees"
          },
          {
            "name": "TransferFees"
          },
          {
            "name": "UpgradeContract"
          },
          {
            "name": "UpgradeGuardianSet"
          },
          {
            "name": "VerifySignatures"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "InsufficientFunds"
    },
    {
      "code": 6001,
      "name": "InvalidAccount",
      "msg": "InvalidAccount"
    },
    {
      "code": 6002,
      "name": "InvalidRemainingAccounts",
      "msg": "InvalidRemainingAccounts"
    },
    {
      "code": 6003,
      "name": "InvalidTokenBridgeAddress",
      "msg": "InvalidTokenBridgeAddress"
    },
    {
      "code": 6004,
      "name": "InvalidTokenDecimals",
      "msg": "InvalidTokenDecimals"
    },
    {
      "code": 6005,
      "name": "InvalidTokenIndex",
      "msg": "InvalidTokenIndex"
    },
    {
      "code": 6006,
      "name": "InvalidVaaAction",
      "msg": "InvalidVaaAction"
    },
    {
      "code": 6007,
      "name": "InvalidWormholeAddress",
      "msg": "InvalidWormholeAddress"
    },
    {
      "code": 6008,
      "name": "InvalidVaaPayload",
      "msg": "InvalidVaaPayload"
    },
    {
      "code": 6009,
      "name": "NothingToClaim",
      "msg": "NothingToClaim"
    },
    {
      "code": 6010,
      "name": "TransferNotAllowed",
      "msg": "TransferNotAllowed"
    },
    {
      "code": 6011,
      "name": "InvalidCpiReturnProgramId",
      "msg": "Incorrect ProgramId for CPI return value"
    },
    {
      "code": 6012,
      "name": "InvalidCpiReturnValue",
      "msg": "Invalid CPI Return value"
    },
    {
      "code": 6013,
      "name": "InvalidMint",
      "msg": "Invalid Mint"
    },
    {
      "code": 6014,
      "name": "InvalidAddAndWormholeTransferMint",
      "msg": "Invalid Mint for AddAndWormholeTransfer"
    },
    {
      "code": 6015,
      "name": "InvalidSwapExactInputOutputTokenIndex",
      "msg": "Invalid output token index for SwapExactInput params"
    },
    {
      "code": 6016,
      "name": "InvalidSwapExactInputInputAmount",
      "msg": "Invalid input amount for SwapExactInput params"
    },
    {
      "code": 6017,
      "name": "InvalidTokenBridgeMint",
      "msg": "Invalid Token Bridge Mint"
    },
    {
      "code": 6018,
      "name": "InvalidPayloadTypeInVaa",
      "msg": "Invalid Payload Type in VAA"
    },
    {
      "code": 6019,
      "name": "SerializeError",
      "msg": "Serializing error"
    },
    {
      "code": 6020,
      "name": "DeserializeError",
      "msg": "Deserializing error"
    },
    {
      "code": 6021,
      "name": "UserRedeemerSignatureNotDetected",
      "msg": "User redeemer needs to be signer"
    },
    {
      "code": 6022,
      "name": "InvalidSwitchboardAccount",
      "msg": "Not a valid Switchboard account"
    },
    {
      "code": 6023,
      "name": "StaleFeed",
      "msg": "Switchboard feed has not been updated in 5 minutes"
    },
    {
      "code": 6024,
      "name": "ConfidenceIntervalExceeded",
      "msg": "Switchboard feed exceeded provided confidence interval"
    },
    {
      "code": 6025,
      "name": "InsufficientAmount",
      "msg": "Insufficient Amount being transferred"
    },
    {
      "code": 6026,
      "name": "InvalidClaimData",
      "msg": "Invalid claim data"
    },
    {
      "code": 6027,
      "name": "ClaimNotClaimed",
      "msg": "Claim Account not claimed"
    },
    {
      "code": 6028,
      "name": "InvalidPoolTokenIndex",
      "msg": "Invalid Pool Token Index"
    },
    {
      "code": 6029,
      "name": "InvalidSwimPayloadGasKickstart",
      "msg": "Invalid Gas Kickstart parameter in Swim Payload"
    }
  ]
};
