/* Generated from docs/STORY_BIBLE.md by scripts/build-order-catalog.cjs. */
(function(root){
  'use strict';
  const catalog={
  "schemaVersion": 1,
  "contentVersion": "2026-10-05.2",
  "seasonId": "tide-lines-season-1",
  "status": "content-ready",
  "playableOrderIds": [
    "ahan-vase-01",
    "tang-soup-bowl-02",
    "shen-ferry-cup-03",
    "wen-ledger-jar-04",
    "xu-seed-bowl-05",
    "lin-recording-cup-06",
    "gu-comparison-bowl-07",
    "he-welcome-bowl-08",
    "yan-exhibition-vase-09",
    "ye-kiln-water-jar-10",
    "mei-rice-bowl-11",
    "cen-tide-bowl-12",
    "shen-trial-cup-13",
    "lin-shared-plate-14",
    "neighbors-feast-bowl-15"
  ],
  "orders": [
    {
      "id": "ahan-vase-01",
      "sequence": 1,
      "act": 1,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "阿蘅",
        "role": "花摊摊主",
        "from": "花摊阿蘅；开局第一封信。",
        "introducedBy": null
      },
      "unlock": {
        "type": "start",
        "afterOrderId": null,
        "requiresReadReply": false
      },
      "title": "阿蘅的窗台花瓶",
      "letter": "师傅你好，我是巷口卖花的阿蘅。昨天关摊时剩下一枝白菊，我拿酱油瓶插着，早上我娘差点往里倒酱油。能不能给我做个小花瓶？窗台窄，底下稳一点就好。瓶口那圈涂浅色吧，省得我娘又拿错。画得歪，你看得懂就行。",
      "replies": {
        "basic": "收到啦。瓶子比我画的胖些，我娘说这样反而不容易倒。唐叔来买花，问这是谁做的。我说你那间窑房就在拐角，叫他自己去敲门。",
        "close": "白菊插进去了，口子正好，早上开窗也没晃。唐叔看见后端起来掂了掂，说他那口汤锅旁边也缺个像样的陶器。你这两天留意一下门。",
        "excellent": "我娘今早先拿它当酱油瓶，看到白圈又放回去了。她嘴上说‘总算有个有用的’，转头把最好看的花插了进去。唐叔在旁边听笑了，说要找你做碗。你可别告诉他我先说了。"
      },
      "reference": {
        "status": "ready",
        "description": "温暖陶土，矮圆底足、略鼓的腹、收窄的颈、微外翻口，约高宽比 1.6；泥本色，口沿下一道淡米色窄环，其他留白。图中插着一枝小白花；评分只看器物。",
        "shapeFamily": "vase",
        "materialId": "warm-earth",
        "heightWidthRatio": 1.6,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.28
            ],
            [
              0.1,
              0.38
            ],
            [
              0.25,
              0.54
            ],
            [
              0.45,
              0.62
            ],
            [
              0.7,
              0.49
            ],
            [
              0.87,
              0.3
            ],
            [
              0.96,
              0.29
            ],
            [
              1,
              0.32
            ]
          ],
          "estimatedHeight": 1.72
        },
        "rings": [
          {
            "center": 0.87,
            "color": "#eee2c6",
            "width": 0.022
          }
        ],
        "paintZones": [],
        "motifs": [],
        "details": [],
        "decoration": {
          "difficultyLevel": 1,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "rice-white"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/ahan-vase-01.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "基础塑形、单环上色。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 6,
        "tiers": {
          "basic": [
            6,
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "tang-soup-bowl-02",
      "legacy": {
        "orderId": "ahan-vase-01",
        "targetProfile": [
          0.28,
          0.54,
          0.62,
          0.49,
          0.3,
          0.32
        ],
        "targetHeight": 1.72,
        "economyKey": "clay-and-flame-economy-v1",
        "preserveExistingSave": true
      }
    },
    {
      "id": "tang-soup-bowl-02",
      "sequence": 2,
      "act": 1,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "唐叔",
        "role": "食摊老板",
        "from": "食摊唐叔，由阿蘅介绍。",
        "introducedBy": "ahan-vase-01"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "ahan-vase-01",
        "requiresReadReply": true
      },
      "title": "唐叔的热汤碗",
      "letter": "阿蘅叫我来找你。我要个盛汤的碗，不用花哨。现在那批碗底小，沈桥端着上船，我看着都替他手抖。画在纸上的是个大概：底宽些，碗别太深，外头两道棕线，是我家摊子的记号。价钱该怎么算就怎么算，别听阿蘅说我总赊账。",
      "replies": {
        "basic": "昨晚用了。口比我想的收一些，汤舀得慢点也成。沈桥看着碗问了半天，结账还忘拿找钱。我叫他明天去你那儿问。",
        "close": "昨晚卖出去七碗汤，你这个最先被人挑走。沈桥捧着走过跳板，没洒。临走说两条棕线让他想起家里一只旧杯，估计要来烦你。",
        "excellent": "沈桥昨夜一边端碗一边替人解缆，汤一滴没泼。我才想起催他付钱，他说记账，跑了。倒是问清了你的地址。他家那只旧杯碎了好多年，这事平常他不提。"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土烧成后的亚光浅碗，宽而平稳的圈足、圆润内壁、向外舒展的口沿，高宽比约 0.55；外壁中下部两道暖棕标准环，内壁素色。",
        "shapeFamily": "shallow-bowl",
        "materialId": "warm-earth",
        "heightWidthRatio": 0.55,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.58
            ],
            [
              0.07,
              0.61
            ],
            [
              0.2,
              0.67
            ],
            [
              0.4,
              0.8
            ],
            [
              0.62,
              0.92
            ],
            [
              0.82,
              0.97
            ],
            [
              0.96,
              1
            ],
            [
              1,
              1
            ]
          ],
          "estimatedHeight": 1.15
        },
        "rings": [
          {
            "center": 0.28,
            "color": "#8a604d",
            "width": 0.022
          },
          {
            "center": 0.4,
            "color": "#8a604d",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.2,
            "to": 0.57,
            "fromPigment": "iron-red",
            "toPigment": "warm-gold",
            "opacity": 0.88,
            "edge": 0.06
          }
        ],
        "motifs": [],
        "details": [],
        "decoration": {
          "difficultyLevel": 1,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "iron-red",
            "warm-gold"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "iron-red",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "warm-gold",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/tang-soup-bowl-02.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "浅碗、双标准环。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 6,
        "tiers": {
          "basic": [
            6,
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "shen-ferry-cup-03",
      "legacy": null
    },
    {
      "id": "shen-ferry-cup-03",
      "sequence": 3,
      "act": 1,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "沈桥",
        "role": "渡工",
        "from": "渡工沈桥，由唐叔介绍。",
        "introducedBy": "tang-soup-bowl-02"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "tang-soup-bowl-02",
        "requiresReadReply": true
      },
      "title": "沈桥的渡口水杯",
      "letter": "唐叔让我写清楚，别只拿个杯底上门。照片在信后头，是我爹以前喝水的杯子；那时码头还没封。杯身差不多直的，口厚些，外头三道线。我小时候老拿手指抠中间那道，被他骂过。照片看不清的地方，你按自己的手感做。碎口就别照着做了。",
      "replies": {
        "basic": "我带上船用了。跟旧杯不像的地方，反正照片也没拍着。闻梨来送茶，看见杯上的线，问我怎么又把家里的破东西找出来了。我说这是新做的，她还不信。",
        "close": "杯子好握。第二道线在手指底下，这点跟我记得的一样。闻梨端过去看了好一会儿，翻出她奶奶的旧账给我看。她说账本里的窑房，也许就是做这种杯子的。",
        "excellent": "拿到杯子时，我下意识把手指扣在第二道线上，跟小时候一样。闻梨瞧见上头那道，忽然说：‘这不是随手画的吧？’她翻账本翻到半夜。她要是给你写信，记得让她先吃饭。"
      },
      "reference": {
        "status": "ready",
        "description": "红陶土直身无把杯，底足宽、腹略内收、厚圆口沿，高宽比约 1.15；杯外三道不等距深灰标准细环，最上道停在肩下。参照图旁有一张磨损的旧渡口杯底照片。",
        "shapeFamily": "straight-cup",
        "materialId": "red-earth",
        "heightWidthRatio": 1.15,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.46
            ],
            [
              0.07,
              0.49
            ],
            [
              0.2,
              0.51
            ],
            [
              0.4,
              0.5
            ],
            [
              0.6,
              0.49
            ],
            [
              0.78,
              0.48
            ],
            [
              0.92,
              0.49
            ],
            [
              0.98,
              0.52
            ],
            [
              1,
              0.53
            ]
          ],
          "estimatedHeight": 1.22
        },
        "rings": [
          {
            "center": 0.22,
            "color": "#555354",
            "width": 0.022
          },
          {
            "center": 0.53,
            "color": "#555354",
            "width": 0.022
          },
          {
            "center": 0.8,
            "color": "#555354",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.79,
            "fromPigment": "iron-red",
            "toPigment": "rice-white",
            "opacity": 0.73,
            "edge": 0.09
          }
        ],
        "motifs": [],
        "details": [
          {
            "id": "O03-D01",
            "center": 0.22,
            "width": 0.022,
            "bandHeight": 0.02684,
            "source": {
              "type": "ring",
              "args": [
                0.22,
                "#555354",
                0.022
              ]
            }
          },
          {
            "id": "O03-D02",
            "center": 0.53,
            "width": 0.022,
            "bandHeight": 0.02684,
            "source": {
              "type": "ring",
              "args": [
                0.53,
                "#555354",
                0.022
              ]
            }
          },
          {
            "id": "O03-D03",
            "center": 0.8,
            "width": 0.022,
            "bandHeight": 0.02684,
            "source": {
              "type": "ring",
              "args": [
                0.8,
                "#555354",
                0.022
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 2,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "ink-black",
            "iron-red",
            "rice-white"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "ink-black",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "iron-red",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/shen-ferry-cup-03.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "三标准环定位。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "red-earth",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 2,
        "shopPrice": 180,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "wen-ledger-jar-04",
      "legacy": null
    },
    {
      "id": "wen-ledger-jar-04",
      "sequence": 4,
      "act": 2,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "闻梨",
        "role": "茶馆主",
        "from": "茶馆主闻梨，由沈桥介绍。",
        "introducedBy": "shen-ferry-cup-03"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "shen-ferry-cup-03",
        "requiresReadReply": true
      },
      "title": "闻梨的账页罐",
      "letter": "我是茶馆的闻梨。沈桥那杯子上的线，我越看越眼熟。我奶奶的账本里有三家给渡口烧罐的窑房，名字都还在；山上展板怎么只剩一个人，等我弄明白再说。眼下先帮我做个柜台上的罐吧，装卷起来的账页抄本，原本我收着。肩上那道浅蓝别画得太直，像窗外的潮水轻轻拐一下就好。沈桥说你不会嫌我啰嗦。",
      "replies": {
        "basic": "罐子摆上了。抄本得卷紧些才放得下，不过客人真肯拿出来看。隔壁学校的许老师借了两页去讲课，说明天还。",
        "close": "浅蓝线跟门框上那道差不多。许老师把抄本看了两遍，说孩子们总以为封掉的地方从没存在过。我把你的窑房指给她看了。",
        "excellent": "许老师拿起抄本的时候，先夸罐肩那条线画得准。我说你别光看罐，看看里面写了几个名字。她后来带学生去了老码头，还说想找你做点东西。我让她自己来讲。"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土中等高度的无盖罐，宽底、饱满腹、短颈、小口，高宽比约 1.25；肩下一条淡蓝「回潮」标准纹带、腹部两道深棕环。参照图中罐后摊着旧账页；账页不是要画到罐上。",
        "shapeFamily": "short-neck-jar",
        "materialId": "warm-earth",
        "heightWidthRatio": 1.25,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.42
            ],
            [
              0.1,
              0.45
            ],
            [
              0.3,
              0.64
            ],
            [
              0.52,
              0.7
            ],
            [
              0.7,
              0.62
            ],
            [
              0.84,
              0.44
            ],
            [
              0.94,
              0.36
            ],
            [
              1,
              0.36
            ]
          ],
          "estimatedHeight": 1.75
        },
        "rings": [
          {
            "center": 0.4,
            "color": "#705449",
            "width": 0.022
          },
          {
            "center": 0.54,
            "color": "#705449",
            "width": 0.022
          },
          {
            "center": 0.79,
            "color": "#a9bfc5",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.83,
            "fromPigment": "pine-green",
            "toPigment": "mist-blue",
            "opacity": 0.88,
            "edge": 0.09
          },
          {
            "from": 0.55,
            "to": 0.84,
            "fromPigment": "mist-blue",
            "toPigment": "pine-green",
            "opacity": 0.47,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W06",
            "center": 0.79,
            "width": 0.06857142857142857,
            "fit": {
              "repeat": 14,
              "motifWidthU": 0.11,
              "bandHeight": 0.12,
              "center": 0.56
            }
          }
        ],
        "details": [
          {
            "id": "O04-D01",
            "center": 0.4,
            "width": 0.022,
            "bandHeight": 0.0385,
            "source": {
              "type": "ring",
              "args": [
                0.4,
                "#705449",
                0.022
              ]
            }
          },
          {
            "id": "O04-D02",
            "center": 0.54,
            "width": 0.022,
            "bandHeight": 0.0385,
            "source": {
              "type": "ring",
              "args": [
                0.54,
                "#705449",
                0.022
              ]
            }
          },
          {
            "id": "O04-D03",
            "center": 0.74,
            "width": 0.0029296875,
            "bandHeight": 0.005126953125,
            "source": {
              "type": "stroke",
              "args": [
                0.74,
                "#758c97",
                3
              ]
            }
          },
          {
            "id": "O04-D04",
            "center": 0.72,
            "width": 0.005859375,
            "bandHeight": 0.01025390625,
            "source": {
              "type": "dots",
              "args": [
                0.72,
                "#e5d6b7",
                32,
                3
              ]
            }
          },
          {
            "id": "O04-D05",
            "center": 0.47,
            "width": 0.01806640625,
            "bandHeight": 0.0316162109375,
            "source": {
              "type": "ticks",
              "args": [
                0.47,
                "#667e68",
                40,
                15,
                4
              ]
            }
          },
          {
            "id": "O04-D06",
            "center": 0.63,
            "width": 0.02294921875,
            "bandHeight": 0.0401611328125,
            "source": {
              "type": "braided",
              "args": [
                0.63,
                "#667e68",
                20,
                10
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 2,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring",
            "W06"
          ],
          "pigmentIds": [
            "mist-blue",
            "chestnut",
            "pine-green"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "W06",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "chestnut",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "pine-green",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/wen-ledger-jar-04.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "多环配色、首次选用标准纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "xu-seed-bowl-05",
      "legacy": null
    },
    {
      "id": "xu-seed-bowl-05",
      "sequence": 5,
      "act": 2,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "许禾",
        "role": "学校教师",
        "from": "学校教师许禾，由闻梨介绍。",
        "introducedBy": "wen-ledger-jar-04"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "wen-ledger-jar-04",
        "requiresReadReply": true
      },
      "title": "许老师的课堂种子碗",
      "letter": "你好，我是学校的许禾。上周带孩子看旧码头，回程下雨，三十个人把鞋踩得像三十只泥鸭子。闻梨借我的账页倒没淋湿。我们想在教室窗边种点耐盐的草，缺只浅碗放种子；孩子们画了两道蓝线，说下面是岸、上面是水。中间还盖了一排歪花瓣，挑现成的花瓣纹贴上就行，不用照着他们的笔迹描。那张画我放在信后面。",
      "replies": {
        "basic": "种子倒进去了，最小那个孩子坚持每天给它数一遍，昨天数出比种下去还多。林栖从博物馆来收画，看见碗问是谁做的，我写在画背面了。",
        "close": "孩子们说两道线跟他们画的一样，争着给碗浇水。博物馆的林栖来听他们讲码头，临走特地把你的名字抄走了。她做事很仔细，信可能写得像表格，你别见怪。",
        "excellent": "孩子们轮着捧碗，不肯让我放回窗边。林栖过来时，有人说上面那道线是‘下雨也能回家的岸’。她把这句话记进本子里，也问了你的窑房在哪儿。顺便说一句，草还没发芽，先别告诉孩子们我有点担心。"
      },
      "reference": {
        "status": "ready",
        "description": "红陶土小浅碗，平底、略直的下腹、开阔圆口，高宽比约 0.48；口沿下一道白环，外腹两道间距清楚的浅蓝环，中间一排可贴的标准花瓣纹。参照图旁是孩子画的旧码头，不要求复刻儿童画。",
        "shapeFamily": "small-shallow-bowl",
        "materialId": "red-earth",
        "heightWidthRatio": 0.48,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.4
            ],
            [
              0.1,
              0.42
            ],
            [
              0.3,
              0.49
            ],
            [
              0.6,
              0.69
            ],
            [
              0.9,
              0.84
            ],
            [
              1,
              0.85
            ]
          ],
          "estimatedHeight": 0.816
        },
        "rings": [
          {
            "center": 0.35,
            "color": "#a8bfcb",
            "width": 0.022
          },
          {
            "center": 0.57,
            "color": "#a8bfcb",
            "width": 0.022
          },
          {
            "center": 0.89,
            "color": "#eee8d8",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.15,
            "to": 0.82,
            "fromPigment": "rice-white",
            "toPigment": "pine-green",
            "opacity": 0.84,
            "edge": 0.09
          },
          {
            "from": 0.45,
            "to": 0.73,
            "fromPigment": "pine-green",
            "toPigment": "rice-white",
            "opacity": 0.42,
            "edge": 0.07
          }
        ],
        "motifs": [
          {
            "id": "petal",
            "center": 0.46,
            "width": 0.13,
            "fit": null
          }
        ],
        "details": [
          {
            "id": "O05-D01",
            "center": 0.35,
            "width": 0.022,
            "bandHeight": 0.017952,
            "source": {
              "type": "ring",
              "args": [
                0.35,
                "#a8bfcb",
                0.022
              ]
            }
          },
          {
            "id": "O05-D02",
            "center": 0.57,
            "width": 0.022,
            "bandHeight": 0.017952,
            "source": {
              "type": "ring",
              "args": [
                0.57,
                "#a8bfcb",
                0.022
              ]
            }
          },
          {
            "id": "O05-D03",
            "center": 0.89,
            "width": 0.022,
            "bandHeight": 0.017952,
            "source": {
              "type": "ring",
              "args": [
                0.89,
                "#eee8d8",
                0.022
              ]
            }
          },
          {
            "id": "O05-D04",
            "center": 0.46,
            "width": 0.0078125,
            "bandHeight": 0.006375,
            "source": {
              "type": "dots",
              "args": [
                0.46,
                "#e5d6b7",
                24,
                4
              ]
            }
          },
          {
            "id": "O05-D05",
            "center": 0.47,
            "width": 0.0234375,
            "bandHeight": 0.019125,
            "source": {
              "type": "arcs",
              "args": [
                0.47,
                "#667e68",
                24,
                10
              ]
            }
          },
          {
            "id": "O05-D06",
            "center": 0.66,
            "width": 0.0029296875,
            "bandHeight": 0.002390625,
            "source": {
              "type": "stroke",
              "args": [
                0.66,
                "#e5d6b7",
                3
              ]
            }
          },
          {
            "id": "O05-D07",
            "center": 0.27,
            "width": 0.03876953125,
            "bandHeight": 0.0316359375,
            "source": {
              "type": "leafChain",
              "args": [
                0.27,
                "#667e68",
                24,
                8
              ]
            }
          },
          {
            "id": "O05-D08",
            "center": 0.72,
            "width": 0.005859375,
            "bandHeight": 0.00478125,
            "source": {
              "type": "dots",
              "args": [
                0.72,
                "#e5d6b7",
                24,
                3
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 2,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring",
            "petal"
          ],
          "pigmentIds": [
            "rice-white",
            "mist-blue",
            "pine-green"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "petal",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "pine-green",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/xu-seed-bowl-05.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "浅碗、双环定位与标准花瓣纹。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "red-earth",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 2,
        "shopPrice": 180,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "lin-recording-cup-06",
      "legacy": null
    },
    {
      "id": "lin-recording-cup-06",
      "sequence": 6,
      "act": 2,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "林栖",
        "role": "博物馆馆藏助理",
        "from": "博物馆馆藏助理林栖，由许禾介绍。",
        "introducedBy": "xu-seed-bowl-05"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "xu-seed-bowl-05",
        "requiresReadReply": true
      },
      "title": "林栖的采集杯",
      "letter": "您好，林栖，博物馆馆藏部。许老师给了我您的地址。我们要在馆里设一张口述记录桌，水杯老是用一次性的，不太像样。我想请您做一只浅米色的小杯，底稳，别太薄，外面一条很细的灰纹就好，别抢了杯子的样子。我附了尺寸和轮廓图。如果方便，成品照片也请留一张，馆里做入档记录要用。谢谢。",
      "replies": {
        "basic": "杯子收到了，已经放在桌上。今天一位老人讲了四十分钟，水一口没喝。修复室的顾遥倒把杯子翻来覆去看，说要问您几个问题。我把地址给她了。",
        "close": "这只杯子放在记录桌上很合适，拿起来也不怕打滑。顾遥看见杯底，想起我们库房一件旧钵的底足。她托我问问，您愿不愿意再做一件对照用的新器？",
        "excellent": "我照规矩给杯子拍了四面照片。顾遥看完一直没说话，最后问我能不能把您做杯子的步骤也记下来。她这人问得细，若来信有十几个问题，挑能回答的答就好。"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土小杯，平直稳底、轻微鼓腹、窄而圆的口，高宽比约 1.0；浅米色表面，下腹一条极窄灰色「缆绳影」标准纹带。参考是馆内旧杯的线描，旁边标清“这是新作参照，非文物复制”。",
        "shapeFamily": "small-cup",
        "materialId": "warm-earth",
        "heightWidthRatio": 1,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.42
            ],
            [
              0.1,
              0.43
            ],
            [
              0.35,
              0.49
            ],
            [
              0.62,
              0.51
            ],
            [
              0.82,
              0.47
            ],
            [
              1,
              0.45
            ]
          ],
          "estimatedHeight": 1.02
        },
        "rings": [
          {
            "center": 0.25,
            "color": "#929899",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.12,
            "to": 0.84,
            "fromPigment": "rice-white",
            "toPigment": "warm-gold",
            "opacity": 0.85,
            "edge": 0.09
          },
          {
            "from": 0.51,
            "to": 0.8,
            "fromPigment": "warm-gold",
            "toPigment": "rice-white",
            "opacity": 0.39,
            "edge": 0.07
          }
        ],
        "motifs": [
          {
            "id": "W04",
            "center": 0.25,
            "width": 0.12745098039215685,
            "fit": {
              "repeat": 15,
              "motifWidthU": 0.07,
              "bandHeight": 0.13,
              "center": 0.55
            }
          }
        ],
        "details": [
          {
            "id": "O06-D01",
            "center": 0.2,
            "width": 0.0029296875,
            "bandHeight": 0.00298828125,
            "source": {
              "type": "stroke",
              "args": [
                0.2,
                "#929996",
                3
              ]
            }
          },
          {
            "id": "O06-D02",
            "center": 0.31,
            "width": 0.0029296875,
            "bandHeight": 0.00298828125,
            "source": {
              "type": "stroke",
              "args": [
                0.31,
                "#bd9a61",
                3
              ]
            }
          },
          {
            "id": "O06-D03",
            "center": 0.255,
            "width": 0.01123046875,
            "bandHeight": 0.011455078125,
            "source": {
              "type": "ticks",
              "args": [
                0.255,
                "#929996",
                48,
                8,
                3
              ]
            }
          },
          {
            "id": "O06-D04",
            "center": 0.56,
            "width": 0.02099609375,
            "bandHeight": 0.021416015625,
            "source": {
              "type": "braided",
              "args": [
                0.56,
                "#88644e",
                18,
                9
              ]
            }
          },
          {
            "id": "O06-D05",
            "center": 0.71,
            "width": 0.005859375,
            "bandHeight": 0.0059765625,
            "source": {
              "type": "dots",
              "args": [
                0.71,
                "#e5d6b7",
                22,
                3
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 2,
          "base": "flat-pale",
          "patternIds": [
            "W04"
          ],
          "pigmentIds": [
            "rice-white",
            "ash-gray",
            "warm-gold"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "W04",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "ash-gray",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "warm-gold",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/lin-recording-cup-06.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "浅色底、窄纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "gu-comparison-bowl-07",
      "legacy": null
    },
    {
      "id": "gu-comparison-bowl-07",
      "sequence": 7,
      "act": 3,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "顾遥",
        "role": "博物馆修复师",
        "from": "博物馆修复师顾遥，由林栖介绍。",
        "introducedBy": "lin-recording-cup-06"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "lin-recording-cup-06",
        "requiresReadReply": true
      },
      "title": "顾遥的对照钵",
      "letter": "林栖把您的杯子拿来给我看。我叫顾遥，在修复室。请先放心，我不是要您做假古董。库房有两片旧钵，登记时被写成同一作坊，我总觉得依据不够。能按附图做一只新的砂泥钵吗？足低、壁厚，三条线的位置尽量准。我想拿实物跟同事比一比，成品会明写‘今制’，绝不混进旧藏。",
      "replies": {
        "basic": "钵到了。线位有一处偏差，我先在记录里注明了。不过它放到旧残片旁边，大家总算能看出我说的不是一回事。贺馆长明天要来看。",
        "close": "谢谢，尺寸比我从照片里估的还合适。贺馆长看了半小时，把原来准备印的标签稿收回去了。她想见您；不用紧张，她只是说话很慢。",
        "excellent": "我把您那只钵夹在两片残片中间拍照，同事先说‘看着像一家做的’，换个角度又不敢肯定了。这正是我想让他们看见的。贺馆长让我约您谈展厅的事；我把照片也寄给她了。"
      },
      "reference": {
        "status": "ready",
        "description": "砂泥无釉小钵，低圈足、厚腹、微内收圆口，高宽比约 0.8；器腹三道不等距浅灰标准环。参照图是两张并列的馆藏残片轮廓，不要求做裂纹或做旧。",
        "shapeFamily": "thick-bowl",
        "materialId": "stoneware",
        "heightWidthRatio": 0.8,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.48
            ],
            [
              0.1,
              0.5
            ],
            [
              0.35,
              0.63
            ],
            [
              0.65,
              0.66
            ],
            [
              0.82,
              0.6
            ],
            [
              1,
              0.56
            ]
          ],
          "estimatedHeight": 1.056
        },
        "rings": [
          {
            "center": 0.28,
            "color": "#a4a7a3",
            "width": 0.022
          },
          {
            "center": 0.47,
            "color": "#a4a7a3",
            "width": 0.022
          },
          {
            "center": 0.74,
            "color": "#a4a7a3",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.14,
            "to": 0.84,
            "fromPigment": "iron-red",
            "toPigment": "warm-gold",
            "opacity": 0.8,
            "edge": 0.09
          },
          {
            "from": 0.35,
            "to": 0.7,
            "fromPigment": "persimmon",
            "toPigment": "amber",
            "opacity": 0.47,
            "edge": 0.08
          }
        ],
        "motifs": [],
        "details": [
          {
            "id": "O07-D01",
            "center": 0.28,
            "width": 0.022,
            "bandHeight": 0.023232,
            "source": {
              "type": "ring",
              "args": [
                0.28,
                "#a4a7a3",
                0.022
              ]
            }
          },
          {
            "id": "O07-D02",
            "center": 0.47,
            "width": 0.022,
            "bandHeight": 0.023232,
            "source": {
              "type": "ring",
              "args": [
                0.47,
                "#a4a7a3",
                0.022
              ]
            }
          },
          {
            "id": "O07-D03",
            "center": 0.74,
            "width": 0.022,
            "bandHeight": 0.023232,
            "source": {
              "type": "ring",
              "args": [
                0.74,
                "#a4a7a3",
                0.022
              ]
            }
          },
          {
            "id": "O07-D04",
            "center": 0.6,
            "width": 0.02099609375,
            "bandHeight": 0.022171875,
            "source": {
              "type": "ticks",
              "args": [
                0.6,
                "#929996",
                32,
                18,
                6
              ]
            }
          },
          {
            "id": "O07-D05",
            "center": 0.59,
            "width": 0.005859375,
            "bandHeight": 0.0061875,
            "source": {
              "type": "dots",
              "args": [
                0.59,
                "#929996",
                32,
                3
              ]
            }
          },
          {
            "id": "O07-D06",
            "center": 0.67,
            "width": 0.0029296875,
            "bandHeight": 0.00309375,
            "source": {
              "type": "stroke",
              "args": [
                0.67,
                "#929996",
                3,
                [
                  12,
                  12
                ]
              ]
            }
          },
          {
            "id": "O07-D07",
            "center": 0.61,
            "width": 0.0302734375,
            "bandHeight": 0.031968750000000004,
            "source": {
              "type": "diamonds",
              "args": [
                0.61,
                "#88644e",
                20,
                13
              ]
            }
          },
          {
            "id": "O07-D08",
            "center": 0.36,
            "width": 0.055957031250000004,
            "bandHeight": 0.05909062500000001,
            "source": {
              "type": "leafChain",
              "args": [
                0.36,
                "#bd9a61",
                20,
                12
              ]
            }
          },
          {
            "id": "O07-D09",
            "center": 0.28,
            "width": 0.005859375,
            "bandHeight": 0.0061875,
            "source": {
              "type": "dots",
              "args": [
                0.28,
                "#e5d6b7",
                24,
                3
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 3,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "ash-gray",
            "iron-red",
            "warm-gold",
            "persimmon",
            "amber"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "ash-gray",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "iron-red",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "warm-gold",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "persimmon",
              "shopGateSales": 2,
              "shopPrice": 180,
              "requiresOwnership": true
            },
            {
              "id": "amber",
              "shopGateSales": 2,
              "shopPrice": 180,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/gu-comparison-bowl-07.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "砂泥、厚壁感、三处不同高度的标准环。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "stoneware",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 10,
        "shopPrice": 1250,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "he-welcome-bowl-08",
      "legacy": null
    },
    {
      "id": "he-welcome-bowl-08",
      "sequence": 8,
      "act": 3,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "贺清",
        "role": "博物馆馆长",
        "from": "博物馆馆长贺清，由顾遥介绍。",
        "introducedBy": "gu-comparison-bowl-07"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "gu-comparison-bowl-07",
        "requiresReadReply": true
      },
      "title": "贺清的展厅迎客碗",
      "letter": "您好，我是贺清。顾遥给我看了那只对照钵。旧标签的事需要核实，我已经让她先暂停印刷。另有一件小事想请您帮忙：展厅入口缺只盛水的碗。前一只样品太深，保洁的阿姨说洗起来费劲。请做浅些、口敞些，泥色不必遮掉，外面一点灰蓝即可。若您愿意，我想在成品送来时顺便听听您做钵的经过。",
      "replies": {
        "basic": "碗放上去了，保洁说比前一只好洗。谢谢您听了她的意见。晏泊来展厅看场地，问这碗是谁做的；我给了他您的名片。",
        "close": "碗摆在门口正合适。今天有个孩子误以为可以伸手碰，我还没来得及拦，他母亲就问：‘这只为什么不在柜里？’这个问题很好。晏泊也看过，想和您谈谈。",
        "excellent": "保洁阿姨今天特地告诉我，这碗好擦，边缘也不挂水。我们策展时很少收到这么实在的好评。晏泊来时在碗前坐了很久，说要给您写信。我提醒他先把图画清楚，别只写诗。"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土宽口浅碗，低稳足、圆腹、微上扬的口沿，高宽比约 0.5；浅色表面，外壁下部一圈很淡的灰蓝「回潮」标准纹带，口沿留白。馆长提供旧展柜照片与新展厅草图，评分只看碗。",
        "shapeFamily": "wide-shallow-bowl",
        "materialId": "warm-earth",
        "heightWidthRatio": 0.5,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.48
            ],
            [
              0.1,
              0.5
            ],
            [
              0.38,
              0.65
            ],
            [
              0.7,
              0.8
            ],
            [
              0.95,
              0.87
            ],
            [
              1,
              0.88
            ]
          ],
          "estimatedHeight": 0.88
        },
        "rings": [
          {
            "center": 0.28,
            "color": "#96aab4",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.14,
            "to": 0.83,
            "fromPigment": "rice-white",
            "toPigment": "mist-blue",
            "opacity": 0.88,
            "edge": 0.09
          },
          {
            "from": 0.47,
            "to": 0.8,
            "fromPigment": "sky-blue",
            "toPigment": "rice-white",
            "opacity": 0.48,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W06",
            "center": 0.28,
            "width": 0.13636363636363635,
            "fit": {
              "repeat": 14,
              "motifWidthU": 0.11,
              "bandHeight": 0.12,
              "center": 0.56
            }
          }
        ],
        "details": [
          {
            "id": "O08-D01",
            "center": 0.39,
            "width": 0.005859375,
            "bandHeight": 0.00515625,
            "source": {
              "type": "dots",
              "args": [
                0.39,
                "#e5d6b7",
                24,
                3
              ]
            }
          },
          {
            "id": "O08-D02",
            "center": 0.36,
            "width": 0.02734375,
            "bandHeight": 0.0240625,
            "source": {
              "type": "arcs",
              "args": [
                0.36,
                "#758c97",
                20,
                12
              ]
            }
          },
          {
            "id": "O08-D03",
            "center": 0.18,
            "width": 0.0029296875,
            "bandHeight": 0.002578125,
            "source": {
              "type": "stroke",
              "args": [
                0.18,
                "#e5d6b7",
                3
              ]
            }
          },
          {
            "id": "O08-D04",
            "center": 0.48,
            "width": 0.03271484375,
            "bandHeight": 0.0287890625,
            "source": {
              "type": "braided",
              "args": [
                0.48,
                "#758c97",
                18,
                15
              ]
            }
          },
          {
            "id": "O08-D05",
            "center": 0.6,
            "width": 0.06025390625,
            "bandHeight": 0.0530234375,
            "source": {
              "type": "leafChain",
              "args": [
                0.6,
                "#e5d6b7",
                20,
                13
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 3,
          "base": "flat-pale",
          "patternIds": [
            "W06"
          ],
          "pigmentIds": [
            "rice-white",
            "mist-blue",
            "sky-blue"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "W06",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "sky-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/he-welcome-bowl-08.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "浅色底、大面积留白、低位窄纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "yan-exhibition-vase-09",
      "legacy": null
    },
    {
      "id": "yan-exhibition-vase-09",
      "sequence": 9,
      "act": 3,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "晏泊",
        "role": "艺术家",
        "from": "知名艺术家晏泊，由贺清介绍。",
        "introducedBy": "he-welcome-bowl-08"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "he-welcome-bowl-08",
        "requiresReadReply": true
      },
      "title": "晏泊的展前试作",
      "letter": "贺馆长说我得把图画清楚。她说得对。附件是我替展览画的瓶子：身子长，肩不要太鼓，腹上先留点淡淡的蓝灰，往肩上散开；三道线从下往上淡下去。原本我想叫它《潮汐》，现在不急着起名了。你先照图试做一只吧。若方便，烧的时候告诉我一声，我想来看看；我上次进窑房还是十多年前。",
      "replies": {
        "basic": "瓶子收到了。我的图在纸上好看，落到泥上有些地方不对，怪不到你。叶青找到几张老窑照片，缠着我去问照片上的人是谁。她办事比我快，可能先来找你。",
        "close": "你把瓶颈收得很准。我本来打算在展签上写一段漂亮话，叶青拿着旧窑照片过来说：‘先找人问过再写。’我听她的。她明天去旧街。",
        "excellent": "做得真好，好到我开始担心自己那张草图占了不该占的位置。三道线是谁先用的，我还没问明白就想署名，实在太急。叶青认出了旧照片里抱罐的梅婶；她说先做一只罐，带着去见人，比带我的画册管用。"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土高颈瓶，宽足、修长腹、肩微隆、口略外翻，高宽比约 1.9；腹上先铺一层很浅的蓝灰底，往上逐渐淡回泥色，再贴由深到浅的三道「三潮线」标准纹带，肩部留泥本色。图是晏泊亲绘的轮廓草稿，注明“当代试作”。",
        "shapeFamily": "tall-neck-vase",
        "materialId": "warm-earth",
        "heightWidthRatio": 1.9,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.38
            ],
            [
              0.1,
              0.4
            ],
            [
              0.32,
              0.58
            ],
            [
              0.52,
              0.62
            ],
            [
              0.68,
              0.6
            ],
            [
              0.79,
              0.46
            ],
            [
              0.92,
              0.31
            ],
            [
              1,
              0.34
            ]
          ],
          "estimatedHeight": 2.356
        },
        "rings": [
          {
            "center": 0.33,
            "color": "#536d82",
            "width": 0.022
          },
          {
            "center": 0.47,
            "color": "#758a9b",
            "width": 0.022
          },
          {
            "center": 0.61,
            "color": "#a2b4bb",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.12,
            "to": 0.72,
            "fromPigment": "night-blue",
            "toPigment": "lake-blue",
            "opacity": 0.92,
            "edge": 0.08
          },
          {
            "from": 0.52,
            "to": 0.83,
            "fromPigment": "lake-blue",
            "toPigment": "sky-blue",
            "opacity": 0.7,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W01",
            "center": 0.47,
            "width": 0.0933786078098472,
            "fit": {
              "repeat": 1,
              "motifWidthU": 1,
              "bandHeight": 0.22,
              "center": 0.75
            }
          }
        ],
        "details": [
          {
            "id": "O09-D01",
            "center": 0.33,
            "width": 0.022,
            "bandHeight": 0.051831999999999996,
            "source": {
              "type": "ring",
              "args": [
                0.33,
                "#536d82",
                0.022
              ]
            }
          },
          {
            "id": "O09-D02",
            "center": 0.61,
            "width": 0.022,
            "bandHeight": 0.051831999999999996,
            "source": {
              "type": "ring",
              "args": [
                0.61,
                "#a2b4bb",
                0.022
              ]
            }
          },
          {
            "id": "O09-D03",
            "center": 0.25,
            "width": 0.0029296875,
            "bandHeight": 0.00690234375,
            "source": {
              "type": "stroke",
              "args": [
                0.25,
                "#3d557c",
                3
              ]
            }
          },
          {
            "id": "O09-D04",
            "center": 0.29,
            "width": 0.005859375,
            "bandHeight": 0.0138046875,
            "source": {
              "type": "dots",
              "args": [
                0.29,
                "#3d557c",
                32,
                3
              ]
            }
          },
          {
            "id": "O09-D05",
            "center": 0.54,
            "width": 0.01318359375,
            "bandHeight": 0.031060546874999997,
            "source": {
              "type": "ticks",
              "args": [
                0.54,
                "#758c97",
                32,
                10,
                5
              ]
            }
          },
          {
            "id": "O09-D06",
            "center": 0.68,
            "width": 0.0029296875,
            "bandHeight": 0.00690234375,
            "source": {
              "type": "stroke",
              "args": [
                0.68,
                "#758c97",
                3,
                [
                  13,
                  14
                ]
              ]
            }
          },
          {
            "id": "O09-D07",
            "center": 0.39,
            "width": 0.03271484375,
            "bandHeight": 0.077076171875,
            "source": {
              "type": "braided",
              "args": [
                0.39,
                "#3d557c",
                20,
                15
              ]
            }
          },
          {
            "id": "O09-D08",
            "center": 0.56,
            "width": 0.0205078125,
            "bandHeight": 0.04831640625,
            "source": {
              "type": "diamonds",
              "args": [
                0.56,
                "#758c97",
                20,
                8
              ]
            }
          },
          {
            "id": "O09-D09",
            "center": 0.71,
            "width": 0.005859375,
            "bandHeight": 0.0138046875,
            "source": {
              "type": "dots",
              "args": [
                0.71,
                "#e5d6b7",
                20,
                3
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 3,
          "base": "soft-mix",
          "patternIds": [
            "W01"
          ],
          "pigmentIds": [
            "mist-blue",
            "sky-blue",
            "night-blue",
            "lake-blue"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "W01",
              "shopGateSales": 6,
              "shopPrice": 720,
              "requiresOwnership": true
            }
          ],
          "pigmentAccess": [
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "sky-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            },
            {
              "id": "night-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            },
            {
              "id": "lake-blue",
              "shopGateSales": 7,
              "shopPrice": 750,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/yan-exhibition-vase-09.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "高瓶、双蓝叠色的浅底过渡、标准三潮线。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "ye-kiln-water-jar-10",
      "legacy": null
    },
    {
      "id": "ye-kiln-water-jar-10",
      "sequence": 10,
      "act": 4,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "叶青",
        "role": "艺术家助手",
        "from": "艺术家助手叶青，由晏泊介绍。",
        "introducedBy": "yan-exhibition-vase-09"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "yan-exhibition-vase-09",
        "requiresReadReply": true
      },
      "title": "叶青的旧窑水罐",
      "letter": "我是叶青，替晏泊跑资料的。旧照片上写‘无名工人’，可照片里分明是梅婶，我小时候还被她骂过不许碰湿坯。她不爱给记者说故事，见了画册大概会关门。你能照照片里的罐做一只吗？有砂粒、厚口，肩上一道白线；腹部那些短刻痕，用现成的船板纹排一圈就好。我拎着实物过去，她至少会先挑两句毛病。",
      "replies": {
        "basic": "门开了。梅婶说这罐底还可以再宽点，接着就把我请进去喝水。她问谁烧的，我告诉她。你要是去，带点吃的；她午饭常忘。",
        "close": "梅婶先把罐放地上推了推，说‘这才像摆船上的’。然后她找出一摞旧纸，讲到天黑还没讲完。她让做罐的人亲自来，别总派我这个外行传话。",
        "excellent": "梅婶摸到砂粒就笑，说小时候我偷懒筛砂，也筛出过这么粗的。她留我吃饭，还拿账册敲我脑袋：‘晏泊要问，就让他自己来。’你也来吧。罐子她已经拿去装水了。"
      },
      "reference": {
        "status": "ready",
        "description": "夹砂粗陶小水罐，宽底、丰腹、短颈、外翻厚口，高宽比约 1.2；不加光亮釉，肩下一道白色标准环，腹部另有一排很浅的「船板刻」标准短纹。图源是一张泛黄的旧窑房照片，目标形状由叶青重新描线。",
        "shapeFamily": "water-jar",
        "materialId": "coarse-earthenware",
        "heightWidthRatio": 1.2,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.47
            ],
            [
              0.1,
              0.5
            ],
            [
              0.3,
              0.7
            ],
            [
              0.55,
              0.73
            ],
            [
              0.72,
              0.6
            ],
            [
              0.86,
              0.45
            ],
            [
              0.95,
              0.42
            ],
            [
              1,
              0.46
            ]
          ],
          "estimatedHeight": 1.752
        },
        "rings": [
          {
            "center": 0.81,
            "color": "#eee9da",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.82,
            "fromPigment": "iron-red",
            "toPigment": "persimmon",
            "opacity": 0.85,
            "edge": 0.09
          },
          {
            "from": 0.43,
            "to": 0.8,
            "fromPigment": "persimmon",
            "toPigment": "warm-gold",
            "opacity": 0.57,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W02",
            "center": 0.52,
            "width": 0.07990867579908677,
            "fit": {
              "repeat": 16,
              "motifWidthU": 0.04,
              "bandHeight": 0.14,
              "center": 0.59
            }
          }
        ],
        "details": [
          {
            "id": "O10-D01",
            "center": 0.81,
            "width": 0.022,
            "bandHeight": 0.038543999999999995,
            "source": {
              "type": "ring",
              "args": [
                0.81,
                "#eee9da",
                0.022
              ]
            }
          },
          {
            "id": "O10-D02",
            "center": 0.55,
            "width": 0.02099609375,
            "bandHeight": 0.03678515625,
            "source": {
              "type": "ticks",
              "args": [
                0.55,
                "#e5d6b7",
                36,
                18,
                4
              ]
            }
          },
          {
            "id": "O10-D03",
            "center": 0.64,
            "width": 0.005859375,
            "bandHeight": 0.010265625,
            "source": {
              "type": "dots",
              "args": [
                0.64,
                "#e5d6b7",
                30,
                3
              ]
            }
          },
          {
            "id": "O10-D04",
            "center": 0.69,
            "width": 0.0029296875,
            "bandHeight": 0.0051328125,
            "source": {
              "type": "stroke",
              "args": [
                0.69,
                "#e5d6b7",
                3
              ]
            }
          },
          {
            "id": "O10-D05",
            "center": 0.43,
            "width": 0.0224609375,
            "bandHeight": 0.0393515625,
            "source": {
              "type": "diamonds",
              "args": [
                0.43,
                "#e5d6b7",
                24,
                9
              ]
            }
          },
          {
            "id": "O10-D06",
            "center": 0.31,
            "width": 0.02685546875,
            "bandHeight": 0.04705078125,
            "source": {
              "type": "braided",
              "args": [
                0.31,
                "#a35f51",
                18,
                12
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 3,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring",
            "W02"
          ],
          "pigmentIds": [
            "rice-white",
            "iron-red",
            "persimmon",
            "warm-gold"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "W02",
              "shopGateSales": 4,
              "shopPrice": 520,
              "requiresOwnership": true
            }
          ],
          "pigmentAccess": [
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "iron-red",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "persimmon",
              "shopGateSales": 2,
              "shopPrice": 180,
              "requiresOwnership": true
            },
            {
              "id": "warm-gold",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/ye-kiln-water-jar-10.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "夹砂粗陶、亚光表面、双层标准纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "coarse-earthenware",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 5,
        "shopPrice": 460,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 1
      },
      "unlocksNextOrderId": "mei-rice-bowl-11",
      "legacy": null
    },
    {
      "id": "mei-rice-bowl-11",
      "sequence": 11,
      "act": 4,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "梅婶",
        "role": "退休窑工",
        "from": "退休窑工梅婶，由叶青介绍。",
        "introducedBy": "ye-kiln-water-jar-10"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "ye-kiln-water-jar-10",
        "requiresReadReply": true
      },
      "title": "梅婶的家用饭碗",
      "letter": "叶青把罐送来，我知道你手上有活。她又劝我给馆里讲什么‘三道线的起源’，说得我头疼。底下一道是看足修齐没有；中间那道，摸着顺手；最上面那道，后来岑北那帮记潮的也用。哪有一个人一夜想出来的。给我做只饭碗吧，夹点砂，口厚些，三条线别量得一样齐。我天天吃饭用，可不是搁柜里看的。",
      "replies": {
        "basic": "用上了。你这碗跟我从前做的有点两样，不过饭没漏，算合格。岑北来串门，非盯着上头那条线看。我叫他有话去跟你说，别耽误我吃饭。",
        "close": "口沿好，刮嘴的毛病你没犯。岑北捧着碗半天，说他那本旧测潮簿里还有这一道的数字。我让他回去找，找不着也得给我说一声。",
        "excellent": "这碗我舍不得夸，怕你以后只做好看的不做结实的。不过确实好用。岑北来了，沿着三道线摸了一圈，饭都没顾上吃，就回家找他的测潮簿。下回让他自己写信，他写字比我细。"
      },
      "reference": {
        "status": "ready",
        "description": "夹砂粗陶厚口饭碗，低足、腹部宽展、内侧较平、外壁保留粗颗粒，高宽比约 0.62；外壁下、中、上三道深褐标准环，间距故意不相等。",
        "shapeFamily": "rice-bowl",
        "materialId": "coarse-earthenware",
        "heightWidthRatio": 0.62,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.45
            ],
            [
              0.1,
              0.47
            ],
            [
              0.33,
              0.63
            ],
            [
              0.65,
              0.78
            ],
            [
              0.92,
              0.84
            ],
            [
              1,
              0.84
            ]
          ],
          "estimatedHeight": 1.042
        },
        "rings": [
          {
            "center": 0.26,
            "color": "#554036",
            "width": 0.022
          },
          {
            "center": 0.49,
            "color": "#554036",
            "width": 0.022
          },
          {
            "center": 0.79,
            "color": "#554036",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.86,
            "fromPigment": "chestnut",
            "toPigment": "amber",
            "opacity": 0.85,
            "edge": 0.09
          },
          {
            "from": 0.39,
            "to": 0.78,
            "fromPigment": "amber",
            "toPigment": "sun-yellow",
            "opacity": 0.72,
            "edge": 0.08
          }
        ],
        "motifs": [],
        "details": [
          {
            "id": "O11-D01",
            "center": 0.26,
            "width": 0.022,
            "bandHeight": 0.022924,
            "source": {
              "type": "ring",
              "args": [
                0.26,
                "#554036",
                0.022
              ]
            }
          },
          {
            "id": "O11-D02",
            "center": 0.49,
            "width": 0.022,
            "bandHeight": 0.022924,
            "source": {
              "type": "ring",
              "args": [
                0.49,
                "#554036",
                0.022
              ]
            }
          },
          {
            "id": "O11-D03",
            "center": 0.79,
            "width": 0.022,
            "bandHeight": 0.022924,
            "source": {
              "type": "ring",
              "args": [
                0.79,
                "#554036",
                0.022
              ]
            }
          },
          {
            "id": "O11-D04",
            "center": 0.36,
            "width": 0.005859375,
            "bandHeight": 0.006105468750000001,
            "source": {
              "type": "dots",
              "args": [
                0.36,
                "#88644e",
                34,
                3
              ]
            }
          },
          {
            "id": "O11-D05",
            "center": 0.64,
            "width": 0.01416015625,
            "bandHeight": 0.0147548828125,
            "source": {
              "type": "ticks",
              "args": [
                0.64,
                "#88644e",
                42,
                11,
                4
              ]
            }
          },
          {
            "id": "O11-D06",
            "center": 0.7,
            "width": 0.0029296875,
            "bandHeight": 0.0030527343750000003,
            "source": {
              "type": "stroke",
              "args": [
                0.7,
                "#88644e",
                3,
                [
                  15,
                  11
                ]
              ]
            }
          },
          {
            "id": "O11-D07",
            "center": 0.59,
            "width": 0.0263671875,
            "bandHeight": 0.027474609375,
            "source": {
              "type": "diamonds",
              "args": [
                0.59,
                "#bd9a61",
                24,
                11
              ]
            }
          },
          {
            "id": "O11-D08",
            "center": 0.37,
            "width": 0.051660156250000006,
            "bandHeight": 0.05382988281250001,
            "source": {
              "type": "leafChain",
              "args": [
                0.37,
                "#e5d6b7",
                20,
                11
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 3,
          "base": "bare-clay",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "chestnut",
            "amber",
            "sun-yellow"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "chestnut",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "amber",
              "shopGateSales": 2,
              "shopPrice": 180,
              "requiresOwnership": true
            },
            {
              "id": "sun-yellow",
              "shopGateSales": 2,
              "shopPrice": 180,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/mei-rice-bowl-11.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "夹砂粗陶、三环不同高度。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "coarse-earthenware",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 5,
        "shopPrice": 460,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "cen-tide-bowl-12",
      "legacy": null
    },
    {
      "id": "cen-tide-bowl-12",
      "sequence": 12,
      "act": 4,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "岑北",
        "role": "退休测潮员",
        "from": "退休测潮员岑北，由梅婶介绍。",
        "introducedBy": "mei-rice-bowl-11"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "mei-rice-bowl-11",
        "requiresReadReply": true
      },
      "title": "岑北的测潮小钵",
      "letter": "梅婶叫我把话写给你，不许只在她家饭桌上讲。旧簿子我找到了，纸边烂了，数字还在。你做只直身的小钵给我，底色淡一点，三条线颜色分开，别全涂成一样的蓝。我带它和簿子上山，省得他们看见一堆数就打呵欠。梅婶说你手稳，我信她一次。",
      "replies": {
        "basic": "东西交了。林栖让我把旧簿子的日期再核一遍，我回家翻了半天，原来自己记错一个月。幸亏她问。沈桥听见馆里要重新写码头的事，今早来敲我门。",
        "close": "小钵放在簿子旁边，贺馆长一指就知道我说哪条线了。名字的事还得核，我把能想起来的人都列了。沈桥来问旧台阶还能不能用；这事我可不敢只凭记忆答他。",
        "excellent": "馆里那张图，总算有人把三条线跟我簿子里的数对上了。林栖说旧展签得改，我说改前先给还在的人看。沈桥自告奋勇拿草稿去街上转；他跑得比年轻时候还快。"
      },
      "reference": {
        "status": "ready",
        "description": "红陶土直壁小钵，重底、直腰、平整圆口，高宽比约 0.72；腹部先铺极淡的蓝灰混色底，底部深灰标准环、中腰淡蓝标准环、口下深蓝标准环，三色对比清楚。参照图附一页数字水位记录，数字只作叙事资料，不要求玩家刻字。",
        "shapeFamily": "straight-bowl",
        "materialId": "red-earth",
        "heightWidthRatio": 0.72,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.55
            ],
            [
              0.1,
              0.57
            ],
            [
              0.32,
              0.59
            ],
            [
              0.7,
              0.6
            ],
            [
              0.95,
              0.61
            ],
            [
              1,
              0.61
            ]
          ],
          "estimatedHeight": 0.878
        },
        "rings": [
          {
            "center": 0.2,
            "color": "#51555a",
            "width": 0.022
          },
          {
            "center": 0.5,
            "color": "#9ab7c2",
            "width": 0.022
          },
          {
            "center": 0.83,
            "color": "#496d91",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.86,
            "fromPigment": "night-blue",
            "toPigment": "sky-blue",
            "opacity": 0.86,
            "edge": 0.09
          },
          {
            "from": 0.36,
            "to": 0.79,
            "fromPigment": "sky-blue",
            "toPigment": "rice-white",
            "opacity": 0.59,
            "edge": 0.08
          }
        ],
        "motifs": [],
        "details": [
          {
            "id": "O12-D01",
            "center": 0.2,
            "width": 0.022,
            "bandHeight": 0.019316,
            "source": {
              "type": "ring",
              "args": [
                0.2,
                "#51555a",
                0.022
              ]
            }
          },
          {
            "id": "O12-D02",
            "center": 0.5,
            "width": 0.022,
            "bandHeight": 0.019316,
            "source": {
              "type": "ring",
              "args": [
                0.5,
                "#9ab7c2",
                0.022
              ]
            }
          },
          {
            "id": "O12-D03",
            "center": 0.83,
            "width": 0.022,
            "bandHeight": 0.019316,
            "source": {
              "type": "ring",
              "args": [
                0.83,
                "#496d91",
                0.022
              ]
            }
          },
          {
            "id": "O12-D04",
            "center": 0.37,
            "width": 0.01904296875,
            "bandHeight": 0.0167197265625,
            "source": {
              "type": "ticks",
              "args": [
                0.37,
                "#3d557c",
                42,
                16,
                0
              ]
            }
          },
          {
            "id": "O12-D05",
            "center": 0.64,
            "width": 0.005859375,
            "bandHeight": 0.00514453125,
            "source": {
              "type": "dots",
              "args": [
                0.64,
                "#758c97",
                28,
                3
              ]
            }
          },
          {
            "id": "O12-D06",
            "center": 0.7,
            "width": 0.0029296875,
            "bandHeight": 0.002572265625,
            "source": {
              "type": "stroke",
              "args": [
                0.7,
                "#758c97",
                3,
                [
                  13,
                  15
                ]
              ]
            }
          },
          {
            "id": "O12-D07",
            "center": 0.62,
            "width": 0.0263671875,
            "bandHeight": 0.023150390625,
            "source": {
              "type": "diamonds",
              "args": [
                0.62,
                "#e5d6b7",
                20,
                11
              ]
            }
          },
          {
            "id": "O12-D08",
            "center": 0.37,
            "width": 0.02880859375,
            "bandHeight": 0.0252939453125,
            "source": {
              "type": "braided",
              "args": [
                0.37,
                "#e5d6b7",
                18,
                13
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 4,
          "base": "soft-mix",
          "patternIds": [
            "solid-ring"
          ],
          "pigmentIds": [
            "ash-gray",
            "mist-blue",
            "night-blue",
            "sky-blue",
            "rice-white"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ],
          "pigmentAccess": [
            {
              "id": "ash-gray",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "night-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            },
            {
              "id": "sky-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            },
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/cen-tide-bowl-12.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "直壁、双颜料浅底、三色准确定位。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "red-earth",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 2,
        "shopPrice": 180,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 7,
        "tiers": {
          "basic": [
            7
          ],
          "close": [
            8
          ],
          "excellent": [
            9,
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "shen-trial-cup-13",
      "legacy": null
    },
    {
      "id": "shen-trial-cup-13",
      "sequence": 13,
      "act": 5,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "沈桥",
        "role": "渡工",
        "from": "沈桥再次来信；12 的回信后开放。",
        "introducedBy": "cen-tide-bowl-12"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "cen-tide-bowl-12",
        "requiresReadReply": true
      },
      "title": "沈桥的试航茶杯",
      "letter": "旧台阶清出来了。岑北量过，能走；我还是想先空船试两趟。试航那天大家说要上来喝茶，唐叔已经答应烧水。我想再请你做几个矮杯中的第一只，样子照图，棕线在下、蓝线在上；中间一点浅蓝慢慢散掉，别涂满。上次那个旧杯我舍不得带去，留在家里。",
      "replies": {
        "basic": "试了两趟，船没事，茶洒了一点，是我自己脚滑。杯子大家轮着用了。林栖跟船拍照，回来问开幕那天能不能借这张。",
        "close": "第一趟带了梅婶，第二趟带了许老师那班孩子。孩子们把杯子传了一圈，唐叔说我应该收茶钱。林栖拍到一张很好的照片，说要拿去展厅用。",
        "excellent": "船靠岸时梅婶指着杯上的棕线，说脚得踩实；岑北指蓝线，说还要看水。我叫他们别在跳板上吵，两人竟都笑了。林栖把那会儿拍下来了，照片比摆拍好。"
      },
      "reference": {
        "status": "ready",
        "description": "砂泥矮直杯，宽足、略收腹、厚圆口，高宽比约 0.9；杯身下部一道棕色标准环、肩下一道蓝色「曲岸」标准纹带，中间由浅蓝渐退回泥本色，保留大段透气的空白。图旁是修好的渡口台阶，台阶不计分。",
        "shapeFamily": "low-cup",
        "materialId": "stoneware",
        "heightWidthRatio": 0.9,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.53
            ],
            [
              0.12,
              0.55
            ],
            [
              0.38,
              0.56
            ],
            [
              0.68,
              0.53
            ],
            [
              0.9,
              0.52
            ],
            [
              1,
              0.56
            ]
          ],
          "estimatedHeight": 1.008
        },
        "rings": [
          {
            "center": 0.26,
            "color": "#8d6953",
            "width": 0.022
          },
          {
            "center": 0.78,
            "color": "#748fa6",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.82,
            "fromPigment": "lake-blue",
            "toPigment": "sea-glass",
            "opacity": 0.84,
            "edge": 0.09
          },
          {
            "from": 0.45,
            "to": 0.78,
            "fromPigment": "sea-glass",
            "toPigment": "rice-white",
            "opacity": 0.54,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W19",
            "center": 0.78,
            "width": 0.17857142857142858,
            "fit": {
              "repeat": 10,
              "motifWidthU": 0.1,
              "bandHeight": 0.18,
              "center": 0.55
            }
          }
        ],
        "details": [
          {
            "id": "O13-D01",
            "center": 0.26,
            "width": 0.022,
            "bandHeight": 0.022175999999999998,
            "source": {
              "type": "ring",
              "args": [
                0.26,
                "#8d6953",
                0.022
              ]
            }
          },
          {
            "id": "O13-D02",
            "center": 0.6,
            "width": 0.029296875,
            "bandHeight": 0.029531250000000002,
            "source": {
              "type": "arcs",
              "args": [
                0.6,
                "#758c97",
                20,
                13
              ]
            }
          },
          {
            "id": "O13-D03",
            "center": 0.41,
            "width": 0.005859375,
            "bandHeight": 0.00590625,
            "source": {
              "type": "dots",
              "args": [
                0.41,
                "#758c97",
                28,
                3
              ]
            }
          },
          {
            "id": "O13-D04",
            "center": 0.32,
            "width": 0.0029296875,
            "bandHeight": 0.002953125,
            "source": {
              "type": "stroke",
              "args": [
                0.32,
                "#88644e",
                3,
                [
                  12,
                  10
                ]
              ]
            }
          },
          {
            "id": "O13-D05",
            "center": 0.51,
            "width": 0.07744140625000001,
            "bandHeight": 0.07806093750000001,
            "source": {
              "type": "leafChain",
              "args": [
                0.51,
                "#e5d6b7",
                18,
                17
              ]
            }
          },
          {
            "id": "O13-D06",
            "center": 0.69,
            "width": 0.02685546875,
            "bandHeight": 0.0270703125,
            "source": {
              "type": "braided",
              "args": [
                0.69,
                "#3d557c",
                16,
                12
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 4,
          "base": "soft-gradient",
          "patternIds": [
            "solid-ring",
            "W19"
          ],
          "pigmentIds": [
            "chestnut",
            "mist-blue",
            "lake-blue",
            "sea-glass",
            "rice-white"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "W19",
              "shopGateSales": 7,
              "shopPrice": 850,
              "requiresOwnership": true
            }
          ],
          "pigmentAccess": [
            {
              "id": "chestnut",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "lake-blue",
              "shopGateSales": 7,
              "shopPrice": 750,
              "requiresOwnership": true
            },
            {
              "id": "sea-glass",
              "shopGateSales": 7,
              "shopPrice": 750,
              "requiresOwnership": true
            },
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/shen-trial-cup-13.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "收腹、双纹带和浅蓝柔和渐退。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "stoneware",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 10,
        "shopPrice": 1250,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 8,
        "tiers": {
          "basic": [
            8
          ],
          "close": [
            9
          ],
          "excellent": [
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "lin-shared-plate-14",
      "legacy": null
    },
    {
      "id": "lin-shared-plate-14",
      "sequence": 14,
      "act": 5,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "林栖",
        "role": "博物馆馆藏助理",
        "from": "林栖代表博物馆来信；13 的回信后开放。",
        "introducedBy": "shen-trial-cup-13"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "shen-trial-cup-13",
        "requiresReadReply": true
      },
      "title": "林栖的共同展盘",
      "letter": "开幕定在下月初。展签改了三稿，梅婶嫌字太小，贺馆长说再加大一点。入口还差只浅盘，给来的人放写着名字的小卡；别让卡片堆在签到簿旁边。我画了尺寸，盘心留白，盘沿一点淡蓝底，三条细纹沿边走就够。馆里会注明是您这次做的新器。试航照片很好，我已问过照片里的人，大家都同意展出。",
      "replies": {
        "basic": "盘摆好了，第一张卡是梅婶自己放的。她写字比我想的还大。晏泊今天来帮忙搬桌子，说展完还该在旧街吃顿饭，叫我别只顾着馆里。",
        "close": "盘里的卡越来越多，连贺馆长都放了一张，写的是她老师的名字。晏泊帮我们搬椅子，忽然说旧街也该摆桌。他、梅婶和沈桥在商量菜单，似乎还想请您做碗。",
        "excellent": "开幕那天我忙到忘了吃饭。收场时盘里一层名字，我认得一半，另一半得慢慢问。晏泊说别光收材料了，明天去旧街吃饭。梅婶立刻说：‘让窑房做碗，别拿馆里的盘盛汤。’"
      },
      "reference": {
        "status": "ready",
        "description": "白瓷大浅盘，极低足、平缓盘心、宽而微抬的口沿，高宽比约 0.3；盘沿先铺很浅的灰蓝底并柔和淡出，外侧贴砂褐、灰蓝两道标准环及一条素白「白线回环」标准纹带，盘心不画人物或文字。",
        "shapeFamily": "wide-plate",
        "materialId": "porcelain",
        "heightWidthRatio": 0.3,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.58
            ],
            [
              0.08,
              0.6
            ],
            [
              0.25,
              0.76
            ],
            [
              0.5,
              0.9
            ],
            [
              0.8,
              0.98
            ],
            [
              1,
              0.99
            ]
          ],
          "estimatedHeight": 0.594
        },
        "rings": [
          {
            "center": 0.69,
            "color": "#a98161",
            "width": 0.022
          },
          {
            "center": 0.79,
            "color": "#95a9b2",
            "width": 0.022
          },
          {
            "center": 0.88,
            "color": "#eee9dc",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.13,
            "to": 0.88,
            "fromPigment": "rice-white",
            "toPigment": "sky-blue",
            "opacity": 0.76,
            "edge": 0.1
          },
          {
            "from": 0.64,
            "to": 0.95,
            "fromPigment": "sky-blue",
            "toPigment": "frost",
            "opacity": 0.78,
            "edge": 0.08
          }
        ],
        "motifs": [
          {
            "id": "W24",
            "center": 0.88,
            "width": 0.26936026936026936,
            "fit": {
              "repeat": 16,
              "motifWidthU": 0.07,
              "bandHeight": 0.16,
              "center": 0.55
            }
          }
        ],
        "details": [
          {
            "id": "O14-D01",
            "center": 0.69,
            "width": 0.022,
            "bandHeight": 0.013067999999999998,
            "source": {
              "type": "ring",
              "args": [
                0.69,
                "#a98161",
                0.022
              ]
            }
          },
          {
            "id": "O14-D02",
            "center": 0.79,
            "width": 0.022,
            "bandHeight": 0.013067999999999998,
            "source": {
              "type": "ring",
              "args": [
                0.79,
                "#95a9b2",
                0.022
              ]
            }
          },
          {
            "id": "O14-D03",
            "center": 0.73,
            "width": 0.005859375,
            "bandHeight": 0.00348046875,
            "source": {
              "type": "dots",
              "args": [
                0.73,
                "#758c97",
                32,
                3
              ]
            }
          },
          {
            "id": "O14-D04",
            "center": 0.62,
            "width": 0.0029296875,
            "bandHeight": 0.001740234375,
            "source": {
              "type": "stroke",
              "args": [
                0.62,
                "#758c97",
                3
              ]
            }
          },
          {
            "id": "O14-D05",
            "center": 0.95,
            "width": 0.0029296875,
            "bandHeight": 0.001740234375,
            "source": {
              "type": "stroke",
              "args": [
                0.95,
                "#e5d6b7",
                3
              ]
            }
          },
          {
            "id": "O14-D06",
            "center": 0.67,
            "width": 0.0283203125,
            "bandHeight": 0.016822265625,
            "source": {
              "type": "diamonds",
              "args": [
                0.67,
                "#758c97",
                24,
                12
              ]
            }
          },
          {
            "id": "O14-D07",
            "center": 0.93,
            "width": 0.01904296875,
            "bandHeight": 0.0113115234375,
            "source": {
              "type": "braided",
              "args": [
                0.93,
                "#e5d6b7",
                20,
                8
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 5,
          "base": "soft-gradient",
          "patternIds": [
            "solid-ring",
            "W24"
          ],
          "pigmentIds": [
            "sand",
            "ash-gray",
            "rice-white",
            "mist-blue",
            "sky-blue",
            "frost"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "W24",
              "shopGateSales": 14,
              "shopPrice": 1800,
              "requiresOwnership": true
            }
          ],
          "pigmentAccess": [
            {
              "id": "sand",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "ash-gray",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "sky-blue",
              "shopGateSales": 4,
              "shopPrice": 360,
              "requiresOwnership": true
            },
            {
              "id": "frost",
              "shopGateSales": 12,
              "shopPrice": 1500,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/lin-shared-plate-14.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "低矮宽盘、浅底渐退、三道窄纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "shop-owned",
        "materialId": "porcelain",
        "requiresOwnership": true,
        "status": "ready",
        "shopGateSales": 20,
        "shopPrice": 3600,
        "note": "Requires the normal shop purchase. Show the sales and coin requirement; do not loan or grant the material from the letter."
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 8,
        "tiers": {
          "basic": [
            8
          ],
          "close": [
            9
          ],
          "excellent": [
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 2
      },
      "unlocksNextOrderId": "neighbors-feast-bowl-15",
      "legacy": null
    },
    {
      "id": "neighbors-feast-bowl-15",
      "sequence": 15,
      "act": 5,
      "contentVersion": "2026-10-05.2",
      "status": "playable",
      "implementation": "playable",
      "customer": {
        "name": "晏泊、梅婶、沈桥、闻梨、林栖",
        "role": "旧街与博物馆居民",
        "from": "晏泊执笔，梅婶、沈桥、闻梨、林栖共同署名；14 的回信后开放。",
        "introducedBy": "lin-shared-plate-14"
      },
      "unlock": {
        "type": "after-reply",
        "afterOrderId": "lin-shared-plate-14",
        "requiresReadReply": true
      },
      "title": "众人的开席碗",
      "letter": "本来是我来画碗，画到第三笔，梅婶把纸拿走了，说我那碗只适合挂墙。沈桥嫌底不稳，闻梨嫌口太窄，林栖担心大家拿了馆里的展盘盛汤。最后一张图附上了，五个人改得乱七八糟，请你看着做：能盛唐叔的热汤，底稳，洗着顺手，外头两种浅颜色碰在一起，三道纹留在外面。花瓣那圈阿蘅挑过了，现成的就行，别替她画得太工整。等碗烧好就开席，你来晚了可没菜。——晏泊代写；梅婶说‘别写代写，写请客’",
      "replies": {
        "basic": "碗上桌了，第一勺汤让唐叔舀走，说他有检查器皿的责任。大家吃完还坐着，梅婶嫌晏泊写的菜单太花。明早碗送回你那儿，我们还要借着用。",
        "close": "唐叔说这碗盛汤合适，梅婶说足够稳。晏泊想把它拍进画册，被闻梨拦下，先让大伙吃完。照片林栖会留一张；碗先放唐叔摊上，明天早饭继续用。",
        "excellent": "梅婶端起来就说‘这才像碗’。沈桥喝了两口，问能不能再订一只，船上那只总有人借走。晏泊拍了一张空碗，被唐叔说‘汤都没了你才想起来’。大家催我寄信，叫你下回早点来吃。——林栖；旁边五个人看过，都说可以寄"
      },
      "reference": {
        "status": "ready",
        "description": "暖陶土大饭碗，厚实低足、舒展圆腹、微外翻的圆润口，高宽比约 0.6；外腹先叠出砂褐与灰蓝的柔和过渡，再贴下方砂褐标准环、中部灰蓝标准环、肩下一条浅白「窗台菊影」标准纹带，内壁保持泥本色。参照图是五个人各画一小段后拼成的轮廓，边上写“请做能上桌的碗”。",
        "shapeFamily": "large-rice-bowl",
        "materialId": "warm-earth",
        "heightWidthRatio": 0.6,
        "profileDraft": {
          "status": "art-standard-aligned",
          "radiusKnots": [
            [
              0,
              0.52
            ],
            [
              0.08,
              0.54
            ],
            [
              0.3,
              0.67
            ],
            [
              0.6,
              0.83
            ],
            [
              0.87,
              0.88
            ],
            [
              1,
              0.91
            ]
          ],
          "estimatedHeight": 1.092
        },
        "rings": [
          {
            "center": 0.27,
            "color": "#aa8a6b",
            "width": 0.022
          },
          {
            "center": 0.51,
            "color": "#8299a6",
            "width": 0.022
          },
          {
            "center": 0.8,
            "color": "#eee7d8",
            "width": 0.022
          }
        ],
        "paintZones": [
          {
            "from": 0.12,
            "to": 0.85,
            "fromPigment": "pine-green",
            "toPigment": "celadon",
            "opacity": 0.84,
            "edge": 0.1
          },
          {
            "from": 0.42,
            "to": 0.82,
            "fromPigment": "celadon",
            "toPigment": "rice-white",
            "opacity": 0.58,
            "edge": 0.08
          },
          {
            "from": 0.68,
            "to": 0.91,
            "fromPigment": "rice-white",
            "toPigment": "sea-glass",
            "opacity": 0.57,
            "edge": 0.07
          }
        ],
        "motifs": [
          {
            "id": "W08",
            "center": 0.8,
            "width": 0.1648351648351648,
            "fit": {
              "repeat": 13,
              "motifWidthU": 0.05,
              "bandHeight": 0.18,
              "center": 0.55
            }
          }
        ],
        "details": [
          {
            "id": "O15-D01",
            "center": 0.27,
            "width": 0.022,
            "bandHeight": 0.024024,
            "source": {
              "type": "ring",
              "args": [
                0.27,
                "#aa8a6b",
                0.022
              ]
            }
          },
          {
            "id": "O15-D02",
            "center": 0.51,
            "width": 0.022,
            "bandHeight": 0.024024,
            "source": {
              "type": "ring",
              "args": [
                0.51,
                "#8299a6",
                0.022
              ]
            }
          },
          {
            "id": "O15-D03",
            "center": 0.68,
            "width": 0.0068359375,
            "bandHeight": 0.00746484375,
            "source": {
              "type": "dots",
              "args": [
                0.68,
                "#e5d6b7",
                32,
                3.5
              ]
            }
          },
          {
            "id": "O15-D04",
            "center": 0.64,
            "width": 0.03125,
            "bandHeight": 0.034125,
            "source": {
              "type": "arcs",
              "args": [
                0.64,
                "#758c97",
                24,
                14
              ]
            }
          },
          {
            "id": "O15-D05",
            "center": 0.61,
            "width": 0.0029296875,
            "bandHeight": 0.0031992187500000002,
            "source": {
              "type": "stroke",
              "args": [
                0.61,
                "#758c97",
                3,
                [
                  16,
                  11
                ]
              ]
            }
          },
          {
            "id": "O15-D06",
            "center": 0.61,
            "width": 0.09892578125000001,
            "bandHeight": 0.10802695312500002,
            "source": {
              "type": "leafChain",
              "args": [
                0.61,
                "#667e68",
                18,
                22
              ]
            }
          },
          {
            "id": "O15-D07",
            "center": 0.39,
            "width": 0.03857421875,
            "bandHeight": 0.042123046875,
            "source": {
              "type": "braided",
              "args": [
                0.39,
                "#758c97",
                18,
                18
              ]
            }
          },
          {
            "id": "O15-D08",
            "center": 0.35,
            "width": 0.0244140625,
            "bandHeight": 0.02666015625,
            "source": {
              "type": "diamonds",
              "args": [
                0.35,
                "#e5d6b7",
                24,
                10
              ]
            }
          }
        ],
        "decoration": {
          "difficultyLevel": 5,
          "base": "mixed-gradient",
          "patternIds": [
            "solid-ring",
            "W08"
          ],
          "pigmentIds": [
            "sand",
            "mist-blue",
            "rice-white",
            "pine-green",
            "celadon",
            "sea-glass"
          ],
          "standardPatternsOnly": true,
          "requiresFreehand": false,
          "patternAccess": [
            {
              "id": "solid-ring",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "W08",
              "shopGateSales": 22,
              "shopPrice": 3700,
              "requiresOwnership": true
            }
          ],
          "pigmentAccess": [
            {
              "id": "sand",
              "shopGateSales": 0,
              "shopPrice": 90,
              "requiresOwnership": true
            },
            {
              "id": "mist-blue",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "rice-white",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "pine-green",
              "shopGateSales": 0,
              "shopPrice": 0,
              "requiresOwnership": false
            },
            {
              "id": "celadon",
              "shopGateSales": 12,
              "shopPrice": 1500,
              "requiresOwnership": true
            },
            {
              "id": "sea-glass",
              "shopGateSales": 7,
              "shopPrice": 750,
              "requiresOwnership": true
            }
          ]
        },
        "art": {
          "kind": "engine-rendered-photo",
          "path": "assets/order-references/season1/neighbors-feast-bowl-15.png"
        },
        "artStatus": "implemented",
        "scoreTargetStatus": "implemented"
      },
      "techniqueBrief": "综合器型、双底色混合与三道标准纹带。",
      "requiredCapabilities": [
        "wheel-shape",
        "surface-color",
        "pattern-band",
        "photo"
      ],
      "materialAccess": {
        "mode": "free-material",
        "materialId": "warm-earth",
        "requiresOwnership": false,
        "status": "ready",
        "shopGateSales": 0,
        "shopPrice": 0
      },
      "futureCapabilities": [],
      "scoring": {
        "status": "ready",
        "minimumShapeStars": 3,
        "minimumDecorationStars": 3,
        "minimumTotalStars": 8,
        "tiers": {
          "basic": [
            8
          ],
          "close": [
            9
          ],
          "excellent": [
            10
          ]
        }
      },
      "replyDelay": {
        "otherWorks": 1
      },
      "unlocksNextOrderId": null,
      "legacy": null
    }
  ],
  "dailyLetters": [
    {
      "id": "daily-after-03",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "shen-ferry-cup-03",
        "stage": "sent"
      },
      "sender": "唐叔",
      "text": "沈桥上回那碗汤钱补了，还多给一枚，说让你别听我讲他坏话。我偏要讲。",
      "rewards": false,
      "blocksProgress": false
    },
    {
      "id": "daily-after-05",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "xu-seed-bowl-05",
        "stage": "sent"
      },
      "sender": "许禾",
      "text": "草发芽了！数种子的孩子今天数出六根苗，终于比昨天多。我把碗挪到他够不着的窗台了。",
      "rewards": false,
      "blocksProgress": false
    },
    {
      "id": "daily-after-08",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "he-welcome-bowl-08",
        "stage": "sent"
      },
      "sender": "贺清",
      "text": "保洁阿姨托我问一句：那只碗若摔了，还能请您做一只吗？她说这次她会小心。我说当然可以。",
      "rewards": false,
      "blocksProgress": false
    },
    {
      "id": "daily-after-10",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "ye-kiln-water-jar-10",
        "stage": "sent"
      },
      "sender": "叶青",
      "text": "梅婶说我筛砂偷懒那件事是真的，但我当时只有八岁。晏泊笑了一整天。请不要把这段写进展签。",
      "rewards": false,
      "blocksProgress": false
    },
    {
      "id": "daily-after-12",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "cen-tide-bowl-12",
        "stage": "sent"
      },
      "sender": "闻梨",
      "text": "岑北在我店里核日期，点一壶茶坐了三个时辰。茶我没收钱；他把我奶奶账本上一个错字圈出来了，算扯平。",
      "rewards": false,
      "blocksProgress": false
    },
    {
      "id": "daily-after-15",
      "contentVersion": "2026-10-05.2",
      "unlock": {
        "orderId": "neighbors-feast-bowl-15",
        "stage": "replied"
      },
      "sender": "阿蘅",
      "text": "桌上那只大碗唐叔说不卖。我娘问能不能拿来插花。我说您还是让它盛汤吧，我再去窑房订个瓶。",
      "rewards": false,
      "blocksProgress": false
    }
  ],
  "futureFeatureSlots": [
    "handle",
    "lid",
    "piercing",
    "sculpted-attachments",
    "handwritten-text"
  ],
  "notes": "All fifteen orders use approved reference photos and renderer parameters; unlock in story order after the preceding reply."
};
  if(typeof module==='object'&&module.exports)module.exports=catalog;
  if(root)root.PotteryOrderCatalog=catalog;
})(typeof window!=='undefined'?window:null);
