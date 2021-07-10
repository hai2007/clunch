export default {
    nodes: {
        "no1": {
            "title": "开始",
            "type": "begin-end",
            "position": {
                "x": 303,
                "y": 78
            }
        },
        "no2": {
            "title": "初始化",
            "type": "estimate",
            "position": {
                "x": 297,
                "y": 168
            }
        },
        "no3": {
            "title": "检查状态",
            "type": "exec",
            "position": {
                "x": 299,
                "y": 288
            }
        },
        "no4": {
            "title": "是否正常?",
            "type": "calc",
            "position": {
                "x": 431,
                "y": 210
            }
        },
        "no5": {
            "title": "加载数据",
            "type": "estimate",
            "position": {
                "x": 572,
                "y": 139
            }
        },
        "no6": {
            "title": "运行",
            "type": "exec",
            "position": {
                "x": 570,
                "y": 251
            }
        },
        "no7": {
            "title": "是否完成?",
            "type": "calc",
            "position": {
                "x": 709,
                "y": 196
            }
        },
        "no8": {
            "title": "结束",
            "type": "begin-end",
            "position": {
                "x": 871,
                "y": 202
            }
        }
    },
    lines: {
        line1: {
            begin: "no1",
            end: "no2",
            info: ""
        },
        line2: {
            begin: "no2",
            end: "no3",
            info: ""
        },
        line3: {
            begin: "no3",
            end: "no4",
            info: ""
        },
        line4: {
            begin: "no4",
            end: "no2",
            info: '否'
        },
        line5: {
            begin: "no4",
            end: "no5",
            info: '是'
        },
        line6: {
            begin: "no5",
            end: "no6",
            info: ""
        },
        line7: {
            begin: "no6",
            end: "no7",
            info: ""
        },
        line8: {
            begin: "no7",
            end: "no5",
            info: "否"
        },
        line9: {
            begin: "no7",
            end: "no8",
            info: '是'
        }
    }
};