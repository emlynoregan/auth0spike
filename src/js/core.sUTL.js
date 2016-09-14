var gcoreDist = 
[
  {
    "name": "map_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "map-t": "^@.t",
      "t": {
        "'": [
          "&&",
          "^@.accum",
          [
            {
              "!": "^@.map-t"
            }
          ]
        ]
      },
      "accum": []
    }
  },
  {
    "name": "reverse_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "if",
      "cond": "^@.list",
      "true": {
        "'": [
          "&&",
          {
            "!": "^*.reverse_core_emlynoregan_com",
            "list": ["&tail", "^@.list"]
          },
          ["&head", "^@.list"]
        ]
      },
      "false": {
        "'": []
      }
    },
    "requires": [
      "reverse_core_emlynoregan_com"
    ]
  },
  {
    "name": "head_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": ["&head", "^@.list"]
  },
  {
    "name": "tail_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": ["&tail", "^@.list"]
  },
  {
    "name": "removenulls_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "accum": [],
      "t": {
        "'": {
          "&": "if",
          "cond": {"'": ["&!=", "^@.item", null]},
          "true": {"'": [
            "&&",
            "^@.accum",
            "^@.item"
          ]},
          "false": {"'": "^@.accum"}
        }
      }
    }
  },
  {
    "name": "count_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "if",
      "cond": {"'": {
          "&": "=",
          "a": "list",
          "b": {
            "&": "type",
            "value": "^@.obj"
          }
      }},
      "true": {
        "'": {
          "&": "reduce",
          "list": "^@.obj",
          "accum": 0,
          "t": {
            "'": {
              "&": "+",
              "a": {
                "!": "^*.count_core_emlynoregan_com",
                "obj": "^@.item"
              },
              "b": "^@.accum"
            }
          }
        }
      },
      "false": 1
    },
    "requires": [
      "count_core_emlynoregan_com"
    ]
  },
  {
    "name": "addmaps_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "makemap",
      "value": {
        "!": "^*.zip_core_emlynoregan_com",
        "list": [
          [
            "&&",
            {
              "&": "keys",
              "map": "^@.map1"
            },
            {
              "&": "keys",
              "map": "^@.map2"
            }
          ],
          [
            "&&",
            {
              "&": "values",
              "map": "^@.map1"
            },
            {
              "&": "values",
              "map": "^@.map2"
            }
          ]
        ]
      }
    },
    "requires": [
      "zip_core_emlynoregan_com"
    ]
  },
  {
    "name": "mapget_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": ["^@", "map", ["^@", "key"]]
  },
  {
    "name": "keys2map_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "makemap",
      "value": {
        "!": "^*.map_core_emlynoregan_com",
        "list": "^@.list",
        "t": {
          "'": [
              "^@.item",
              true
          ]
        }
      }
    },
    "requires": [
      "map_core_emlynoregan_com"
    ]
  },
  {
    "name": "filter_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "accum": [],
      "t": {
        "'": [
          "&&",
          "^@.accum",
          {
            "&": "if",
            "cond": {
              "'": {
                "''": "^@.filter-t"
              }
            },
            "true": [
              "^@.item"
            ],
            "false": []
          }
        ]
      }
    }
  },
  {
    "name": "tests_tst_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.removenulls_core_emlynoregan_com",
      "list": {
        "!": "^*.map_core_emlynoregan_com",
        "list": "^@.tests",
        "t": {
          "'": {
            "!": "^*.test_tst_emlynoregan_com",
            "test-t": "^@.item.test-t",
            "name": "^@.item.name"
          }
        }
      }
    },
    "requires": [
      "map_core_emlynoregan_com",
      "test_tst_emlynoregan_com",
      "removenulls_core_emlynoregan_com"
    ]
  },
  {
    "name": "test_tst_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "if",
      "cond": "^@.test-t",
      "true": null,
      "false": "^@.name"
    }
  },
  {
    "name": "asserttrue_tst_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "if",
      "cond": {
        "'": {
          "&": "=",
          "a": "^@.test-t",
          "b": true
        }
      },
      "true": null,
      "false": "fails"
    }
  },
  {
    "name": "isinlist_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.hasitems_core_emlynoregan_com",
      "list": {
        "!": "^*.filter_core_emlynoregan_com",
        "list": "^@.list",
        "filter-t": {
          "'": {
            "&": "=",
            "a": "^@.item",
            "b": {
              "''": "^@.item"
            }
          }
        }
      }
    },
    "requires": [
      "hasitems_core_emlynoregan_com",
      "filter_core_emlynoregan_com"
    ]
  },
  {
    "name": "removekeys_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "makemap",
      "value": {
        "!": "^*.zip_core_emlynoregan_com",
        "list": [
          {
            "!": "^*.subtractarrs_core_emlynoregan_com",
            "arr1": {
              "&": "keys",
              "map": "^@.map"
            },
            "arr2": "^@.keys"
          },
          {
            "!": "^*.map_core_emlynoregan_com",
            "list": {
              "!": "^*.subtractarrs_core_emlynoregan_com",
              "arr1": {
                "&": "keys",
                "map": "^@.map"
              },
              "arr2": "^@.keys"
            },
            "t": {
              "'": {
                "!": "^*.mapget_core_emlynoregan_com",
                "map": {
                  ":": {
                    "''": "^@.map"
                  }
                },
                "key": "^@.item"
              }
            }
          }
        ]
      }
    },
    "requires": [
      "zip_core_emlynoregan_com",
      "map_core_emlynoregan_com",
      "mapget_core_emlynoregan_com",
      "subtractarrs_core_emlynoregan_com"
    ]
  },
  {
    "name": "subtractarrs_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.filter_core_emlynoregan_com",
      "list": "^@.arr1",
      "filter-t": {
        "'": {
          "&": "!",
          "b": {
            "!": "^*.isinlist_core_emlynoregan_com",
            "list": {
              "''": "^@.arr2"
            },
            "item": "^@.item"
          }
        }
      }
    },
    "requires": [
      "isinlist_core_emlynoregan_com",
      "filter_core_emlynoregan_com"
    ]
  },
  {
    "name": "pipeline_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list-t",
      "t": {
        "'": {
          "!": "^@.item",
          "p": "^@.accum"
        }
      }
    },
    "requires": [
      "reduce_core_emlynoregan_com"
    ]
  },
  {
    "name": "hasitems_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "if",
      "cond": {
        "'": {
          "&": "=",
          "a": "list",
          "b": {
            "&": "type",
            "value": "^@.list"
          }
        }
      },
      "true": {
        "'": {
          "&": "if",
          "cond": {
            "'": {
              "&": ">",
              "a": {
                "&": "len",
                "list": "^@.list"
              },
              "b": 0
            }
          },
          "true": {
            "'": {
              "&": "if",
              "cond": {
                "'": {
                  "!": "^*.hasitems_core_emlynoregan_com",
                  "list": {
                    "''": {"&": "head", "b": "^@.list"}
                  }
                }
              },
              "true": true,
              "false": {
                "'": {
                  "!": "^*.hasitems_core_emlynoregan_com",
                  "list": {
                    "''": {"&": "tail", "b": "^@.list"}
                  }
                }
              }
            }
          },
          "false": false
        }
      },
      "false": {
        "&": "!=",
        "a": "^@.list",
        "b": null
      }
    },
    "requires": [
      "hasitems_core_emlynoregan_com"
    ]
  },
  {
    "name": "zip_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "accum": [],
      "t": {
        "'": {
          "!": "^*.foldone_core_emlynoregan_com",
          "lists": "^@.accum",
          "list": "^@.item"
        }
      }
    },
    "requires": [
      "foldone_core_emlynoregan_com"
    ]
  },
  {
    "name": "foldone_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.head_core_emlynoregan_com",
      "list": {
        "&": "reduce",
        "accum": [
          [],
          "^@.lists"
        ],
        "list": "^@.list",
        "t": {
          "'": [
            [
              "&&",
              "^@.accum.0",
              [
                [
                  "&&",
                  {
                    "&": "if",
                    "cond": {
                      "'": {
                        "&": "len",
                        "list": "^@.accum.1"
                      }
                    },
                    "true": {
                      "!": "^*.head_core_emlynoregan_com",
                      "list": "^@.accum.1"
                    },
                    "false": []
                  },
                  [
                    "^@.item"
                  ]
                ]
              ]
            ],
            {
              "!": "^*.tail_core_emlynoregan_com",
              "list": "^@.accum.1"
            }
          ]
        }
      }
    },
    "requires": [
      "head_core_emlynoregan_com",
      "tail_core_emlynoregan_com"
    ]
  },
  {
    "name": "splitmap_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.map_core_emlynoregan_com",
      "list": {
        "&": "keys",
        "map": "^@.map"
      },
      "t": {
        "'": {
          "&": "makemap",
          "value": [
            [
              "^@.item",
              {
                "!": "^*.mapget_core_emlynoregan_com",
                "map": {
                  "''": "^@.map"
                },
                "key": "^@.item"
              }
            ]
          ]
        }
      }
    },
    "requires": [
      "map_core_emlynoregan_com",
      "mapget_core_emlynoregan_com"
    ]
  },
  {
    "name": "removenovaluemaps_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "!": "^*.filter_core_emlynoregan_com",
      "list": {
        "!": "^*.splitmap_core_emlynoregan_com",
        "map": "^@.map"
      },
      "filter-t": {
        "'": {
          "&": "!=",
          "a": {
            "!": "^*.head_core_emlynoregan_com",
            "list": {
              "&": "values",
              "map": "^@.item"
            }
          },
          "b": null
        }
      }
    },
    "requires": [
      "filter_core_emlynoregan_com",
      "splitmap_core_emlynoregan_com",
      "head_core_emlynoregan_com"
    ]
  },
  {
    "name": "removenullattribs_core_emlynoregan_com",
    "language": "sUTL0",
    "transform-t": {
      "&": "reduce",
      "accum": {},
      "list": {
        "!": "^*.removenovaluemaps_core_emlynoregan_com",
        "map": "^@.map"
      },
      "t": {
        "'": {
          "!": "^*.addmaps_core_emlynoregan_com",
          "map1": "^@.accum",
          "map2": "^@.item"
        }
      }
    },
    "requires": [
      "removenovaluemaps_core_emlynoregan_com",
      "reduce_core_emlynoregan_com",
      "addmaps_core_emlynoregan_com"
    ]
  },
  {
    "language": "sUTL0",
    "name": "removedupstrarr_core_emlynoregan_com",
    "transform-t": {
      "&": "keys",
      "map": {
        "&": "makemap",
        "value": {
          "!": "^*.zip_core_emlynoregan_com",
          "list": [
            "^@.list",
            "^@.list"
          ]
        }
      }
    },
    "requires": [
      "zip_core_emlynoregan_com"
    ]
  },
  {
    "language": "sUTL0",
    "name": "quicksort_core_emlynoregan_com",
    "transform-t": {
      "&": "if",
      "cond": {"'": "^@.list"},
      "true": {"'": [
        "&&",
        {
          "!": "^*.quicksort_core_emlynoregan_com",
          "list": {
            "!": "^*.qsfilter_core_emlynoregan_com",
            "list": "^@.list",
            "left": true,
            "sortkey": "^@.sortkey"
          }        
        },
        [{"&": "head", "b": "^@.list"}],
        {
          "!": "^*.quicksort_core_emlynoregan_com",
          "list": {
            "!": "^*.qsfilter_core_emlynoregan_com",
            "list": "^@.list",
            "left": false,
            "sortkey": "^@.sortkey"
          }        
        }
      ]
      },
      "false": []
    },
    "requires": [
      "quicksort_core_emlynoregan_com", "qsfilter_core_emlynoregan_com"
    ]
  },
  {
    "language": "sUTL0",
    "name": "qsfilter_core_emlynoregan_com",
    "transform-t": {
      "!": "^*.filter_core_emlynoregan_com",
      "list": {"&": "tail", "b": "^@.list"},
      "head": {"&": "head", "b": "^@.list"},
      "filter-t": {"'":
        {"!":  
          [
            {
              "&": "if",
              "cond": {"'": "^@.left"},
              "true": {"'": {"'": "&<"}},
              "false": {"'": {"'": "&>="}}
            },
            {"!": [
              "&&",
              {"'": "^%"},
              ["^@.item"],
              "^@.keypath"
            ]},
            {"!": [
              "&&",
              {"'": "^%"},
              ["^@.head"],
              "^@.keypath"
            ]}
          ]
        }
      }
    },
    "requires": [
      "filter_core_emlynoregan_com"
    ]
  },
  {
    "name": "idlisttomap_core_emlynoregan_com",
    "transform-t":  {
        "&": "makemap",
        "value":
        {
          "!": "^*.map_core_emlynoregan_com",
          "list": "^@.list",
          "t": {"'": 
            [
              {"!": [
                "&&",
                {"'": "^%"},
                ["^@.item"],
                "^@.keypath"
              ]},
              "^@.item"
            ]
          }
        }
    },
    "requires": ["map_core_emlynoregan_com"]
  },
  {
    "name": "join_core_emlynoregan_com",
    "transform-t": [
      "^%",
      {
        "!": {"'": {
          "&": "if",
          "cond": {"'": "^@.list"},
          "false": null,
          "true": {"'": {
            "&": "reduce",
            "list": "^@.list",
            "accum": {
              "index": 0, 
              "result": ""
            },
            "t": {"'": {
              "&": "if",
              "cond": {"'":
                [
                  "&=",
                  "^@.accum.index",
                  0
                ]
              },
              "true": {"'":{
                "index": 1,
                "result": "^@.item"
              }},
              "false": {"'": {
                "&": "if",
                "cond": {"'": 
                  [
                    "&=",
                    "^@.listlen",
                    ["&+", "^@.accum.index", 1]
                  ]
                },
                "true": {"'": {
                  "index": ["&+", "^@.accum.index", 1],
                  "result": ["&+", "^@.accum.result", "^@.lastseparator", "^@.item"]
                }},
                "false": {"'": {
                  "index": ["&+", "^@.accum.index", 1],
                  "result": ["&+", "^@.accum.result", "^@.separator", "^@.item"]
                }}
              }}
            }}
          }}
        }},
        "separator": {
          "&": "if",
          "cond": {"'": "^@.separator"},
          "true": {"'": "^@.separator"},
          "false": ", "
        },
        "lastseparator": {
          "&": "if",
          "cond": {"'": "^@.lastseparator"},
          "true": {"'": "^@.lastseparator"},
          "false": {"'": {
            "&": "if",
            "cond": {"'": "^@.separator"},
            "true": {"'": "^@.separator"},
            "false": " and "
          }}
        },
        "listlen": {
          "&": "len",
          "list": "^@.list"
        }
      },
      "result"
    ]
  },
  {
    "name": "slice_core_emlynoregan_com",
    "transform-t": 
    {
      "!": {"'": {
        "!": {"'": 
        [
          "^%",
          {
            "&": "reduce",
            "list": "^@.list",
            "accum": {
              "index": 0,
              "result": []
            },
            "t": {"'": {
              "&": "if",
              "cond": {"'": 
                [
                  "&&&",
                  [
                    "&>=",
                    "^@.accum.index",
                    "^@.start"
                  ],
                  [
                    "&<",
                    "^@.accum.index",
                    "^@.stop"
                  ]
                ]
              },
              "true": {"'": {
                "index": ["&+", "^@.accum.index", 1],
                "result": [
                  "&&",
                  "^@.accum.result",
                  "^@.item"
                ]
              }},
              "false": {"'": {
                "index": ["&+", "^@.accum.index", 1],
                "result": "^@.accum.result"
              }}
            }}
          },
          "result"
        ]},
        "start": {
          "!": "^@.fixarg",
          "arg": "^@.start",
          "defaultarg": 0
        },
        "stop": {
          "!": "^@.fixarg",
          "arg": "^@.stop",
          "defaultarg": {
            "&": "len",
            "list": "^@.list"
          }
        }
      }},
      "fixarg": {"'": {
        "&": "if",
        "cond": {"'": "^@.arg"},
        "true": {"'": {
          "&": "if",
          "cond": {"'": ["&<", "^@.arg", 0]},
          "true": {"'":
            [
              "&+", 
              {
                "&": "len",
                "list": "^@.list"
              },
              "^@.arg"
            ]
          },
          "false": {"'": "^@.arg"}
        }},
        "false": "^@.defaultarg"
      }}
    }
  },
  {
    "language": "sUTL0",
    "name": "coalesce_core_emlynoregan_com",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "accum": null,
      "t": {"'": {
        "&": "if",
        "cond": {"'": [
          "&!=",
          "^@.accum",
          null
        ]},
        "true": {"'": "^@.accum"},
        "false": {"'": "^@.item"}
      }}
    }
  },
  {
    "name": "switch_core_emlynoregan_com",
    "transform-t": 
    [
      "^%",
      {
        "&": "reduce",
        "list": "^@.cases",
        "accum": {
          "found": false,
          "result": null
        },
        "t": {"'": {
          "&": "if",
          "cond": {"'": "^@.accum.found"},
          "true": {"'": "^@.accum"},
          "false": {"'": {
            "&": "if",
            "cond": {"'": 
              [
                "&&&",
                [
                  "&=",
                  {
                    "&": "type",
                    "value": "^@.item"
                  },
                  "list"
                ],
                [
                  "&=",
                  {
                    "&": "len",
                    "list": "^@.item"
                  },
                  2
                ]
              ]
            },
            "true": {"'": {
              "&": "if",
              "cond": {"'": 
                [
                  "&=",
                  {
                    "&": "type",
                    "value": "^@.item.0"
                  },
                  "list"
                ]
              },
              "true": {"'": {
                "&": "if",
                "cond": {"'": {
                  "!": "^*.isinlist",
                  "list": "^@.item.0",
                  "item": "^@.value"
                }},
                "true": {"'": {
                  "found": true,
                  "result": "^@.item.1"
                }},
                "false": {"'": "^@.accum"}
              }},
              "false": {"'": {
                "&": "if",
                "cond": {"'": 
                  [
                    "&=",
                    "^@.item.0",
                    "^@.value"
                  ]
                },
                "true": {"'": {
                  "found": true,
                  "result": "^@.item.1"
                }},
                "false": {"'": "^@.accum"}
              }}
            }},
            "false": {"'": {
              "found": true,
              "result": "^@.item"
            }}
          }}
        }}
      },
      "result"
    ],
    "requires": ["isinlist"]
  },
  {
    "name": "when_core_emlynoregan_com",
    "transform-t": 
    [
      "^%",
      {
        "&": "reduce",
        "list": "^@.cases",
        "accum": {
          "found": false,
          "result": null
        },
        "t": {"'": {
          "&": "if",
          "cond": {"'": "^@.accum.found"},
          "true": {"'": "^@.accum"},
          "false": {"'": {
            "&": "if",
            "cond": {"'": 
              [
                "&&&",
                [
                  "&=",
                  {
                    "&": "type",
                    "value": "^@.item"
                  },
                  "list"
                ],
                [
                  "&=",
                  {
                    "&": "len",
                    "list": "^@.item"
                  },
                  2
                ]
              ]
            },
            "true": {"'": {
              "&": "if",
              "cond": {"'": {"!": {"!": "^@.item.0"}}},  
              "true": {"'": {
                "found": true,
                "result": {"!": "^@.item.1"}
              }},
              "false": {"'": "^@.accum"}
            }},
            "false": {"'": {
              "found": true,
              "result": {"!": "^@.item"} 
            }}
          }}
        }}
      },
      "result"
    ]
  },
  {
    "name": "isdict_core_emlynoregan_com",
    "transform-t": [
      "&=",
      {
        "&": "type",
        "value": "^@.item"
      },
      "map" 
    ]
  },
  {
    "name": "islist_core_emlynoregan_com",
    "transform-t": [
      "&=",
      {
        "&": "type",
        "value": "^@.item"
      },
      "list" 
    ]
  },
  {
    "name": "issimple_core_emlynoregan_com",
    "transform-t": [
      "&!",
      [
        "&||",
        {
          "&": "isdict_core"
        },
        {
          "&": "islist_core"
        }
      ]
    ],
    "requires": ["isdict_core", "islist_core"]
  },
  {
    "name": "newdiff_core_emlynoregan_com",
    "transform-t": {
      "!": {":": {
        "!": {":": {
          "&": "if",
          "cond": {":": {"!": "^@.keepvalue"}},
          "true": {":": "^@.value"}
        }},
        "value": {
          "&": "switch",
          "value": {"&": "type", "value": "^@.new"},
          "cases": [
            [
              "map", {
                "&": "if",
                "cond": {"'": {"&": "isdict", "item": "^@.old"}}, 
                "true": {"'": {
                  "&": "makemap",
                  "value": {
                    "&": "map_core",
                    "list": {
                      "&": "keys",
                      "map": "^@.new"
                    },
                    "t": {":": {
                      "&": "if",
                      "cond": {":": {
                        "&": "isinlist",
                        "list": {"&": "keys", "map": "^@.old"}
                      }},
                      "true": {"'": {
                        "&": "if",
                        "cond": {":": [
                          "&=",
                          ["^%", "^@.new", "^@.item"],
                          ["^%", "^@.old", "^@.item"]
                        ]},
                        "true": null,
                        "false": {":": {
                          "!": {":": {
                            "&": "if",
                            "cond": {":": {
                              "!": "^@.keepvalue"
                            }},
                            "true": {":":
                              [
                                "^@.item",
                                "^@.value"
                              ]
                            }
                          }},
                          "value": {
                            "&": "newdiff_core",
                            "old": ["^%", "^@.old", "^@.item"],
                            "new": ["^%", "^@.new", "^@.item"]
                          }
                        }}
                      }},
                      "false": {":": [
                        "^@.item",
                        ["^%", "^@.new", "^@.item"]
                      ]}
                    }}
                  }
                }},
                "false": {":": "^@.new"}
              }
            ],
            [
              "list", {
                "!": {":": {
                  "&": "if",
                  "cond": {":": {"&": "hasitems"}},
                  "true": {":": "^@.list"},
                  "false": []
                }},
                "list": {            
                  "&": "if",
                  "cond": {"'": {"&": "islist", "item": "^@.old"}}, 
                  "true": {"'": [
                    "^%",
                    {
                      "&": "reduce",
                      "list": "^@.new",
                      "accum": {
                        "index": 0,
                        "result": []
                      },
                      "t": {":": {
                        "index": ["&+", "^@.accum.index", 1],
                        "result": 
                        [
                          "&&",
                          "^@.accum.result",
                          [
                            {
                              "!": {":": {
                                "&": "if",
                                "cond": {":": {"!": "^@.keepvalue"}},
                                "true": {":": "^@.value"}
                              }},
                              "value": 
                              {
                                "&": "newdiff_core",
                                "old": ["^%", "^@.old", "^@.accum.index"],
                                "new": "^@.item"
                              }
                            }
                          ]
                        ]
                      }}
                    },
                    "result"
                  ]},
                  "false": {":": "^@.new"}
                }
              }
            ],
            {
              "&": "if",
              "cond": {":": 
                [
                  "&=",
                  "^@.new",
                  "^@.old"
                ]
              },
              "false": {":": "^@.new"}
            }
          ]
        }
      }},
      "keepvalue": {":": [
        "&||",
        "^@.value",
        [
          "&!",
          {
            "&": "isinlist",
            "item": {"&": "type"},
            "list": ["null", "map", "list"]
          }
        ]
      ]}
    },
    "requires": ["hasitems", "isdict", "islist", "switch", "map_core", "isinlist", "newdiff_core"]
  },
  {
    "name": "applynewdiff_core_emlynoregan_com",
    "transform-t": {
      "!": {":": {
        "&": "when",
        "cases": [
          [
            {":": [
              "&=",
              null,
              "^@.diff"
            ]},
            {":": "^@.old"}
          ],
          [
            {":": [
              "&!=",
              "^@.oldtype",
              "^@.difftype"
            ]},
            {":": "^@.diff"}
          ],
          [
            {":": [
              "&=",
              "^@.difftype",
              "map"
            ]},
            {":": {
              "!": {":": {
                "&": "makemap",
                "value": {
                  "&": "map_core",
                  "list": "^@.keys",
                  "t": {":": [
                    "^@.item",
                    {
                      "&": "applynewdiff",
                      "old": [
                        "^@",
                        "old",
                        "^@.item"
                      ],
                      "diff": [
                        "^@",
                        "diff",
                        "^@.item"
                      ]
                    }
                  ]}
                }
              }},
              "keys": {
                "&": "removedupstrarr",
                "list": [
                  "&&",
                  {
                    "&": "keys",
                    "map": "^@.old"
                  },
                  {
                    "&": "keys",
                    "map": "^@.diff"
                  }
                ]
              }
            }}
          ],
          [
            {":": [
              "&=",
              "^@.difftype",
              "list"
            ]},
            {":": {
              "!": {":": 
                [
                  "^%",
                  {
                    "&": "reduce",
                    "accum": {
                      "index": 0,
                      "result": []
                    },
                    "list": "^@.longestlist",
                    "t": {":": { 
                      "index": [
                        "&+",
                        "^@.accum.index",
                        1
                      ],
                      "result":
                      [
                        "&&",
                        "^@.accum.result",
                        {
                          "&": "applynewdiff",
                          "old": [
                            "^@",
                            "old",
                            "^@.accum.index"
                          ],
                          "diff": [
                            "^@",
                            "diff",
                            "^@.accum.index"
                          ]
                        }
                      ]
                    }}
                  },
                  "result"
                ]
              },
              "longestlist": {
                "&": "longest",
                "list": [
                  "^@.old",
                  "^@.diff"
                ]
              }
            }}
          ],
          {":": "^@.diff"}
        ]
      }},
      "oldtype": {
        "&": "type",
        "value": "^@.old"
      },
      "difftype": {
        "&": "type",
        "value": "^@.diff"
      }
    },
    "requires": ["applynewdiff", "when", "removedupstrarr", "map_core", "longest"]
  },
  {
    "name": "combine_core_emlynoregan_com",
    "transform-t": {
      "&": "reduce",
      "list": "^@.list",
      "accum": null,
      "t": {
        ":": {
          "&": "if",
          "cond": {
            ":": "^@.accum"
          },
          "false": {
            ":": "^@.item"
          },
          "true": {
            ":": {
              "&": "makemap",
              "value": [
                [
                  "!!",
                  {
                    "&": "makemap",
                    "value": [
                      [
                        ":",
                        "^@.item"
                      ]
                    ]
                  }
                ],
                [
                  "s",
                  "^@.accum"
                ]
              ]
            }
          }
        }
      }
    }
  },
  {
    "name": "declcombine_core_emlynoregan_com",
    "transform-t": {
      "transform-t": {
        "&": "combine",
        "list": "&@.list.*.transform-t"
      },
      "requires": {
        "&": "keys",
        "map": {
          "&": "keys2map",
          "list": 
          {
            "!": 
            {
              "&": "reduce",
              "list": "&@.list.*.requires",
              "accum": {":": ["&&"]},
              "t": {":": 
                [
                  "&&",
                  "^@.accum",
                  "^@.item"
                ]
              }
            }
          }
        }
      }
    },
    "requires": ["combine", "keys2map"]
  },
  {
    "name": "max_core_emlynoregan_com",
    "transform-t": {
      "&": "reduce",
      "accum": 0,
      "t": {":": {
        "!": {":": {
          "&": "if",
          "cond": {":": [
            "&>=",
            "^@.accum",
            "^@.item"
          ]},
          "true": {":": "^@.accum"},
          "false": {":": "^@.item"}
        }}
      }}
    },
    "requires": ["map_core"]
  },
  {
    "name": "lenmax_core_emlynoregan_com",
    "transform-t": {
      "&": "reduce",
      "accum": 0,
      "t": {":": {
        "!": {":": {
          "&": "if",
          "cond": {":": [
            "&>=",
            "^@.accum",
            "^@.itemlen"
          ]},
          "true": {":": "^@.accum"},
          "false": {":": "^@.itemlen"}
        }},
        "itemlen": {
          "&": "len",
          "list": "^@.item"
        }
      }}
    },
    "requires": ["map_core"]
  },
  {
    "name": "longest_core_emlynoregan_com",
    "transform-t": {
      "&": "reduce",
      "accum": [],
      "t": {":": 
        {
          "&": "if",
          "cond": {":": [
            "&>",
            {
              "&": "len",
              "list": "^@.item"
            },
            {
              "&": "len",
              "list": "^@.accum"
            }
          ]},
          "true": {"'": "^@.item"},
          "false": {"'": "^@.accum"}
        }
      }
    }
  }
]
;