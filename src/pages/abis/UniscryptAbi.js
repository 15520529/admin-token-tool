export const UNICRYPT_ABI_V3 = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_presaleGenerator",
                "type": "address"
            },
            {
                "internalType": "contractIPresaleSettings",
                "name": "_presaleSettings",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_weth",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "BUYERS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "baseDeposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokensOwed",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "unclOwed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CONTRACT_VERSION",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_FEE_INFO",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "UNICRYPT_BASE_FEE",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "UNICRYPT_TOKEN_FEE",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "REFERRAL_FEE",
                "type": "uint256"
            },
            {
                "internalType": "addresspayable",
                "name": "REFERRAL_FEE_ADDRESS",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_GENERATOR",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_INFO",
        "outputs": [
            {
                "internalType": "contractIERC20",
                "name": "S_TOKEN",
                "type": "address"
            },
            {
                "internalType": "contractIERC20",
                "name": "B_TOKEN",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "TOKEN_PRICE",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "MAX_SPEND_PER_BUYER",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "AMOUNT",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "HARDCAP",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "SOFTCAP",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "LIQUIDITY_PERCENT",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "LISTING_RATE",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "START_BLOCK",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "END_BLOCK",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "LOCK_PERIOD",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_INFO_2",
        "outputs": [
            {
                "internalType": "addresspayable",
                "name": "PRESALE_OWNER",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "PRESALE_IN_ETH",
                "type": "bool"
            },
            {
                "internalType": "uint16",
                "name": "COUNTRY_CODE",
                "type": "uint16"
            },
            {
                "internalType": "uint128",
                "name": "UNCL_MAX_PARTICIPANTS",
                "type": "uint128"
            },
            {
                "internalType": "uint128",
                "name": "UNCL_PARTICIPANTS",
                "type": "uint128"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_LOCK_FORWARDER",
        "outputs": [
            {
                "internalType": "contractIPresaleLockForwarder",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRESALE_SETTINGS",
        "outputs": [
            {
                "internalType": "contractIPresaleSettings",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "RANDOM_NUMBER_X82",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "STATUS",
        "outputs": [
            {
                "internalType": "bool",
                "name": "WHITELIST_ONLY",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "LP_GENERATION_COMPLETE",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "FORCE_FAILED",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "TOTAL_BASE_COLLECTED",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "TOTAL_TOKENS_SOLD",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "TOTAL_TOKENS_WITHDRAWN",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "TOTAL_BASE_WITHDRAWN",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ROUND1_LENGTH",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "NUM_BUYERS",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "UNCL_AMOUNT_OVERRIDE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "UNI_FACTORY",
        "outputs": [
            {
                "internalType": "contractIUniswapV2Factory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WETH",
        "outputs": [
            {
                "internalType": "contractIWETH",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "addLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_users",
                "type": "address[]"
            },
            {
                "internalType": "bool",
                "name": "_add",
                "type": "bool"
            }
        ],
        "name": "editWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forceFailByPresaleOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forceFailByUnicrypt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forceFailIfPairExists",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getInfo",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            },
            {
                "components": [
                    {
                        "internalType": "contractIERC20",
                        "name": "S_TOKEN",
                        "type": "address"
                    },
                    {
                        "internalType": "contractIERC20",
                        "name": "B_TOKEN",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "TOKEN_PRICE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "MAX_SPEND_PER_BUYER",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "AMOUNT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "HARDCAP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "SOFTCAP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "LIQUIDITY_PERCENT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "LISTING_RATE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "START_BLOCK",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "END_BLOCK",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "LOCK_PERIOD",
                        "type": "uint256"
                    }
                ],
                "internalType": "structPresale01.PresaleInfo",
                "name": "",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "addresspayable",
                        "name": "PRESALE_OWNER",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "PRESALE_IN_ETH",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint16",
                        "name": "COUNTRY_CODE",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint128",
                        "name": "UNCL_MAX_PARTICIPANTS",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint128",
                        "name": "UNCL_PARTICIPANTS",
                        "type": "uint128"
                    }
                ],
                "internalType": "structPresale01.PresaleInfo2",
                "name": "",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "UNICRYPT_BASE_FEE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "UNICRYPT_TOKEN_FEE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "REFERRAL_FEE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "addresspayable",
                        "name": "REFERRAL_FEE_ADDRESS",
                        "type": "address"
                    }
                ],
                "internalType": "structPresale01.PresaleFeeInfo",
                "name": "",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "WHITELIST_ONLY",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "LP_GENERATION_COMPLETE",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "FORCE_FAILED",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "TOTAL_BASE_COLLECTED",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "TOTAL_TOKENS_SOLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "TOTAL_TOKENS_WITHDRAWN",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "TOTAL_BASE_WITHDRAWN",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "ROUND1_LENGTH",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "NUM_BUYERS",
                        "type": "uint256"
                    }
                ],
                "internalType": "structPresale01.PresaleStatus",
                "name": "",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUNCLOverride",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserWhitelistStatus",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getWhitelistedUserAtIndex",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWhitelistedUsersLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "addresspayable",
                "name": "_presaleOwner",
                "type": "address"
            },
            {
                "internalType": "uint16",
                "name": "_countryCode",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_tokenPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxEthPerBuyer",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_hardcap",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_softcap",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_liquidityPercent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_listingRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_startblock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endblock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lockPeriod",
                "type": "uint256"
            }
        ],
        "name": "init1",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contractIERC20",
                "name": "_baseToken",
                "type": "address"
            },
            {
                "internalType": "contractIERC20",
                "name": "_presaleToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_unicryptBaseFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_unicryptTokenFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_referralFee",
                "type": "uint256"
            },
            {
                "internalType": "addresspayable",
                "name": "_referralAddress",
                "type": "address"
            }
        ],
        "name": "init2",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ownerWithdrawTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "presaleStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reserveAllocationWithUNCL",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "setUNCLAmount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endBlock",
                "type": "uint256"
            }
        ],
        "name": "updateBlocks",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "userDeposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "userWithdrawBaseTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "userWithdrawTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]